---
sidebar_position: 11
---

# Web PostMsg

Web PostMsg 是一个用于 Web 环境下的 postMessage 通信工具包，提供了简单易用的 API 和类型安全的消息处理。

## 特性

- 简单易用的 postMessage 通信 API
- 支持消息通道（channel）管理
- 支持消息超时处理（默认 5 秒）
- 支持 Promise 风格的消息响应
- 支持消息 UUID 追踪
- 支持跨窗口通信

## 安装

```bash
npm install @kazura/web-postmsg
```

## 使用方法

### 基本使用

```typescript
import WebPostMsg from '@kazura/web-postmsg'

// 创建发送方
const sender = new WebPostMsg({
  receiver: window.parent,
  channel: 'main',
})

// 创建接收方
const receiver = new WebPostMsg({
  receiver: window,
  channel: 'main',
})

// 发送消息
sender.emit('greeting', { message: 'Hello' }).then((response) => {
  console.log('Response:', response)
})

// 接收消息
receiver.on('greeting', (data) => {
  console.log(data.message) // 'Hello'
  return { status: 'received' } // 返回响应数据
})
```

### 跨窗口通信

```typescript
// 父窗口
const parent = new WebPostMsg({
  receiver: window.frames[0],
  channel: 'parent-child',
})

// 子窗口
const child = new WebPostMsg({
  receiver: window.parent,
  channel: 'parent-child',
})

// 父窗口发送消息
parent.emit('parentMessage', { data: 'from parent' }).then((response) => {
  console.log('Child response:', response)
})

// 子窗口接收消息
child.on('parentMessage', (data) => {
  console.log('Received from parent:', data)
  return { status: 'received' }
})
```

### 接收所有通道的消息

```typescript
const receiver = new WebPostMsg({
  receiver: window,
  channel: 'main',
  receiveAllChannel: true, // 接收所有通道的消息
})

receiver.on('anyChannelMessage', (data) => {
  console.log('Received message from any channel:', data)
})
```

## API 参考

### WebPostMsg 构造函数

```typescript
constructor(options: {
  receiver: Window
  channel: string
  listeners?: Map<string, Listener>
  receiveAllChannel?: boolean
  self?: Window
})
```

创建一个 WebPostMsg 实例。

参数：

- `options.receiver`: 目标窗口
- `options.channel`: 消息通道名称
- `options.listeners`: 可选的初始监听器映射
- `options.receiveAllChannel`: 是否接收所有通道的消息
- `options.self`: 可选的自身窗口引用（默认为 window）

### 实例方法

#### emit

```typescript
emit(type: string, resources: any): Promise<any>
```

发送消息并等待响应。

参数：

- `type`: 消息类型
- `resources`: 消息数据

返回值：

- Promise 包装的响应数据

#### on

```typescript
on(type: string, listener: (resources: any, event: MessageEvent) => any): void
```

注册消息监听器。

参数：

- `type`: 消息类型
- `listener`: 消息处理函数，可以返回响应数据

#### off

```typescript
off(type: string): void
```

移除消息监听器。

参数：

- `type`: 消息类型

#### destroy

```typescript
destroy(): void
```

销毁实例，移除所有事件监听器。

### 静态属性

- `MESSAGE_TAG`: 消息标签，用于标识消息类型
- `PREFIX_DEFAULT`: 默认消息类型前缀
- `PREFIX_INTERNAL`: 内部消息类型前缀
- `REPLY_TYPE`: 回复消息类型

## 注意事项

1. 消息处理函数可以返回普通值或 Promise，返回值将作为响应发送给发送方
2. 消息超时时间默认为 5 秒
3. 使用 `destroy()` 方法清理实例，避免内存泄漏
4. 确保正确设置 channel 以区分不同的消息通道
5. 使用 `receiveAllChannel` 选项可以接收所有通道的消息

## 示例

### 异步消息处理

```typescript
const receiver = new WebPostMsg({
  receiver: window,
  channel: 'main',
})

receiver.on('asyncTask', async (data) => {
  // 异步处理消息
  const result = await someAsyncOperation(data)
  return result // 返回处理结果
})

// 发送方
sender.emit('asyncTask', { task: 'process' }).then((result) => {
  console.log('Task result:', result)
})
```

### 多通道通信

```typescript
// 创建多个通道的实例
const channelA = new WebPostMsg({
  receiver: window.parent,
  channel: 'channelA',
})

const channelB = new WebPostMsg({
  receiver: window.parent,
  channel: 'channelB',
})

// 在不同通道上发送消息
channelA.emit('message', { channel: 'A' })
channelB.emit('message', { channel: 'B' })
```
