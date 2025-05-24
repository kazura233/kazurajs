---
sidebar_position: 6
---

# Web Util

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
  isIE9,
  isEdge,
  isChrome,
  isFirefox,
  isPhantomJS,
  isAndroid,
  isIOS,
  isFromWindows,
  isFromMac,
  isNative,
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
} else if (isIE()) {
  // IE 浏览器
} else if (isEdge()) {
  // Edge 浏览器
}

// 检查设备类型
if (isAndroid()) {
  // Android 设备
} else if (isIOS()) {
  // iOS 设备
}

// 检查操作系统
if (isFromWindows()) {
  // Windows 系统
} else if (isFromMac()) {
  // Mac 系统
}

// 检查协议
if (isHttps()) {
  // HTTPS 协议
} else if (isHttp()) {
  // HTTP 协议
}

// 检查是否在子框架中
if (isInChildFrame()) {
  // 在子框架中
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

// 移除事件监听器
removeListener()

// 注册拖放处理
registerHandleDrop(element, {
  onDrop: (files) => {
    console.log('Dropped files:', files)
  },
})

// 注册粘贴处理
registerHandlePaste(element, {
  onPaste: (files) => {
    console.log('Pasted files:', files)
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

// 使用半角空格
const halfWidthSpace = SpaceType.HalfWidthSpace
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

// 断言
assert(condition, 'Condition not met')

// 创建带解析器的 Promise
const { promise, resolve, reject } = withResolvers()

// 动态加载脚本
appendScript('https://example.com/script.js', true)

// 执行函数并包装结果
const result = await runFn(() => someAsyncOperation())

// 添加微任务
queueMicrotask(() => {
  console.log('Microtask executed')
})

// 获取全局对象
const global = getGlobal()

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
- `isIE(): boolean` - 检查是否为 IE 浏览器
- `isIE9(): boolean` - 检查是否为 IE 9
- `isEdge(): boolean` - 检查是否为 Edge 浏览器
- `isChrome(): boolean` - 检查是否为 Chrome 浏览器
- `isFirefox(): boolean` - 检查是否为 Firefox 浏览器
- `isPhantomJS(): boolean` - 检查是否为 PhantomJS 浏览器
- `isAndroid(): boolean` - 检查是否为 Android 设备
- `isIOS(): boolean` - 检查是否为 iOS 设备
- `isFromWindows(): boolean` - 检查是否为 Windows 系统
- `isFromMac(): boolean` - 检查是否为 Mac 系统
- `isNative(Ctor: any): boolean` - 检查函数是否为原生函数
- `isHttps(): boolean` - 检查是否为 HTTPS 协议
- `isHttp(): boolean` - 检查是否为 HTTP 协议
- `isInChildFrame(): boolean` - 检查是否在子框架中

### 事件处理函数

- `addEventListener(target: EventTarget, type: string, listener: EventListener, options?: boolean | AddEventListenerOptions): () => void` - 添加事件监听器
- `registerHandleDrop(element: HTMLElement, options: { onDrop: (files: File[]) => void }): void` - 注册拖放处理
- `registerHandlePaste(element: HTMLElement, options: { onPaste: (files: File[]) => void }): void` - 注册粘贴处理

### 音频处理函数

- `speak(text: string, lang: string): void` - 使用语音合成朗读文本

### 文本处理函数

- `insertAtTextarea(textarea: HTMLTextAreaElement, text: string): void` - 在文本区域插入文本

### 其他工具函数

- `random(min: number, max: number): number` - 生成指定范围内的随机整数
- `sleep(duration?: number): Promise<void>` - 延时执行
- `unique<T>(arr: T[]): T[]` - 数组去重
- `assert(condition: boolean, msg: string): void` - 断言
- `withResolvers<T>(): PromiseWithResolvers<T>` - 创建带解析器的 Promise
- `appendScript(url: string, async?: boolean, defer?: boolean): void` - 动态加载脚本
- `runFn<T>(fn: Promise<T> | ((...args: any[]) => T)): Promise<T>` - 执行函数并包装结果
- `queueMicrotask(callback: VoidFunction): void` - 添加微任务
- `getGlobal(): (Window & typeof globalThis) | undefined` - 获取全局对象
- `generateUID(): string` - 生成唯一标识符

### 常量

- `SpaceType` - 空格类型常量
  - `FullWidthSpace`: 全角空格
  - `HalfWidthSpace`: 半角空格

## 注意事项

1. 部分函数仅在浏览器环境中可用
2. 使用 `speak` 函数需要浏览器支持语音合成 API
3. 文件处理函数可能需要较大的内存空间
4. 使用 `queueMicrotask` 时要注意避免过度使用
5. 使用 `getGlobal` 函数时要注意兼容性

## 示例

### 文件上传预览

```typescript
import { fileToDataURL } from '@kazura/web-util'

async function handleFileUpload(file: File) {
  try {
    // 转换为 DataURL 用于预览
    const dataURL = await fileToDataURL(file)

    // 创建预览图片
    const img = document.createElement('img')
    img.src = dataURL

    // 添加到预览区域
    previewContainer.appendChild(img)
  } catch (error) {
    console.error('File preview failed:', error)
  }
}
```

### 拖放上传

```typescript
import { registerHandleDrop } from '@kazura/web-util'

function setupDropZone(element: HTMLElement) {
  registerHandleDrop(element, {
    onDragOver: (event) => {
      event.preventDefault()
      element.classList.add('dragover')
    },
    onDragLeave: () => {
      element.classList.remove('dragover')
    },
    onDrop: (files) => {
      element.classList.remove('dragover')
      handleFiles(files)
    },
  })
}
```

### 多语言支持

```typescript
import { getLocaleLanguage, speak } from '@kazura/web-util'

function setupLanguageSupport() {
  const language = getLocaleLanguage()

  // 根据语言设置界面
  document.documentElement.lang = language

  // 设置语音合成语言
  const text = 'Welcome to our website'
  speak(text, language)
}
```

### 文件大小格式化

```typescript
import { formatFileSize } from '@kazura/web-util'

function displayFileInfo(file: File) {
  const size = formatFileSize(file.size)
  const type = file.type

  console.log(`File: ${file.name}`)
  console.log(`Size: ${size}`)
  console.log(`Type: ${type}`)
}
```

### 环境适配

```typescript
import { isBrowser, isChrome, isFirefox, isAndroid, isIOS } from '@kazura/web-util'

function setupEnvironment() {
  if (!isBrowser()) {
    console.warn('Not running in browser environment')
    return
  }

  // 根据浏览器类型设置特性
  if (isChrome()) {
    enableChromeFeatures()
  } else if (isFirefox()) {
    enableFirefoxFeatures()
  }

  // 根据设备类型设置布局
  if (isAndroid()) {
    setupAndroidLayout()
  } else if (isIOS()) {
    setupIOSLayout()
  }
}
```
