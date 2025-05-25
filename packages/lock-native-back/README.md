[npm]: https://img.shields.io/npm/v/@kazura/lock-native-back
[npm-url]: https://www.npmjs.com/package/@kazura/lock-native-back
[size]: https://packagephobia.now.sh/badge?p=@kazura/lock-native-back
[size-url]: https://packagephobia.now.sh/result?p=@kazura/lock-native-back
[license]: https://img.shields.io/badge/License-MIT-blue
[license-url]: https://github.com/kazura233/kazurajs/blob/master/LICENSE

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![license][license]][license-url]

# @kazura/lock-native-back

Lock Native Back 是一个用于防止用户通过原生返回按钮退出应用的工具包，提供了简单易用的 API。

## 特性

- 支持浏览器原生返回按钮拦截
- 支持自定义返回事件处理
- 支持锁定和解锁状态管理
- 类型安全的 API

## 安装

```bash
npm install @kazura/lock-native-back
```

## 使用方法

### 基本使用

```typescript
import LockNativeBack from '@kazura/lock-native-back'

// 创建实例
const lockNativeBack = new LockNativeBack({
  onPopState: () => {
    console.log('Back button pressed')
  },
})

// 锁定返回按钮
const unlock = lockNativeBack.lock()

// 解锁返回按钮
unlock()
// 或者
lockNativeBack.unLock()
```

## API 参考

### 构造函数

```typescript
constructor(options?: Options)
```

创建一个 LockNativeBack 实例。

参数：

- `options`: 配置选项
  - `onPopState`: 返回按钮事件处理函数

### 实例方法

#### lock

```typescript
lock(): () => void
```

锁定返回按钮。

返回值：

- 解锁函数

#### unLock

```typescript
unLock(): void
```

解锁返回按钮。

## 类型定义

### Options

```typescript
interface Options {
  onPopState?: Function
}
```

配置选项接口。

## 注意事项

1. 确保在适当的时机锁定和解锁返回按钮
2. 注意返回事件的处理时机
3. 建议在组件卸载时解锁返回按钮
4. 避免重复锁定返回按钮

## 示例

### 在 React 组件中使用

```typescript
import React, { useEffect } from 'react'
import LockNativeBack from '@kazura/lock-native-back'

function Page() {
  useEffect(() => {
    const lockNativeBack = new LockNativeBack({
      onPopState: () => {
        console.log('Back button pressed')
      },
    })

    // 锁定返回按钮
    const unlock = lockNativeBack.lock()

    // 组件卸载时解锁
    return () => {
      unlock()
    }
  }, [])

  return <div>Page Content</div>
}
```

### 在 Vue 组件中使用

```typescript
import { defineComponent, onMounted, onUnmounted } from 'vue'
import LockNativeBack from '@kazura/lock-native-back'

export default defineComponent({
  setup() {
    let unlock: (() => void) | undefined

    onMounted(() => {
      const lockNativeBack = new LockNativeBack({
        onPopState: () => {
          console.log('Back button pressed')
        },
      })

      // 锁定返回按钮
      unlock = lockNativeBack.lock()
    })

    onUnmounted(() => {
      // 组件卸载时解锁
      if (unlock) {
        unlock()
      }
    })

    return {}
  },
})
```

## 文档

更多详细信息请查看 [文档](https://kazura233.github.io/kazurajs/docs/lock-native-back)。

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
