[npm]: https://img.shields.io/npm/v/@kazura/web-util
[npm-url]: https://www.npmjs.com/package/@kazura/web-util
[size]: https://packagephobia.now.sh/badge?p=@kazura/web-util
[size-url]: https://packagephobia.now.sh/result?p=@kazura/web-util
[license]: https://img.shields.io/badge/License-MIT-blue
[license-url]: https://github.com/kazura233/kazurajs/blob/master/LICENSE

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![license][license]][license-url]

# @kazura/web-util

Web Util 是一个提供常用 Web 工具函数的工具包，包含了文件处理、环境检测、事件处理等多种实用功能。

## 特性

- 提供丰富的文件格式转换功能
- 支持环境检测和浏览器兼容性检查
- 提供事件处理和 DOM 操作工具
- 支持音频播放和语音合成
- 支持文件拖放和粘贴处理
- 提供全局对象和微任务处理
- 支持文本处理和剪贴板操作

## 安装

```bash
npm install @kazura/web-util
```

## 使用方法

### 文件处理

```typescript
import {
  dataURLToBlob,
  blobToDataURL,
  fileToBase64,
  base64ToFile,
  formatFileSize,
  getFileExtension,
} from '@kazura/web-util'

// DataURL 转 Blob
const blob = dataURLToBlob('data:image/png;base64,...')

// Blob 转 DataURL
const dataURL = await blobToDataURL(blob)

// File 转 Base64
const base64 = await fileToBase64(file)

// Base64 转 File
const file = base64ToFile(base64, 'image.png', 'image/png')

// 格式化文件大小
const size = formatFileSize(1024 * 1024) // '1.00 MB'

// 获取文件扩展名
const ext = getFileExtension('image.png') // 'png'
```

### 环境检测

```typescript
import {
  isBrowser,
  isIE,
  isEdge,
  isChrome,
  isFirefox,
  isAndroid,
  isIOS,
  isFromWindows,
  isFromMac,
  isHttps,
  isHttp,
  isInChildFrame,
} from '@kazura/web-util'

// 检查是否在浏览器环境中
if (isBrowser()) {
  // 浏览器环境
}

// 检查浏览器类型
if (isChrome()) {
  // Chrome 浏览器
} else if (isFirefox()) {
  // Firefox 浏览器
}

// 检查设备类型
if (isAndroid()) {
  // Android 设备
} else if (isIOS()) {
  // iOS 设备
}
```

### 事件处理

```typescript
import { addEventListener, registerHandleDrop, registerHandlePaste } from '@kazura/web-util'

// 添加事件监听器
const removeListener = addEventListener(
  window,
  'resize',
  () => {
    console.log('Window resized')
  },
  { passive: true }
)

// 注册拖放处理
registerHandleDrop(element, {
  onDrop: (files) => {
    console.log('Dropped files:', files)
  },
})
```

### 音频处理

```typescript
import { speak } from '@kazura/web-util'

// 使用语音合成朗读文本
speak('Hello, World!', 'en-US')
```

### 文本处理

```typescript
import { insertAtTextarea, SpaceType } from '@kazura/web-util'

// 在文本区域插入文本
insertAtTextarea(textarea, 'Hello, World!')

// 使用全角空格
const fullWidthSpace = SpaceType.FullWidthSpace
```

### 剪贴板操作

```typescript
import { copy } from '@kazura/web-util'

// 复制文本到剪贴板
copy('Hello, World!')
```

### 其他工具函数

```typescript
import {
  random,
  sleep,
  unique,
  assert,
  withResolvers,
  appendScript,
  runFn,
  queueMicrotask,
  getGlobal,
  generateUID,
} from '@kazura/web-util'

// 生成随机数
const num = random(1, 100)

// 延时执行
await sleep(1000)

// 数组去重
const uniqueArray = unique([1, 2, 2, 3, 3, 4])

// 生成唯一标识符
const uid = generateUID()
```

## API 参考

### 文件处理函数

- `dataURLToBlob(data: string): Blob` - 将 DataURL 转换为 Blob
- `blobToDataURL(blob: Blob): Promise<string>` - 将 Blob 转换为 DataURL
- `fileToBase64(file: File): Promise<string>` - 将 File 转换为 Base64
- `base64ToFile(data: string, fileName: string, mime: string): File` - 将 Base64 转换为 File
- `formatFileSize(bytes: number): string` - 格式化文件大小
- `getFileExtension(file: File | string): string` - 获取文件扩展名

### 环境检测函数

- `isBrowser(): boolean` - 检查是否在浏览器环境中
- `isIE(): boolean` - 检查是否是 IE 浏览器
- `isEdge(): boolean` - 检查是否是 Edge 浏览器
- `isChrome(): boolean` - 检查是否是 Chrome 浏览器
- `isFirefox(): boolean` - 检查是否是 Firefox 浏览器
- `isAndroid(): boolean` - 检查是否是 Android 设备
- `isIOS(): boolean` - 检查是否是 iOS 设备
- `isFromWindows(): boolean` - 检查是否来自 Windows 系统
- `isFromMac(): boolean` - 检查是否来自 Mac 系统
- `isHttps(): boolean` - 检查是否是 HTTPS 协议
- `isHttp(): boolean` - 检查是否是 HTTP 协议
- `isInChildFrame(): boolean` - 检查是否在子框架中

### 事件处理函数

- `addEventListener(target: EventTarget, type: string, listener: EventListener, options?: boolean | AddEventListenerOptions): () => void` - 添加事件监听器
- `registerHandleDrop(element: HTMLElement, options: HandleDropOptions): void` - 注册拖放处理
- `registerHandlePaste(element: HTMLElement, options: HandlePasteOptions): void` - 注册粘贴处理

### 音频处理函数

- `speak(text: string, lang?: string): void` - 使用语音合成朗读文本

### 文本处理函数

- `insertAtTextarea(textarea: HTMLTextAreaElement, text: string): void` - 在文本区域插入文本
- `SpaceType` - 空格类型枚举

### 剪贴板操作函数

- `copy(text: string): Promise<void>` - 复制文本到剪贴板

### 其他工具函数

- `random(min: number, max: number): number` - 生成指定范围内的随机数
- `sleep(ms: number): Promise<void>` - 延时执行
- `unique<T>(array: T[]): T[]` - 数组去重
- `assert(condition: boolean, message?: string): void` - 断言
- `withResolvers<T>(): { promise: Promise<T>; resolve: (value: T) => void; reject: (reason?: any) => void }` - 创建带解析器的 Promise
- `appendScript(src: string, async?: boolean): Promise<void>` - 动态加载脚本
- `runFn<T>(fn: () => T | Promise<T>): Promise<T>` - 执行函数并包装结果
- `queueMicrotask(callback: () => void): void` - 添加微任务
- `getGlobal(): any` - 获取全局对象
- `generateUID(): string` - 生成唯一标识符

## 文档

更多详细信息请查看 [文档](https://kazura233.github.io/kazurajs/docs/web-util)。

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
