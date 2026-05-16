# `@kazura/web-daemon` 后台节流规避原理深度解析

> 本文档解释 `packages/web-daemon/src/index.ts` 中 `forceCall` 内的关键写法为什么能让守护程序在浏览器标签页进入后台后仍然继续触发：
>
> ```ts
> public forceCall() {
>   this.len++
>   // 关键：用一个零延迟 setTimeout 把真正的 task 调用包裹起来
>   global.setTimeout(() => this.task(() => this.synchronize(), this))
>   if (this.isAtEnd()) this.pause()
> }
> ```
>
> 经过反复试验：**只有这样写**，整个守护程序在浏览器进入后台后才能保持继续触发；如果去掉这层 `setTimeout`、直接同步调用 `this.task(...)`，浏览器后台一段时间后定时器就会被显著节流甚至"看上去休眠"。
>
> 本文是 docs 目录下两份分析（[`why-settimeout-wrapper.md`](./why-settimeout-wrapper.md) / [`chromium_timer_throttling_analysis.md`](./chromium_timer_throttling_analysis.md)）合并后的**主文档**，差异对比见 [`analysis-comparison.md`](./analysis-comparison.md)。

---

## 0. TL;DR

| 你的问题 | 一句话答案 |
| --- | --- |
| 为什么加一层 `setTimeout` 就不被节流？ | 它同时做了两件事：①让主定时器回调"瘦身"为几乎瞬时返回，**绕开 Chrome 57+ 的 Budget-based Throttling**；②让真正的 task 跑在一个新的 macrotask 中，**绕开 Chrome 88+ 的 Intensive Wake Up Throttling 中对深度链式 timer 的惩罚**。 |
| 这是规范允许的吗？ | 规范没有规定。这是利用了 Chromium 实现层对**零延迟 / 浅层嵌套定时器**的豁免策略——可以理解为"用业界普遍存在的实现差异续命"。 |
| 它能完全解决后台问题吗？ | **不能**。它只能降低进入 Intensive Throttling 的概率，无法对抗 **Page Lifecycle Frozen**、Android Doze、笔记本省电模式等更底层的休眠机制。如果业务真的需要后台长跑，应当迁移到 Service Worker / Push API / Web Worker / WebSocket。 |

---

## 1. 背景：浏览器对后台定时器的多层节流

现代浏览器为了在用户切走标签页后降低 CPU 与电池消耗，会对**不可见页面（hidden / background tab）**的 `setTimeout` / `setInterval` 进行多层节流。以 Chrome / Chromium 为例，这套机制经过了多次演进，**逐层叠加**：

### 1.1 Chrome 11+：后台定时器对齐（Timer Alignment）

从 Chrome 11 开始，后台 tab 中相互独立的定时器**最多每秒触发一次**，并且会以"批处理（batching）"的方式集中唤醒进程，以减少 wake-up 次数。

豁免条件：页面正在发声 / 有 WebSocket / WebRTC 等。

### 1.2 Chrome 57+：预算节流（Budget-based Throttling）

页面进入后台 **10 秒**后，浏览器会为每个后台 tab 维护一个**定时器执行预算（time budget）**：

- 每秒回填 `0.01s` 的预算（大约 **1% 的 CPU 时间**）。
- 每次执行 timer 回调，会从预算里**扣除该回调实际消耗的 CPU 时间**。
- 当预算为负时，timer 不会再被触发，直到预算回填到非负为止。

这一档是文档中**最少被人讨论、却对本案最具解释力**的机制。它的核心特点是：**计费口径是 timer 回调本身的耗时**，而不是整个程序的耗时。

### 1.3 Chrome 88+：强力节流（Intensive Wake Up Throttling）

Chrome 88（2021 年 1 月）针对"链式定时器"引入了更激进的节流策略。当**同时满足**以下条件时，所有定时器会被改为**每分钟才统一检查一次**：

- 页面已经隐藏超过 **5 分钟**；
- 定时器的 **nesting count（嵌套层级，又称 chain count）≥ 5**；
- 页面静默（无音频输出）超过 **30 秒**；
- 没有正在使用的 WebRTC（`RTCDataChannel` / live `MediaStreamTrack`）。

如果都满足，那么哪怕你写的是 `setTimeout(fn, 1000)`，实际可能要等 60 秒才会触发一次。

### 1.4 Page Lifecycle：Frozen 与 Discarded

这是比上面三档**更深一层**的状态机，由 Page Lifecycle API 定义：

- `Frozen`：JS 全部暂停——timer 不执行、Promise 回调不执行、事件循环停摆。
- `Discarded`：进一步从内存中卸载页面。

进入这些状态后，**任何"断链"技巧都无济于事**。Chrome 移动端、低内存场景、Android Doze、笔记本进入电池保护模式时都可能触发。

> 这一档存在的意义：提醒读者本文介绍的技巧**只在前三档生效**，是"延迟被休眠"，不是"永不休眠"。

### 1.5 关键概念：什么是"链式（chained）"定时器？

根据 HTML 规范以及 Chrome 团队的解释：

> If you call `setTimeout` in the same **task** as a `setTimeout` callback, the second invocation is 'chained'. With `setInterval`, each iteration is part of the chain.

请特别注意：**判定单位是"task"（macrotask），不是"调用栈"**。

也就是说：**在一个 timer 的回调（task）中再去调用 `setTimeout`，新创建的 timer 的 nesting level 会在父 timer 的基础上 +1。** `setInterval` 的每次迭代被等价视为一次 chained `setTimeout`。

Chromium 的实现中（`third_party/blink/renderer/core/frame/dom_timer.cc`）维护了一个常量 `kMaxTimerNestingLevel = 5`，并把每个 `DOMTimer` 的 `nesting_level_` 设置为父执行上下文当前的 timer nesting level + 1。

---

## 2. 现象复盘：为什么"直接调 task"会被节流？

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

### 2.1 如果 `forceCall` 中**同步直调** task

把 `forceCall` 改写为最朴素的版本：

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

与此同时，**预算节流（§1.2）的影响也会同步发生**：

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

#### (a) 把 task 从主定时器回调里"剥离"出去 —— 对 Budget Throttling 至关重要

- 主定时器 `setTimeout(forceCall, rate)` 触发时，`forceCall` 在它自己的 task 中执行。
- 这个 task 现在**几乎是空的**——只做了 `len++`、调度一个新 timer、判断是否结束这三件事，**用时极短**。
- 用户提供的 `task` 函数（可能很重，可能包含同步计算、`fetch`、DOM 操作等）被推到**下一个独立 task** 中执行。

这对 §1.2 的**预算节流**至关重要：

> Chrome 的 budget 是按 **timer 回调消耗的 CPU 时间**来扣的。
>
> - 不包裹：`task` 的耗时 ≈ timer 回调耗时，每次循环都会扣很多预算 → 预算很快变负 → timer 不再触发。
> - 包裹：timer 回调本身几乎瞬间返回，**只扣极少的预算**；真正干活的 task 跑在一个普通 task 里，**不在 timer budget 的核算范围内**。

**这是包裹之所以有效的最稳健、最可证的解释，不依赖任何 Chromium 实现细节。**

#### (b) 让 `task` 的执行上下文不再是"timer 的回调" —— 对 Intensive Throttling 起作用

被 `setTimeout(fn, 0)` 包裹后，`task` 在一个**新的、独立的 task** 中执行。当 `task` 同步调用 `next() → synchronize() → setTimeout(forceCall, rate)` 时：

- 它**不是在主定时器的回调里**调用 `setTimeout` 的；
- 它在的是"**那个 0 延迟 setTimeout 触发出来的 task**"里调用 `setTimeout`。

这里有一个**实践上反复被验证、但规范并未强制要求的浏览器行为差异**：

> Chromium 在调度器层（参见 `scheduler-dev` 邮件列表里关于 _"Opting-out JS timers with nesting level ≤ 5 from intensive throttling"_ 的讨论以及相关 feature flag `OptOutZeroTimeoutTimersFromThrottling`）针对**零延迟 / 浅层嵌套的定时器**做了多次策略调整，使其在某些条件下**不参与 intensive throttling**，以便让"yield 给主循环"这种常见模式仍然能在后台保持响应。

> ⚠️ **严谨提示**：按 HTML 规范严格走，包裹后 `task → next → synchronize` 是在 zero-delay timer 的 task 里调用 `setTimeout`，新 timer 的 nesting level 实际上**累加更快（每轮 +2）**。所以"断链有效"**不是因为 spec 认为它不再 chained**，而是因为 Chromium 对这种"普遍模式"做了**实现层的特殊豁免**。
>
> 这条经验依赖未来 Chromium 不撤销这类豁免——如果哪天 Chrome 实现完全严格按 spec 走，本技巧可能失效。

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
  1. 每轮主循环都**新建**一个 timer，而不是复用同一个 interval；
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
   │  next() = synchronize()        │     CPU 消耗都计入 timer budget
   │     setTimeout(forceCall, rate)│     nesting level += 1
   ▼                               ─┘
[task C:  forceCall #2]  level=2
[task D:  forceCall #3]  level=3
[task E:  forceCall #4]  level=4
[task F:  forceCall #5]  level=5  ── 触发 intensive throttling
        ⇒ 后续 timer 实际间隔变为 ~60s
        ⇒ task 耗时累积扣 budget，被双重夹击
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

## 5. 类似的"断链"技巧横向对比

这套"通过切换任务队列规避连续 timer 检测"的思路不止 `setTimeout(fn, 0)` 一种。各种宿主 API 都能起到类似作用，但**侧重点不同**：

| 技巧 | 投递到 | 优点 | 局限 |
| --- | --- | --- | --- |
| `setTimeout(fn, 0)` | macrotask queue | 与已有 timer 系统天然兼容，本文采用 | 在 chain 中仍被 clamp 到 ≥4ms |
| `queueMicrotask(fn)` / `Promise.resolve().then(fn)` | microtask queue | 几乎零开销、同步上下文中可立即 yield | **仍在同一个 task 内执行**，不算真正"断链"，对 Budget Throttling 无效 |
| `MessageChannel.postMessage` | macrotask queue | 不受 4ms clamp 限制，被很多调度器（如 React Scheduler）用作"快速 yield" | API 略繁琐，需要持有 `MessageChannel` 实例 |
| `window.postMessage` | macrotask queue | 同上，且兼容性更广 | 需自己处理消息事件过滤，污染全局事件流 |
| `requestAnimationFrame` | render queue | 与渲染节奏对齐，对动画类任务最优 | **页面隐藏时直接停摆**，恰恰不适合本场景 |
| `requestIdleCallback` | idle queue | 适合低优先级任务 | 后台 tab 几乎不会被调用 |
| `Web Worker` 内的 `setTimeout` | worker 的事件循环 | Worker 的 timer **节流策略与主线程不同**，是更彻底的方案 | 需要跨线程通信、postMessage 序列化成本 |

对 `web-daemon` 这种"周期性、需要在主线程操作 DOM / 调用业务回调"的场景，`setTimeout(fn, 0)` 是**侵入最小、兼容性最好**的选择。

---

## 6. 结论与实践建议

1. **现象本质**：浏览器后台节流是**多层叠加**的——
   - Timer Alignment（≥1s 对齐）
   - Budget-based Throttling（按 timer 回调 CPU 时间扣预算）
   - Intensive Wake Up Throttling（≥5 层嵌套时降为 1 次/分钟）
   - Page Lifecycle Frozen（整页停摆，无法绕过）

2. **`setTimeout(() => task(...))` 的双重作用**：
   - 让主定时器回调"瘦身"为几乎瞬时返回，从根本上**减少预算消耗**（对 §1.2 Budget Throttling 起作用，且**完全规范允许**）；
   - 让真正的工作脱离主定时器调用链，**降低被识别为深度 chained timer 的概率**，避开 §1.3 Intensive Throttling（依赖 Chromium 对零延迟 timer 的实现层豁免，**规范不强制保证**）。

3. **不要轻易"优化"掉这一行**。这看似多余的 `setTimeout` 是经过实测验证的"反节流"模式，删掉它会让守护程序在浏览器后台运行一段时间后行为变得不可预测。

4. **更可靠的替代方案**（如果业务允许）：
   - 切到 **Service Worker / SharedWorker / Web Worker**，Worker 内的定时器节流策略与主线程不同，且可独立于页面生命周期。
   - 视觉相关的任务请使用 **`requestAnimationFrame`**，它会随页面隐藏自动暂停，反过来还能省电。
   - 使用 **Push API / Notification Triggers / WebSocket / Server-Sent Events** 等"由服务端推送"的模型，本质上消灭对前端定时器的依赖。
   - 静默音频轨 / WebRTC `RTCDataChannel` 可让页面豁免大多数节流，但**会显著增加电量与内存开销**，仅作为最后的兜底。

5. **能力边界**：本技巧能帮你在前三档节流中"延寿"，但**无法对抗 Page Lifecycle Frozen、Android Doze、笔记本省电模式**。需要真后台长跑的业务，请走 Worker / 服务端推送路线。

---

## 7. 对早期分析的勘误说明

为了避免读者在两份历史文档之间产生困惑，这里**显式列出可能存在的误解**：

1. **"chained 的判定单位是调用栈"** —— ❌ 不准确。HTML 规范的定义是 **"同一个 task"**（macrotask）。两个 timer 即使**不在同一个 JS 调用栈**中创建，只要在同一个 task 内创建，仍然算 chained。
2. **"包裹 setTimeout 之后 nesting level 减少了"** —— ❌ 严格按 HTML spec，**反而每轮 +2**。包裹之所以有效，依赖 Chromium 对"零延迟 / 浅层嵌套"timer 的**实现层豁免**，而不是规范上"它真的不算 chained 了"。
3. **"包裹 setTimeout 是为了延迟执行"** —— ❌ 包裹的真正作用是**切换任务队列 + 让 timer 回调瘦身**，与"延迟"无关。
4. **"只要包裹了 setTimeout，后台就永远不会被节流"** —— ❌ 它只能让你**延迟进入 Intensive Throttling**，不能对抗 Frozen / Discarded / Doze。

---

## 8. 参考资料

1. Jake Archibald, _Heavy throttling of chained JS timers beginning in Chrome 88_ —— <https://developer.chrome.com/blog/timer-throttling-in-chrome-88>
2. Chrome for Developers, _Background tabs in Chrome 57_（Budget-based Throttling 起源）—— <https://developer.chrome.com/blog/background_tabs>
3. MDN _Window: setTimeout()_（"Timeouts in inactive tabs" / "Nesting level" 章节）—— <https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout>
4. WHATWG HTML Standard, _Timers and user prompts_ —— <https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html>
5. WHATWG HTML Issue #239, _Purpose of timer nesting level for repeating timers is unclear_ —— <https://github.com/whatwg/html/issues/239>
6. WHATWG HTML Issue #10386, _setTimeout() nesting levels: browsers do not match specification_ —— <https://github.com/whatwg/html/issues/10386>
7. Chromium 源码 `third_party/blink/renderer/core/frame/dom_timer.cc`（`kMaxTimerNestingLevel`、`kMinimumInterval` 等关键常量与 nesting level 的递增逻辑）—— <https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/frame/dom_timer.cc>
8. Chromium `scheduler-dev` 邮件列表，_Opting-out JS timers with nesting level ≤ 5 from intensive throttling_ —— <https://groups.google.com/a/chromium.org/g/scheduler-dev/c/EWKYCZlWjpc>
9. Page Lifecycle API —— <https://developer.chrome.com/docs/web-platform/page-lifecycle-api/>
10. Page Visibility API —— <https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API>
11. Stack Overflow, _setTimeout/setInterval 1000ms lag in background tabs_ —— <https://stackoverflow.com/questions/19475894/settimeout-setinterval-1000ms-lag-in-background-tabs-chrome-and-firefox>
12. 本仓库历史 issue —— <https://github.com/kazura233/web-daemon/issues/1>（`globalThis` 兼容性的起源，对应 `index.ts` 顶部的注释）。

---

## 附：本目录下的相关文档

- [`why-settimeout-wrapper.md`](./why-settimeout-wrapper.md) —— Claude 的原始分析（已被本文吸收为主干）
- [`chromium_timer_throttling_analysis.md`](./chromium_timer_throttling_analysis.md) —— GPT 的原始分析（科普向，含 Page Lifecycle Frozen / 横向断链技巧讨论）
- [`analysis-comparison.md`](./analysis-comparison.md) —— 两份原始分析的横向对比与勘误来源
