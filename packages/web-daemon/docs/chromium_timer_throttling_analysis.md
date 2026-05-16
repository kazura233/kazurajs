# Chromium 后台 Timer 节流机制分析

## 问题背景

在浏览器后台运行时，普通的 `setTimeout` / `setInterval` 会逐渐被 Chromium 节流（throttling）。

但下面这种写法：

```ts
global.setTimeout(() => this.task(() => this.synchronize(), this))
```

相比：

```ts
this.task(() => this.synchronize(), this)
```

在后台运行时，表现完全不同。

实际测试中：

- 直接调用 task：
  - 后台一段时间后 timer 会严重降频
  - 甚至被冻结

- 包裹一层 setTimeout：
  - timer 明显更稳定
  - 不容易被冻结

问题是：

为什么仅仅多套一层 `setTimeout`，就会影响 Chromium 的后台调度行为？


---

# 先说结论

核心原因：

Chromium 会对“链式 Timer（Chained Timer）”进行特殊识别和强节流。

而：

```ts
setTimeout(() => task())
```

会把原本连续的 Timer 链：

```txt
Timer -> Timer -> Timer
```

切断成：

```txt
Timer -> 新任务(Task) -> Timer
```

从而绕过 Chromium 对“连续链式唤醒”的检测。


---

# Chromium 为什么要节流后台 Timer

浏览器后台页面是非常耗电的。

尤其是：

- 游戏循环
- 心跳检测
- 轮询请求
- 广告脚本
- 动画循环

这些逻辑通常会：

```js
function loop() {
    setTimeout(loop, 100)
}
```

导致：

- CPU 无法休眠
- 系统持续被唤醒
- 笔记本耗电
- 手机发热

因此 Chromium 做了大量后台优化。


---

# Chromium 的后台节流策略

Chromium 对后台页面有多层节流机制：

## 1. Timer Clamping

后台页面 timer 最低间隔被强制提高。

例如：

```txt
setTimeout(fn, 10)
```

后台可能变成：

```txt
1000ms
```

即：

最小 1 秒。


---

## 2. Intensive Wake Up Throttling

Chrome 88 开始加入更激进的机制。

对于：

- 持续链式 timer
- 高频唤醒
- 后台长时间运行

会进入：

```txt
Intensive Wake Up Throttling
```

之后：

- timer 可能一分钟才执行一次
- 甚至完全冻结


---

## 3. Page Lifecycle Freeze

更进一步：

后台页面可能直接进入：

```txt
Frozen
```

此时：

- JS 完全暂停
- Timer 不执行
- Promise 不执行
- 事件循环被冻结

类似“页面休眠”。


---

# 什么是 Chained Timer

Chromium 会识别：

```js
setTimeout(() => {
    setTimeout(() => {
        setTimeout(() => {})
    })
})
```

或者：

```js
function loop() {
    setTimeout(loop, 100)
}
```

这种：

```txt
Timer 回调内部再次注册 Timer
```

的模式。

这被称为：

```txt
Chained Timer
```

浏览器认为：

这是“持续主动唤醒 CPU”。

因此会重点打击。


---

# 你的代码为什么特殊

## 普通写法

如果这样写：

```ts
public synchronize() {
    this.timer = setTimeout(() => {
        this.task(() => this.synchronize(), this)
    }, this.rate)
}
```

执行链是：

```txt
Timer Callback
    -> task()
        -> synchronize()
            -> setTimeout()
```

这里：

新的 timer 是在“当前 timer callback 执行期间”创建的。

Chromium 会认为：

```txt
这是同一个 timer chain
```

于是：

```txt
chainCount++
```

达到阈值后：

进入 intensive throttling。


---

# 你的写法

你实际上写成了：

```ts
setTimeout(() => {
    setTimeout(() => {
        task()
    })
})
```

逻辑链：

```txt
Timer A
    -> 注册 Timer B
    -> 返回

下一轮事件循环：

Timer B
    -> task()
        -> synchronize()
            -> Timer C
```

关键区别：

```txt
synchronize() 不再发生在原 Timer callback 的调用栈中
```

因此：

Chromium 不再认为：

```txt
TimerC 是 TimerA 的直接链式递归
```

而是：

```txt
一个新的离散 Task
```

于是：

链式检测被打断。


---

# 本质：你在“断链”

你的写法本质不是：

```txt
多等一次
```

而是：

```txt
切断 timer nesting context
```

即：

把：

```txt
Timer -> Timer -> Timer
```

变成：

```txt
Timer -> PostTask -> Timer
```

这是完全不同的调度结构。


---

# Chromium 内部的关键机制

Chromium/Blink 内部存在：

```cpp
DOMTimer::InstallNewTimeout
```

以及：

```cpp
timer_nesting_level
```

概念。

HTML 标准中也存在：

```txt
timer nesting level
```

用于表示：

当前 timer 是否属于“嵌套 timer”。

Chromium 会基于：

- nesting level
- task context
- wakeup chain
- 当前 task 来源

判断：

是否属于 chained timer。


---

# 为什么额外 setTimeout 会生效

因为：

```js
setTimeout(fn)
```

本质上：

是：

```txt
向主线程 TaskQueue 投递一个新的 Macrotask
```

而新的 Macrotask：

会重置：

```txt
timer nesting context
```

于是：

Chromium 的链式识别失效。


---

# 类似的“断链技巧”

很多框架都会故意：

## Promise

```js
Promise.resolve().then(fn)
```

## MessageChannel

```js
channel.port2.postMessage()
```

## postMessage

```js
window.postMessage()
```

## requestAnimationFrame

```js
requestAnimationFrame(fn)
```

本质都是：

```txt
切换任务队列
```

从而：

避免被识别成连续 timer。


---

# 为什么游戏特别容易遇到这个问题

游戏循环通常是：

```js
function tick() {
    update()
    render()
    setTimeout(tick, 16)
}
```

后台后：

Chromium 会认为：

```txt
持续高频唤醒
```

因此：

直接重拳节流。

很多网页游戏都会：

- 插 Promise
- 插 MessageChannel
- 插额外 timeout
- 使用 Worker

本质都是：

绕过 chained timer 检测。


---

# Worker 为什么也常用于绕过节流

Web Worker：

- 有独立事件循环
- 不依赖页面渲染
- 部分情况下 throttling 更轻

因此：

很多：

- 心跳
- 游戏逻辑
- 音频时钟

会迁移到 Worker。


---

# 但这种方法不是“完全绕过”

需要注意：

你的方案：

```txt
只是降低进入 intensive throttling 的概率
```

并不是：

```txt
完全绕过 Chromium 后台限制
```

如果：

- 页面后台太久
- 系统进入省电模式
- Android Doze
- Laptop Battery Saver
- 页面进入 Frozen

仍然会被冻结。


---

# 为什么 Chromium 不直接禁止这种绕过

因为：

浏览器很难准确区分：

- 合法后台任务
- 恶意轮询

例如：

- 音乐播放器
- WebSocket 心跳
- 在线会议
- 下载器
- 实时同步

都需要后台运行。

因此 Chromium 只能：

基于 heuristics（启发式规则）判断。

而“断链”正好绕过了 heuristics。


---

# 总结

你这个：

```ts
setTimeout(() => this.task(...))
```

真正的作用不是：

```txt
延迟执行
```

而是：

```txt
把连续递归 Timer
伪装成离散 Task
```

从而：

绕过 Chromium 对 chained timer 的后台节流检测。

这是：

```txt
事件循环结构变化
```

导致的行为差异。


---

# 参考资料

## Chromium 官方文章

Heavy throttling of chained JS timers

https://developer.chrome.com/blog/timer-throttling-in-chrome-88/


## HTML Standard

Timers

https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html


## Chromium Source

third_party/blink/renderer/core/frame/dom_timer.cc

https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/frame/dom_timer.cc


## Chromium Scheduler

third_party/blink/renderer/platform/scheduler/

https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/platform/scheduler/


## Page Lifecycle API

https://developer.chrome.com/docs/web-platform/page-lifecycle-api/


## Chrome Page Freeze

https://developer.chrome.com/blog/page-lifecycle-api/
