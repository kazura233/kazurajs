[npm]: https://img.shields.io/npm/v/@kazura/taro-storage
[npm-url]: https://www.npmjs.com/package/@kazura/taro-storage
[size]: https://packagephobia.now.sh/badge?p=@kazura/taro-storage
[size-url]: https://packagephobia.now.sh/result?p=@kazura/taro-storage
[license]: https://img.shields.io/badge/License-MIT-blue
[license-url]: https://github.com/kazura233/kazurajs/blob/master/LICENSE

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![license][license]][license-url]

# @kazura/taro-storage

Taro Storage 是一个为 Taro 应用提供本地存储功能的工具包，它实现了 Web Storage API 的接口，并提供了额外的功能。

## 特性

- 实现 Web Storage API 接口
- 支持同步存储操作
- 提供获取所有存储项的功能
- 类型安全的 API
- 轻量级，无依赖

## 安装

```bash
npm install @kazura/taro-storage
```

## 使用方法

### 基本使用

```typescript
import taroStorage from '@kazura/taro-storage'

// 存储数据
taroStorage.setItem('user', JSON.stringify({ name: 'John', age: 30 }))

// 获取数据
const user = JSON.parse(taroStorage.getItem('user') || '{}')

// 删除数据
taroStorage.removeItem('user')

// 清空所有数据
taroStorage.clear()

// 获取所有存储项
const allItems = taroStorage.all()
```

### 使用键值对

```typescript
import taroStorage from '@kazura/taro-storage'

// 存储多个值
taroStorage.setItem('name', 'John')
taroStorage.setItem('age', '30')
taroStorage.setItem('email', 'john@example.com')

// 获取特定键的值
const name = taroStorage.getItem('name')
const age = taroStorage.getItem('age')

// 获取存储项数量
const length = taroStorage.length

// 获取指定索引的键
const key = taroStorage.key(0)
```

## API 参考

### length

```typescript
get length(): number
```

获取存储项的数量。

### clear

```typescript
clear(): void
```

清空所有存储项。

### getItem

```typescript
getItem(key: string): string | null
```

获取指定键的存储值。

参数：

- `key`: 存储键名

返回值：

- 存储的值，如果不存在则返回 null

### setItem

```typescript
setItem(key: string, value: string): void
```

设置指定键的存储值。

参数：

- `key`: 存储键名
- `value`: 要存储的值

### removeItem

```typescript
removeItem(key: string): void
```

删除指定键的存储项。

参数：

- `key`: 要删除的存储键名

### key

```typescript
key(index: number): string | null
```

获取指定索引的存储键名。

参数：

- `index`: 键的索引

返回值：

- 存储键名，如果索引超出范围则返回 null

### all

```typescript
all(): { [key: string]: any }
```

获取所有存储项。

返回值：

- 包含所有存储项的对象

## 注意事项

1. 所有存储操作都是同步的
2. 存储的值必须是字符串
3. 存储空间有限，建议及时清理不需要的数据
4. 在存储对象时，需要先进行 JSON 序列化

## 示例

### 存储用户信息

```typescript
import taroStorage from '@kazura/taro-storage'

interface UserInfo {
  id: string
  name: string
  email: string
  preferences: {
    theme: 'light' | 'dark'
    language: string
  }
}

// 存储用户信息
const userInfo: UserInfo = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  preferences: {
    theme: 'light',
    language: 'en',
  },
}

taroStorage.setItem('userInfo', JSON.stringify(userInfo))

// 获取用户信息
const storedUserInfo = JSON.parse(taroStorage.getItem('userInfo') || '{}') as UserInfo
```

### 管理应用设置

```typescript
import taroStorage from '@kazura/taro-storage'

interface AppSettings {
  theme: 'light' | 'dark'
  fontSize: number
  notifications: boolean
}

// 初始化默认设置
const defaultSettings: AppSettings = {
  theme: 'light',
  fontSize: 14,
  notifications: true,
}

// 保存设置
function saveSettings(settings: AppSettings) {
  taroStorage.setItem('appSettings', JSON.stringify(settings))
}

// 加载设置
function loadSettings(): AppSettings {
  const stored = taroStorage.getItem('appSettings')
  return stored ? JSON.parse(stored) : defaultSettings
}

// 重置设置
function resetSettings() {
  taroStorage.removeItem('appSettings')
}
```

### 缓存 API 响应

```typescript
import taroStorage from '@kazura/taro-storage'

interface CacheItem<T> {
  data: T
  timestamp: number
  expiresIn: number
}

// 缓存数据
function cacheData<T>(key: string, data: T, expiresIn: number = 3600000) {
  const cacheItem: CacheItem<T> = {
    data,
    timestamp: Date.now(),
    expiresIn,
  }
  taroStorage.setItem(key, JSON.stringify(cacheItem))
}

// 获取缓存数据
function getCachedData<T>(key: string): T | null {
  const stored = taroStorage.getItem(key)
  if (!stored) return null

  const cacheItem: CacheItem<T> = JSON.parse(stored)
  const now = Date.now()

  if (now - cacheItem.timestamp > cacheItem.expiresIn) {
    taroStorage.removeItem(key)
    return null
  }

  return cacheItem.data
}
```

## 文档

更多详细信息请查看 [文档](https://kazura233.github.io/kazurajs/docs/taro-storage)。

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
