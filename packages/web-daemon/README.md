[npm]: https://img.shields.io/npm/v/@kazura/web-daemon
[npm-url]: https://www.npmjs.com/package/@kazura/web-daemon
[size]: https://packagephobia.now.sh/badge?p=@kazura/web-daemon
[size-url]: https://packagephobia.now.sh/result?p=@kazura/web-daemon
[license]: https://img.shields.io/badge/License-MIT-blue
[license-url]: https://github.com/kazura233/kazurajs/blob/master/LICENSE

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![license][license]][license-url]

# @kazura/web-daemon

Web Daemon 是一个用于创建和管理定时任务的工具包，它提供了一种简单的方式来处理需要定期执行的任务。

## 特性

- 支持创建定时执行的任务
- 可以控制任务的执行频率和总次数
- 支持暂停和恢复任务
- 提供全局任务管理功能
- 支持立即执行任务
- 提供完整的 TypeScript 类型支持

## 安装

```bash
npm install @kazura/web-daemon
```

## 使用方法

### 基本用法

```typescript
import WebDaemon from '@kazura/web-daemon'

// 创建一个每秒执行一次的任务
const daemon = new WebDaemon(
  (next, daemon) => {
    console.log('Task executed at index:', daemon.index)
    next()
  },
  1000 // 执行间隔（毫秒）
)

// 启动任务
daemon.start()

// 暂停任务
daemon.pause()

// 恢复任务
daemon.start()
```

### 限制执行次数

```typescript
// 创建一个只执行5次的任务
const limitedDaemon = new WebDaemon(
  (next, daemon) => {
    console.log('Task executed at index:', daemon.index)
    next()
  },
  1000,
  5 // 最多执行5次
)

limitedDaemon.start()
```

### 立即执行

```typescript
const immediateDaemon = new WebDaemon((next, daemon) => {
  console.log('Task executed at index:', daemon.index)
  next()
}, 1000)

// 启动时立即执行一次
daemon.start(true)
```

## API 参考

### 构造函数

```typescript
constructor(
  task: (next: () => void, daemon: WebDaemon) => void,
  rate: number = 1000,
  len: number = Number.POSITIVE_INFINITY
)
```

- `task`: 需要执行的任务函数
- `rate`: 执行间隔（毫秒），默认为 1000
- `len`: 最大执行次数，默认为无限

### 方法

- `start(immediate: boolean = false): void` - 启动任务
  - `immediate`: 是否立即执行一次
- `pause(): void` - 暂停任务
- `forceCall(): void` - 强制执行一次任务
- `synchronize(): void` - 同步任务执行时间
- `isAtEnd(): boolean` - 检查任务是否已结束

### 静态方法

- `pauseAll(): void` - 暂停所有运行中的任务

### 属性

- `index: number` - 当前执行次数
- `len: number` - 最大执行次数
- `timer: number` - 计时器标识
- `paused: boolean` - 是否处于暂停状态

## 注意事项

1. 任务函数必须调用 `next()` 回调来继续执行
2. 使用 `forceCall()` 会增加 `index` 计数
3. 当任务达到最大执行次数时，会自动暂停
4. 使用 `pauseAll()` 可以一次性暂停所有运行中的任务

## 示例

### 轮询数据

```typescript
const pollingDaemon = new WebDaemon(
  async (next, daemon) => {
    try {
      const response = await fetch('https://api.example.com/data')
      const data = await response.json()
      console.log('Polled data:', data)
    } catch (error) {
      console.error('Polling error:', error)
    }
    next()
  },
  5000 // 每5秒轮询一次
)

pollingDaemon.start()
```

### 动画效果

```typescript
const animationDaemon = new WebDaemon(
  (next, daemon) => {
    const progress = (daemon.index / 100) * 100
    element.style.opacity = progress + '%'
    if (progress >= 100) {
      daemon.pause()
    }
    next()
  },
  16, // 约60fps
  100 // 执行100次
)

animationDaemon.start()
```

### 倒计时

```typescript
const countdownDaemon = new WebDaemon(
  (next, daemon) => {
    const remaining = 10 - daemon.index
    console.log(`Countdown: ${remaining}`)
    if (remaining <= 0) {
      daemon.pause()
    }
    next()
  },
  1000,
  10
)

countdownDaemon.start()
```

## 文档

更多详细信息请查看 [文档](https://kazura233.github.io/kazurajs/docs/web-daemon)。

## 许可证

MIT

## Author

👤 **kazura233**

- Website: https://github.com/kazura233
- Github: [@kazura233](https://github.com/kazura233)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/kazura233/kazurajs/issues).

## Show your support

Give a ⭐️ if this project helped you!
