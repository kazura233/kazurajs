---
sidebar_position: 12
---

# PostMsg Builder

PostMsg Builder 是一个用于构建和处理 postMessage 通信的工具包，提供了类型安全和便捷的 API。

## 特性

- 支持 iframe 和 window.open 通信
- 支持父子窗口通信
- 支持自定义通信渠道
- 支持批量设置监听器
- 支持动态加载 iframe 内容
- 支持自动清理资源

## 安装

```bash
npm install @kazura/postmsg-builder
```

## 使用方法

### 基本使用

```typescript
import PostMsgBuilder from '@kazura/postmsg-builder'

// 创建构建器
const builder = new PostMsgBuilder()

// 设置接收者
builder.setReceiver(window.parent)

// 设置监听器
builder.setListener('message', (data) => {
  console.log('Received:', data)
})

// 构建 WebPostMsg 实例
const postMsg = builder.build()
```

### iframe 通信

```typescript
// 父窗口
const parentBuilder = new PostMsgBuilder()

// 创建子 iframe
parentBuilder.createChildIFrameReceiver({
  container: document.body,
  className: 'my-iframe',
  url: 'https://child.example.com',
})

// 加载 URL
parentBuilder.loadURL('https://child.example.com')

// 子窗口
const childBuilder = new PostMsgBuilder()
childBuilder.createParentIFrameReceiver()
```

### window.open 通信

```typescript
// 父窗口
const parentBuilder = new PostMsgBuilder()

// 打开子窗口
parentBuilder.createChildOpenerReceiver({
  url: 'https://child.example.com',
  features: 'width=800,height=600',
})

// 子窗口
const childBuilder = new PostMsgBuilder()
childBuilder.createParentOpenerReceiver()
```

### 批量设置监听器

```typescript
const builder = new PostMsgBuilder()

// 批量设置监听器
builder.setListeners(
  new Map([
    ['message', (data) => console.log('Message:', data)],
    ['error', (error) => console.error('Error:', error)],
  ])
)

// 设置单个监听器
builder.setListener('custom', (data) => console.log('Custom:', data))

// 删除监听器
builder.deleteListener('custom')
```

## API 参考

### PostMsgBuilder

#### constructor

```typescript
constructor(options?: Partial<PostMsgAPIOptions>)
```

创建一个 PostMsgBuilder 实例。

参数：

- `options`: 可选的配置选项

#### setChannel

```typescript
private setChannel(channel: string): void
```

设置通信渠道。

参数：

- `channel`: 渠道名称

#### setReceiver

```typescript
setReceiver(receiver: Window): PostMsgBuilder
```

设置接收者。

参数：

- `receiver`: 接收者窗口

返回值：

- PostMsgBuilder 实例

#### setIFrameReceiver

```typescript
setIFrameReceiver(iframe: HTMLIFrameElement): PostMsgBuilder
```

设置 iframe 接收者。

参数：

- `iframe`: iframe 元素

返回值：

- PostMsgBuilder 实例

#### setListeners

```typescript
setListeners(listeners: Map<string, Listener>): PostMsgBuilder
```

批量设置监听器。

参数：

- `listeners`: 监听器映射

返回值：

- PostMsgBuilder 实例

#### setListener

```typescript
setListener(type: string, listener: Listener): PostMsgBuilder
```

设置单个监听器。

参数：

- `type`: 消息类型
- `listener`: 监听器函数

返回值：

- PostMsgBuilder 实例

#### deleteListener

```typescript
deleteListener(type: string): PostMsgBuilder
```

删除监听器。

参数：

- `type`: 消息类型

返回值：

- PostMsgBuilder 实例

#### setReceiveAllChannel

```typescript
setReceiveAllChannel(receiveAllChannel: boolean): PostMsgBuilder
```

设置是否接收所有渠道的消息。

参数：

- `receiveAllChannel`: 是否接收所有渠道的消息

返回值：

- PostMsgBuilder 实例

#### build

```typescript
build(): WebPostMsg
```

构建 WebPostMsg 实例。

返回值：

- WebPostMsg 实例

#### createChildIFrameReceiver

```typescript
createChildIFrameReceiver(iframe: HTMLIFrameElement): PostMsgBuilder
createChildIFrameReceiver(options: ParentIFrameReceiverOptions): PostMsgBuilder
```

创建子 iframe 接收者。

参数：

- `iframe`: iframe 元素或配置选项

返回值：

- PostMsgBuilder 实例

#### loadURL

```typescript
loadURL(url: string): PostMsgBuilder
```

加载 iframe URL。

参数：

- `url`: 要加载的 URL

返回值：

- PostMsgBuilder 实例

#### createParentIFrameReceiver

```typescript
createParentIFrameReceiver(): PostMsgBuilder
```

创建父 iframe 接收者。

返回值：

- PostMsgBuilder 实例

#### createChildOpenerReceiver

```typescript
createChildOpenerReceiver(receiver: Window, name: string): PostMsgBuilder
createChildOpenerReceiver(options: ParentOpenerReceiverOptions): PostMsgBuilder
```

创建子 opener 接收者。

参数：

- `receiver`: 接收者窗口或配置选项
- `name`: 渠道名称（当使用 receiver 参数时）

返回值：

- PostMsgBuilder 实例

#### open

```typescript
open(url: string, features?: string): PostMsgBuilder
```

打开新窗口。

参数：

- `url`: 要打开的 URL
- `features`: 窗口特性

返回值：

- PostMsgBuilder 实例

#### createParentOpenerReceiver

```typescript
createParentOpenerReceiver(): PostMsgBuilder
```

创建父 opener 接收者。

返回值：

- PostMsgBuilder 实例

#### destroy

```typescript
destroy(): PostMsgBuilder
```

销毁实例，清理资源。

返回值：

- PostMsgBuilder 实例

## 注意事项

1. 确保正确设置通信渠道
2. 注意处理跨域通信的安全限制
3. 及时清理不需要的监听器
4. 使用 destroy 方法清理资源
5. 注意处理通信错误和异常情况

## 示例

### 父子窗口通信

```typescript
// 父窗口
const parentBuilder = new PostMsgBuilder()

// 创建子 iframe
parentBuilder
  .createChildIFrameReceiver({
    container: document.body,
    className: 'child-iframe',
    url: 'https://child.example.com',
  })
  .setListener('message', (data) => {
    console.log('Received from child:', data)
  })
  .build()

// 子窗口
const childBuilder = new PostMsgBuilder()
  .createParentIFrameReceiver()
  .setListener('message', (data) => {
    console.log('Received from parent:', data)
  })
  .build()
```

### 窗口通信

```typescript
// 父窗口
const parentBuilder = new PostMsgBuilder()

// 打开子窗口
parentBuilder
  .createChildOpenerReceiver({
    url: 'https://child.example.com',
    features: 'width=800,height=600',
  })
  .setListener('message', (data) => {
    console.log('Received from child:', data)
  })
  .build()

// 子窗口
const childBuilder = new PostMsgBuilder()
  .createParentOpenerReceiver()
  .setListener('message', (data) => {
    console.log('Received from parent:', data)
  })
  .build()
```

### 批量监听器

```typescript
const builder = new PostMsgBuilder()

// 批量设置监听器
builder
  .setListeners(
    new Map([
      ['message', (data) => console.log('Message:', data)],
      ['error', (error) => console.error('Error:', error)],
      ['custom', (data) => console.log('Custom:', data)],
    ])
  )
  .build()

// 删除不需要的监听器
builder.deleteListener('custom')
```
