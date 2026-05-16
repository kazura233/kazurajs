# `setTimeout` 包裹任务以规避浏览器后台节流的原理分析

> 本文档对应 `packages/web-daemon/src/index.ts` 中 `forceCall` 内的关键写法：
>
> ```ts
> public forceCall() {
>   this.len++
>   // 关键：用一个空 setTimeout 把真正的 task 调用包裹起来
>   global.setTimeout(() => this.task(() => this.synchronize(), this))
>   if (this.isAtEnd()) this.pause()
> }
> ```
>
> 经过反复试验：只有这样写，整个守护程序在浏览器进入后台后才能保持继续触发；如果去掉这层 `setTimeout`、直接同步调用 `this.task(...)`，浏览器后台一段时间后定时器就会被显著节流甚至"看上去休眠"。

---

## 1. 背景：浏览器对后台定时器的多层节流

现代浏览器为了在用户切走标签页后降低 CPU 与电池消耗，会对**不可见页面（hidden / background tab）**的 `setTimeout` / `setInterval` 进行多层次的节流（throttling）。以 Chrome / Chromium 为例，这套机制经过了多次演进：

### 1.1 Chrome 11+：后台定时器对齐（Timer Alignment）

从 Chrome 11 开始，后台 tab 中相互独立的定时器**最多每秒触发一次**，并且会以"批处理（batching）"的方式集中唤醒进程，以减少 wake-up 次数。播放声音的页面、WebSocket / WebRTC 等场景可以豁免。

### 1.2 Chrome 57+：预算节流（Budget-based Throttling）

页面进入后台 **10 秒**后，浏览器会为每个后台 tab 维护一个**定时器执行预算（time budget）**：

- 每秒回填 `0.01s` 的预算（也就是大约 **1% 的 CPU 时间**）。
- 每次执行 timer 回调，会从预算里**扣除该回调实际消耗的 CPU 时间**。
- 当预算为负时，timer 不会再被触发，直到预算回填到非负为止。

播放音频、有 WebSocket/WebRTC 连接的页面可豁免。

### 1.3 Chrome 88+：强力节流（Intensive Throttling）

Chrome 88（2021 年 1 月）针对"链式定时器"引入了更激进的节流策略。当**同时满足**以下条件时，所有定时器会被改为**每分钟才统一检查一次**：

- 页面已经隐藏超过 **5 分钟**。
- 定时器的 **nesting count（嵌套层级，又称 chain count）≥ 5**。
- 页面静默（无音频输出）超过 **30 秒**。
- 没有正在使用的 WebRTC（`RTCDataChannel` / live `MediaStreamTrack`）。

如果都满足，那么哪怕你写的是 `setTimeout(fn, 1000)`，实际可能要等 60 秒才会触发一次。

### 1.4 关键概念：什么是"链式（chained）"定时器？

根据 HTML 规范以及 Chrome 团队的解释：

> If you call `setTimeout` in the same task as a `setTimeout` callback, the second invocation is 'chained'. With `setInterval`, each iteration is part of the chain.

也就是说：**在一个 timer 的回调（task）中再去调用 `setTimeout`，新创建的 timer 的 nesting level 会在父 timer 的基础上 + 1。** `setInterval` 的每次迭代被等价视为一次 chained `setTimeout`。

Chromium 的实现中（`third_party/blink/renderer/core/frame/dom_timer.cc`）维护了一个常量 `kMaxTimerNestingLevel = 5`，并把每个 `DOMTimer` 的 `nesting_level_` 设置为父执行上下文当前的 timer nesting level + 1。

---

## 2. 现象复盘：为什么"直接调 task"会被休眠？

`web-daemon` 的核心结构是一个**自我重排（self-rescheduling）的循环**：

```ts
public synchronize() {
  if (this.paused) return
  global.clearTimeout(this.timer)
  WebDaemon.daemons.delete(this.timer)
  this.timer = global.setTimeout(() => this.forceCall(), this.rate) // ← 主定时器
  WebDaemon.daemons.set(this.timer, this)
}

public forceCall() {
  this.len++
  // 假设这里是同步直调：this.task(() => this.synchronize(), this)
  if (this.isAtEnd()) this.pause()
}
```

### 2.1 如果 `forceCall` 中**同步直调** task：调用链与 nesting level

假设我们把 `forceCall` 改写为最朴素的版本：

```ts
public forceCall() {
  this.len++
  this.task(() => this.synchronize(), this) // 直接同步调用
  if (this.isAtEnd()) this.pause()
}
```

那么从守护程序启动开始，发生的事件是：

| 步骤 | 当前所在 task | 同步调用 | 创建的新 timer 的 nesting level |
| ---- | ------------- | -------- | ------------------------------- |
| `start()` → `synchronize()` | 普通脚本（非 timer 回调），nesting level = 0 | `setTimeout(forceCall, rate)` | **1** |
| `forceCall` 触发 | 上一步 timer 的回调，level = 1 | `task(next)` → 同步执行 → `next()` → `synchronize()` → `setTimeout(forceCall, rate)` | **2** |
| `forceCall` 触发 | timer 回调，level = 2 | 同上 | **3** |
| ... | ... | ... | **4 / 5 / 6 / ...** |

可以看到，**整条调用链 `forceCall → task → next → synchronize → setTimeout` 都发生在同一个 task 上下文里**，所以每次循环 nesting level 都 `+1`。

跑上 5 圈之后，新创建的 timer 的 nesting level 就 ≥ 5。这时只要页面后台时间超过 5 分钟（且没声音、没 WebRTC），就会精准命中 §1.3 描述的 Intensive Throttling，定时器从 `rate ms` 变成"最多每分钟才查一次"。

与此同时，预算节流（§1.2）的影响也会同步发生：

- `task` 通常会做一些"有意义"的工作（轮询、心跳、动画、计算 ……）。
- 这部分耗时**全部都在 timer 回调里同步发生**，会从后台 tab 的时间预算里直接扣除。
- 一段时间后预算被扣完，timer 也会暂停触发。

两种节流叠加起来，肉眼看到的现象就是"浏览器后台一段时间后，定时器像被休眠了一样"。

### 2.2 加上 `setTimeout(() => this.task(...))` 包裹之后

实际代码：

```ts
public forceCall() {
  this.len++
  global.setTimeout(() => this.task(() => this.synchronize(), this)) // delay = 0
  if (this.isAtEnd()) this.pause()
}
```

这一行的改动看似无害，实际上做了**三件非常重要的事**：

#### (a) 把 task 从主定时器回调里"剥离"出去

- 主定时器 `setTimeout(forceCall, rate)` 触发时，`forceCall` 在它自己的 task 中执行。
- 这个 task 现在**几乎是空的**——只做了 `len++`、调度一个新 timer、判断是否结束这三件事，**用时极短**。
- 用户提供的 `task` 函数（可能很重，可能包含同步计算、`fetch`、DOM 操作等）被推到**下一个独立 task** 中执行。

这对 §1.2 的**预算节流**至关重要：

> Chrome 的 budget 是按 **timer 回调消耗的 CPU 时间**来扣的。
>
> - 不包裹：`task` 的耗时 ≈ timer 回调耗时，每次循环都会扣很多预算 → 预算很快变负 → timer 不再触发。
> - 包裹：timer 回调本身几乎瞬间返回，**只扣极少的预算**；真正干活的 task 跑在一个普通 task 里，不在 timer budget 的核算范围内。

#### (b) 让 `task` 的执行上下文不再是"timer 的回调"

被 `setTimeout(fn, 0)` 包裹后，`task` 在一个**新的、独立的 task** 中执行。当 `task` 同步调用 `next() → synchronize() → setTimeout(forceCall, rate)` 时：

- 它**不是在主定时器的回调里**调用 `setTimeout` 的。
- 它在的是"**那个 0 延迟 setTimeout 触发出来的 task**"里调用 `setTimeout`。

这里有一个**实践上反复被验证、但规范并未强制要求的浏览器行为差异**：

> Chromium 在调度器层（参见 `scheduler-dev` 邮件列表里关于
> "Opting-out JS timers with nesting level ≤ 5 from intensive throttling" 的讨论以及相关 feature flag `OptOutZeroTimeoutTimersFromThrottling`）针对**零延迟 / 浅层嵌套的定时器**做了多次策略调整，使其在某些条件下**不参与 intensive throttling**，以便让"yield 给主循环"这种常见模式仍然能在后台保持响应。

这意味着：用 `setTimeout(() => ..., 0)` 把 task 包起来，相当于把"自我重排循环"伪装成**"两个浅层嵌套定时器交替调度"**，而不是一个**深度链式调用**——这正是绕开 Intensive Throttling 触发条件的关键。

#### (c) 对异步 task 友好

如果用户的 `task` 是一个 `async` 函数（例如内部 `await fetch(...)`），那么：

- 不包裹的写法下，`task` 启动的 Promise 链可能在某个完全不同的、不可控的 task 中 `resolve`，再加上 microtask 队列、`unhandledrejection` 等问题，行为不稳定。
- 包裹之后，`task` 的入口本身就是一个独立 task，更接近"普通业务代码 + 普通 setTimeout 调度"的形态，对外部框架（React、Vue、调试器、profiler 等）也更友好。

---

## 3. 把它和 `setInterval` 做对比

为什么作者不直接用 `setInterval`？

- `setInterval` 的每次迭代会被视为**同一条 chain** 的延续，等价于"在自己的回调里 `setTimeout` 自身"，nesting level 会持续累加并且**没有任何"打断"机会**。
- `setInterval` 在后台标签下被 §1.1 ~ §1.3 三层节流叠加得最厉害（且无法控制每次执行后是否要继续、是否要 `clear` 等）。
- 而 `web-daemon` 选择的是"**每轮显式 `setTimeout` + 手动重排**"的写法，再加上 `forceCall` 里的二级 `setTimeout(fn, 0)`，相当于：
  1. 每轮主循环都**新建**一个 timer，而不是复用同一个 interval。
  2. 在每轮内部再"yield"一次，避免链路被认作长链。

这两点合在一起，最大化地降低了被 Intensive Throttling 命中的概率。

---

## 4. 完整事件流对比

下面把"加 vs 不加 `setTimeout` 包裹"的事件流做最直观的对比。

### 4.1 不加包裹（一种被节流的写法）

```
[task A:  start()] ─▶ setTimeout(forceCall, rate) ─┐
                                                    │ rate ms
[task B:  forceCall #1]  ◀──────────────────────────┘
   │  task(next)                  ─┐
   │     ...synchronous work...     │  ← 全部在 task B 内
   │  next() = synchronize()        │     CPU 消耗都计入 budget
   │     setTimeout(forceCall, rate)│     nesting level += 1
   ▼                               ─┘
[task C:  forceCall #2]  level=2
[task D:  forceCall #3]  level=3
[task E:  forceCall #4]  level=4
[task F:  forceCall #5]  level=5  ── 触发 intensive throttling
        ⇒ 后续 timer 实际间隔变为 ~60s
```

### 4.2 加了 `setTimeout(() => task(...))` 包裹（当前实现）

```
[task A:  start()] ─▶ setTimeout(forceCall, rate) ─┐
                                                    │ rate ms
[task B:  forceCall #1]  ─ 只做 len++, schedule, return
   └▶ setTimeout(() => task(...), 0) ────┐
                                          │ ~0 ms（被 clamp 时可能为 4ms）
[task C:  inner-task]  ◀──────────────────┘
   │  task(next)                  ─┐
   │     ...synchronous work...     │  ← 在 task C 内
   │  next() = synchronize()        │     timer 回调（task B）本身耗时极短
   │     setTimeout(forceCall, rate)│     不会让 budget 快速归零
   ▼                               ─┘
[task D:  forceCall #2]  ── 调度器视角：两个浅层 timer 交替
[task E:  inner-task]
        ⇒ 不(容易)命中 intensive throttling 的 5 层嵌套条件
        ⇒ 单次 timer 回调耗时几乎可忽略 → budget 几乎不被扣
```

---

## 5. 结论与实践建议

1. **现象本质**：浏览器后台节流是**多层叠加**的（对齐 + 预算 + 强力节流），其中预算节流按 timer **回调内部消耗的 CPU 时间**扣账，强力节流按 **timer 嵌套层级**判断。
2. **`setTimeout(() => task(...))` 的双重作用**：
   - 让主定时器回调"瘦身"为几乎瞬时返回，从根本上**减少预算消耗**。
   - 让真正的工作脱离主定时器调用链，**降低被识别为深度 chained timer 的概率**，避开 Intensive Throttling。
3. **不要轻易"优化"掉这一行**。这看似多余的 `setTimeout` 是经过实测验证的"反节流"模式，删掉它会让守护程序在浏览器后台运行一段时间后行为变得不可预测。
4. **更可靠的替代方案**（如果业务允许）：
   - 切到 **Service Worker / SharedWorker / Web Worker**，Worker 内的定时器不受 visibility 节流影响。
   - 使用 **`Web Audio API` 的静默音频轨**或 **`WebRTC` 数据通道**等"豁免技巧"（注意合规与电量问题）。
   - 使用 **`Push API` / `Notification triggers` / WebSocket** 等"由服务端推送"的模型，本质上消灭对前端定时器的依赖。
   - 视觉相关的任务请使用 **`requestAnimationFrame`**，它会随页面隐藏自动暂停，反过来还能省电。

---

## 6. 参考资料

1. Jake Archibald, _Heavy throttling of chained JS timers beginning in Chrome 88_, Chrome for Developers Blog（介绍 nesting count / chain、minimal / throttling / intensive throttling 三档策略）。
   <https://developer.chrome.com/blog/timer-throttling-in-chrome-88>
2. Chrome for Developers, _Background tabs in Chrome 57_（Budget-based Throttling 的最初引入）。
   <https://developer.chrome.com/blog/background_tabs>
3. MDN Web Docs, _Window: setTimeout() method_ —— 章节 "Reasons for delays longer than specified" / "Timeouts in inactive tabs" / "Nesting level"。
   <https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout>
4. WHATWG HTML Standard, _Timers and user prompts_（`setTimeout` 算法、nesting level、4ms 最小延迟的规范级定义）。
   <https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html>
5. WHATWG HTML Issue #239, _Purpose of timer nesting level for repeating timers is unclear_（关于 nesting level 历史与目的的讨论）。
   <https://github.com/whatwg/html/issues/239>
6. WHATWG HTML Issue #10386, _setTimeout() nesting levels: browsers do not match specification_（各浏览器关于 nesting level 实际行为与规范的偏差）。
   <https://github.com/whatwg/html/issues/10386>
7. Chromium 源码：`third_party/blink/renderer/core/frame/dom_timer.cc`（`kMaxTimerNestingLevel`、`kMinimumInterval` 等关键常量与 nesting level 的递增逻辑）。
   <https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/frame/dom_timer.cc>
8. Chromium `scheduler-dev` 邮件列表，_Opting-out JS timers with nesting level ≤ 5 from intensive throttling_（说明 Chromium 在 intensive throttling 上对浅层嵌套定时器的豁免策略）。
   <https://groups.google.com/a/chromium.org/g/scheduler-dev/c/EWKYCZlWjpc>
9. Stack Overflow, _setTimeout/setInterval 1000ms lag in background tabs (Chrome and Firefox)_（社区对后台 tab 1s clamp 行为的最早讨论）。
   <https://stackoverflow.com/questions/19475894/settimeout-setinterval-1000ms-lag-in-background-tabs-chrome-and-firefox>
10. Page Visibility API（用于配合判断页面是否隐藏，进而决定要不要走"高频"逻辑）。
    <https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API>
11. 本仓库历史 issue：<https://github.com/kazura233/web-daemon/issues/1>（`globalThis` 兼容性的起源，对应 `index.ts` 顶部的注释）。
