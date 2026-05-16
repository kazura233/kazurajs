# 关于 `setTimeout` 包裹任务规避后台节流的两份分析对比

> 本文件用于**横向比较**目前 docs 目录下针对同一个问题的两份分析，并给出我的取舍意见。
>
> - 文档 A（GPT 版）：[`chromium_timer_throttling_analysis.md`](./chromium_timer_throttling_analysis.md)
> - 文档 B（Claude 版）：[`why-settimeout-wrapper.md`](./why-settimeout-wrapper.md)
>
> 两份文档都在解释 `packages/web-daemon/src/index.ts` 中下面这一行为什么"在浏览器后台时定时器不会休眠"：
>
> ```ts
> global.setTimeout(() => this.task(() => this.synchronize(), this))
> ```

---

## 1. 共识：两份文档的核心结论是一致的

无论叙述方式有多大差异，两份文档最终都收敛在同一个结论上：

> `setTimeout(() => task())` 的本质**不是"延迟执行"**，而是把原本由 timer 回调内部直接驱动的**递归式 timer 链**，切割成"timer → 普通 task → timer"的两段式结构，从而绕过 Chromium 对 chained / nested timer 的后台节流检测。

并且两份文档都引用了：

- Chrome 88 关于 chained JS timers 的官方 blog
- HTML 规范 _Timers and user prompts_ 章节
- Chromium `third_party/blink/renderer/core/frame/dom_timer.cc`
- Page Lifecycle 系列文档

所以**结论无分歧**，分歧主要发生在"如何解释这个结论"和"覆盖了多少层节流机制"上。

---

## 2. 主要差异一览表

| 维度 | 文档 A（GPT 版） | 文档 B（Claude 版） |
| --- | --- | --- |
| 篇幅 | 650 行 | 258 行 |
| 主要论据 | "断链"（call stack 视角） | "断链" + "Budget 视角"双重作用 |
| Timer Alignment（Chrome 11+，≥1s 对齐） | ✅ 简单提及（Timer Clamping） | ✅ 明确成节 |
| **Budget-based Throttling（Chrome 57+）** | ❌ **完全未提及** | ✅ 重点展开 |
| Intensive Wake Up Throttling（Chrome 88+） | ✅ 详细展开 | ✅ 详细展开 |
| **Page Lifecycle Frozen（最深层冻结）** | ✅ 提及 | ❌ **未提及** |
| "chained" 的判定单位 | 调用栈（call stack） | task（HTML spec 严格定义） |
| 是否标注 spec 与实现的偏差 | ❌ | ✅（提及 `OptOutZeroTimeoutTimersFromThrottling` 等启发式规则） |
| nesting level 累加的具体推演 | ❌ 只给概念 | ✅ 给出步骤表与每轮 +1 / +2 的对比 |
| 事件流时序图 | ❌ | ✅ ASCII 时序图 |
| 类似"断链"技巧（Promise / MessageChannel / postMessage / RAF） | ✅ 单独成节 | ⚠️ 仅在"替代方案"里提及 RAF 等 |
| 游戏循环 / Worker 等实践场景的科普讨论 | ✅ 多节展开 | ❌ 未展开 |
| 参考资料数量 | 5 条 | 11 条（含 WHATWG issue、scheduler-dev 邮件列表） |
| 文档风格 | 博客 / 科普向，节奏碎、口语化 | 技术文档向，结构紧、密度高 |

---

## 3. 关键技术分歧：什么算 "chained"？

这是两份文档**最实质的分歧**，也是后续判断哪份更可信的根据。

### 3.1 文档 A（GPT 版）的措辞

```text
新的 timer 是在"当前 timer callback 执行期间"创建的。
…
synchronize() 不再发生在原 Timer callback 的调用栈中
```

GPT 反复用的判定标准是 **"调用栈（call stack）"**：只要新 timer 不在旧 timer 的调用栈里创建，就不算 chained。

按这种说法，包裹一层 `setTimeout(fn, 0)` 后：

```
Timer A 回调 → 仅 schedule Timer B → 返回（栈出空）
Timer B 回调 → task → next → synchronize → schedule Timer C
```

Timer C 创建时确实不在 Timer A 的调用栈中。**所以 GPT 直接得出"链被断开了"的结论。**

### 3.2 HTML 规范实际怎么说

> If you call `setTimeout` in the same **task** as a `setTimeout` callback, the second invocation is 'chained'.
>
> — _Chrome for Developers, Heavy throttling of chained JS timers_

规范的判定单位是 **"task"**（macrotask），**不是"调用栈"**。Chromium 的 `DOMTimer` 在 timer fire 时会把当前 ExecutionContext 的 `timer_nesting_level_` 设为该 timer 的 nesting level，**只要新 timer 是在这个 task 内创建的**，它的 nesting level 就 = 父 + 1。

按规范严格走一遍包裹后的事件流（以 `synchronize()` 在 `start()` 主脚本中首发为基准）：

| # | 事件 | 当前所在 task | 创建的新 timer 的 nesting level |
| --- | --- | --- | --- |
| 1 | `start()` → `synchronize()` → `setTimeout(forceCall, rate)` | 普通脚本，level = 0 | Timer A: **1** |
| 2 | Timer A 触发 → `forceCall` → `setTimeout(fn, 0)` | task A, level = 1 | Timer B: **2** |
| 3 | Timer B 触发 → `task(next)` → `next()` → `synchronize()` → `setTimeout(forceCall, rate)` | task B, level = 2 | Timer C: **3** |
| 4 | Timer C 触发 → `forceCall` → `setTimeout(fn, 0)` | task C, level = 3 | Timer D: **4** |
| 5 | Timer D 触发 → `task` → `next` → `synchronize` → `setTimeout` | task D, level = 4 | Timer E: **5** |

**结论：按 HTML spec，包裹后的 nesting level 反而每轮 +2，比不包裹（+1）增长得更快**——只看 nesting level 这一个维度，"断链"在规范层面**完全说不通**。

### 3.3 那为什么"包裹之后实际真的不会被节流"？

要让 GPT 的结论自洽，必须诉诸**Chromium 的实现细节**，而不是 HTML spec。已知的相关线索：

- Chromium feature flag `OptOutZeroTimeoutTimersFromThrottling`——**零延迟 setTimeout 从节流中 opt-out**。
- `scheduler-dev` 邮件列表中的讨论 _Opting-out JS timers with nesting level ≤ 5 from intensive throttling_——浅层嵌套的 timer 即便满足其它条件也豁免。
- 各浏览器对 nesting level 累加策略有 _spec-divergent_ 实现（参考 WHATWG HTML 的 issue #239 / #10386）。

也就是说：**"断链有效" = "Chromium 内部对 0-delay timer 做了特殊豁免"，而不是 "spec 上不算 chained 了"**。文档 B 把这个 caveat 显式写了出来，文档 A 没有。

---

## 4. 另一个被 GPT 漏掉的关键机制：Budget-based Throttling

这是文档 A **完全没提**的一档节流，也是文档 B 的论据中**最不依赖具体实现细节、最容易自洽**的部分。

### 4.1 机制本身

Chrome 57+（2017 年）引入：

- 后台 tab 在隐藏 **10 秒**之后启用预算节流。
- 每个 tab 有一个 timer 执行预算（time budget），每秒回填 **0.01s**（大约 1% CPU）。
- 每次 timer 回调执行，**根据该回调消耗的实际 CPU 时间**从预算中扣减。
- 预算为负时，timer 不再触发，直到回填到非负为止。

### 4.2 它如何解释当前现象

对于 `web-daemon`：

- **不包裹**：`task` 在主定时器的回调中**同步运行**，`task` 的全部 CPU 时间都被计入 timer 回调的耗时。
  - `task` 在业务里通常会做轮询、心跳、计算、DOM 操作甚至 `await fetch`。
  - 这部分耗时一次次扣预算，预算会**迅速被扣穿**。
  - 现象：后台不久 timer 就明显降频甚至看似冻结。
- **包裹**：主定时器回调被"瘦身"为只做 `len++` + `setTimeout(fn,0)` + 一次 `isAtEnd` 判断，**耗时几乎可忽略**。
  - `task` 的真正执行被推到 0-delay timer 触发出的另一个 task 中。
  - 那个 task 是普通 macrotask，**不计入"timer 回调耗时"**这一项的预算扣账（这是 Budget Throttling 实际的计费口径）。
  - 现象：预算几乎不被消耗，主循环可以稳定续命。

这个解释**不依赖 nesting level**，也**不依赖任何未公开的启发式规则**——它是 Chrome 57+ 公开记录在案的机制。文档 A 完全没覆盖这一档，是个实质性遗漏。

---

## 5. GPT 版的相对优点也值得保留

公平起见，文档 A 也有文档 B 没有的内容：

1. **Page Lifecycle Frozen 这一档**：
   - 比 Intensive Throttling 更深一层的、整页停摆的状态。
   - 作为"上限警告"必须告诉读者——再怎么"断链"也救不了一个被 Frozen 的 tab。

2. **"为什么游戏循环特别容易遇到这个问题"等实践叙事**：
   - 帮助读者把这套机制和日常代码对应起来。

3. **横向对比其它"断链技巧"**：
   - `Promise.resolve().then`
   - `MessageChannel.postMessage`
   - `window.postMessage`
   - `requestAnimationFrame`
   - 这一段做横向类比对扩展视野很有价值。

4. **"为什么 Chromium 不直接禁止"** 这种讨论：
   - 解释 heuristics 的局限性，让读者理解未来这套技巧可能失效，避免过度依赖。

---

## 6. 我的最终看法

### 6.1 结论一致，但**论据强度不同**

- 两份文档的**结论是一致的**。
- 但 GPT 版的核心论据（"调用栈断开 = 不算 chained"）在 HTML spec 层面是**站不住脚的**，需要诉诸 Chromium 的具体实现细节才能勉强自洽；GPT 没有显式标注这个 caveat，读者很容易顺着它的逻辑得出"包裹后 nesting level 应该减少"的错误推论。
- Claude 版的论据由**两个独立机制**组成：Budget-based Throttling（公开记录、强自洽）+ Intensive Throttling 的实现层豁免（明确标注 caveat）。即便 Chromium 未来调整 Intensive Throttling 的启发式规则，Budget 这一层依然成立。

### 6.2 覆盖面**互补**

| 节流层级 | 谁写得更好 |
| --- | --- |
| Timer Alignment | 双方持平 |
| Budget-based Throttling | **只有 B 写了** |
| Intensive Wake Up Throttling | B 更严谨，A 更通俗 |
| Page Lifecycle Frozen | **只有 A 写了** |
| 类似的"断链"替代手段 | A 更系统，B 一笔带过 |
| 实战建议（Worker / RAF / 静音音频 / Push） | 双方各有侧重 |

### 6.3 行动建议

最推荐的处理方式：**以 Claude 版为主干，吸收 GPT 版的三块内容**。具体地：

1. 在 Claude 版的"§1 多层节流"中**新增一节 Page Lifecycle Frozen**，作为最深一档；位置在 "1.3 Chrome 88+ 强力节流" 之后。
2. 在 Claude 版的"§5 结论与实践建议"中**新增一节横向对比的"断链"替代技巧**（Promise / MessageChannel / postMessage / RAF），并明确说明这些方案与本文实践的等价性与差异。
3. 在 Claude 版的开头或结尾**加一段对 GPT 版的勘误说明**，提示读者：
   - "chained" 的判定单位是 **task** 而不是 call stack；
   - 因此包裹后**按 HTML spec 反而累加更快**；
   - 包裹之所以有效，依赖 Chromium 对零延迟 / 浅层嵌套 timer 的**实现层豁免** + Budget Throttling 计费口径只覆盖 timer 回调本身。
4. 文档 A（GPT 版）可以**保留为附录 / 速读版**，开头标注"本文偏科普叙事，严谨技术细节请以 `why-settimeout-wrapper.md` 为准"。

如果只能留一份，建议留 Claude 版——主要原因不是篇幅或文风，而是 GPT 版漏了 Budget-based Throttling 这个**实质性机制**，且在核心概念上有**容易误导读者的措辞**。

---

## 7. 参考资料（与两篇文档共用）

1. _Heavy throttling of chained JS timers beginning in Chrome 88_ —— <https://developer.chrome.com/blog/timer-throttling-in-chrome-88>
2. _Background tabs in Chrome 57_（Budget-based Throttling 起源）—— <https://developer.chrome.com/blog/background_tabs>
3. MDN _Window: setTimeout()_（含 "Timeouts in inactive tabs" / "Nesting level" 子章节）—— <https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout>
4. WHATWG HTML Standard, _Timers and user prompts_ —— <https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html>
5. WHATWG HTML Issue #239 _Purpose of timer nesting level for repeating timers is unclear_ —— <https://github.com/whatwg/html/issues/239>
6. WHATWG HTML Issue #10386 _setTimeout() nesting levels: browsers do not match specification_ —— <https://github.com/whatwg/html/issues/10386>
7. Chromium 源码 `third_party/blink/renderer/core/frame/dom_timer.cc` —— <https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/frame/dom_timer.cc>
8. Chromium `scheduler-dev` 邮件列表，_Opting-out JS timers with nesting level ≤ 5 from intensive throttling_ —— <https://groups.google.com/a/chromium.org/g/scheduler-dev/c/EWKYCZlWjpc>
9. Page Lifecycle API —— <https://developer.chrome.com/docs/web-platform/page-lifecycle-api/>
10. Page Visibility API —— <https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API>
