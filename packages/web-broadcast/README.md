[npm]: https://img.shields.io/npm/v/@kazura/web-broadcast
[npm-url]: https://www.npmjs.com/package/@kazura/web-broadcast
[size]: https://packagephobia.now.sh/badge?p=@kazura/web-broadcast
[size-url]: https://packagephobia.now.sh/result?p=@kazura/web-broadcast
[license]: https://img.shields.io/badge/License-MIT-blue
[license-url]: https://github.com/kazura233/kazurajs/blob/master/LICENSE

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![license][license]][license-url]

# @kazura/web-broadcast

Web Broadcast 是一个用于处理浏览器跨窗口通信的工具包，它基于 BroadcastChannel API 提供了更强大的消息广播功能。

## 特性

- 支持公共频道和私有频道的消息广播
- 支持消息类型和监听器管理
- 支持消息代理功能
- 支持自身消息监听
- 提供完整的 TypeScript 类型支持
- 支持消息标签和渠道前缀
- 支持广播通道池管理

## 安装

```bash
npm install @kazura/web-broadcast
```

## 使用方法

### 基本用法

```typescript
import WebBroadcast from '@kazura/web-broadcast'

// 创建广播实例
const broadcast = new WebBroadcast()

// 监听消息
broadcast.on('message-type', (resources, event) => {
  console.log('Received message:', resources)
})

// 发送公共消息
broadcast.postPublicMessage('message-type', { data: 'Hello World' })

// 发送私有消息
broadcast.postPrivateMessage('message-type', { data: 'Private Message' }, 'target-channel')
```

### 使用自定义频道

```typescript
const broadcast = new WebBroadcast({
  channel: 'my-custom-channel',
})

// 监听自身消息
const selfAwareBroadcast = new WebBroadcast({
  channel: 'my-channel',
  listenSelf: true,
})
```

### 使用消息代理

```typescript
const broadcast = new WebBroadcast({
  proxy: 'proxy-channel',
})

// 使用多个代理
const multiProxyBroadcast = new WebBroadcast({
  proxy: ['proxy1', 'proxy2'],
})
```

## API 参考

### 构造函数

```typescript
constructor(options?: BroadcastAPIOptions)
```

#### BroadcastAPIOptions

- `listeners?: Map<string, Listener[]>` - 预定义的监听器
- `listenSelf?: boolean` - 是否监听自身消息
- `channel?: string` - 自定义频道名称
- `proxy?: string | string[]` - 消息代理配置

### 静态属性

- `MESSAGE_TAG: string` - 消息标签，用于标识消息类型
- `PREFIX_CHANNEL: string` - 渠道名称前缀

### 实例属性

- `PUBLIC_CHANNEL: string` - 公共频道名称
- `PRIVATE_CHANNEL: string` - 私有频道名称
- `publicBroadcast: BroadcastChannel` - 公共广播通道
- `privateBroadcast: BroadcastChannel` - 私有广播通道
- `fissionBroadcast?: BroadcastChannel` - 自身广播通道
- `broadcastPool: Map<string, BroadcastChannel>` - 广播通道池
- `uuid: string` - 实例唯一标识
- `proxy?: IProxy` - 消息代理实例

### 方法

- `postPublicMessage(type: string, resources: any): MessageData` - 发送公共消息
- `postPrivateMessage(type: string, resources: any, to: string): MessageData` - 发送私有消息
- `generateMessage(type: string, resources: any, to?: string): MessageData` - 生成消息对象
- `on(type: string, listener: Listener): void` - 注册消息监听器
- `off(type: string, listener?: Listener): void` - 移除消息监听器
- `destroy(): void` - 销毁实例
- `generateUUID(): string` - 生成唯一标识符

### 消息数据结构

```typescript
interface MessageData<T = any> {
  tag: string
  type: string
  resources: T
  receiver: string
  sender: string
  uuid: string
  proxy?: ProxyMeta
}

interface ProxyMeta {
  referer: string
}
```

## 注意事项

1. 使用前请确保浏览器支持 BroadcastChannel API
2. 消息监听器会在实例销毁时自动清理
3. 私有消息需要指定目标频道
4. 使用代理时需要注意消息的传递路径
5. 消息标签用于标识消息类型，确保消息格式正确
6. 渠道名称会自动添加前缀，避免命名冲突
7. 广播通道池会自动管理私有消息的通道

## 示例

### 跨窗口通信

```typescript
// 窗口 A
const broadcastA = new WebBroadcast()

broadcastA.on('update', (data) => {
  console.log('Window A received update:', data)
})

// 窗口 B
const broadcastB = new WebBroadcast()

broadcastB.postPublicMessage('update', { value: 'New data' })
```

### 私有通信

```typescript
// 发送方
const sender = new WebBroadcast()
const targetChannel = 'target-window'

sender.postPrivateMessage('private-message', { secret: 'data' }, targetChannel)

// 接收方
const receiver = new WebBroadcast()

receiver.on('private-message', (data) => {
  console.log('Received private message:', data)
})
```

### 使用消息代理

```typescript
// 主应用
const mainApp = new WebBroadcast({
  proxy: 'proxy-channel',
})

mainApp.on('app-message', (data) => {
  console.log('Main app received:', data)
})

// 代理应用
const proxyApp = new WebBroadcast({
  channel: 'proxy-channel',
})

proxyApp.on('app-message', (data) => {
  // 处理或转发消息
  console.log('Proxy received:', data)
})
```

### 状态同步

```typescript
// 状态管理
const stateBroadcast = new WebBroadcast()

// 监听状态更新
stateBroadcast.on('state-update', (newState) => {
  // 更新本地状态
  updateLocalState(newState)
})

// 发送状态更新
function updateState(newState) {
  stateBroadcast.postPublicMessage('state-update', newState)
}
```

## 文档

更多详细信息请查看 [文档](https://kazura233.github.io/kazurajs/docs/web-broadcast)。

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
