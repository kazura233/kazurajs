---
sidebar_position: 8
---

# Web Storage

Web Storage 是一个提供本地存储功能的工具包，它支持多种数据类型的存储和自动序列化/反序列化。

## 特性

- 支持多种数据类型的存储（Array、Object、Boolean、Number、String、Map、Set）
- 自动序列化和反序列化
- 类型安全的 API
- 支持 localStorage 和 sessionStorage
- 提供获取所有存储项的功能

## 安装

```bash
npm install @kazura/web-storage
```

## 使用方法

### 基本使用

```typescript
import WebStorage from '@kazura/web-storage'

// 创建存储实例
const storage = new WebStorage(localStorage, 'user', Object)

// 存储数据
storage.setItem({ name: 'John', age: 30 })

// 获取数据
const user = storage.getItem()

// 删除数据
storage.removeItem()

// 清空所有数据
storage.clear()

// 获取所有存储项
const allItems = storage.all()
```

### 使用不同数据类型

```typescript
import WebStorage from '@kazura/web-storage'

// 存储数组
const arrayStorage = new WebStorage(localStorage, 'items', Array)
arrayStorage.setItem(['apple', 'banana', 'orange'])

// 存储 Map
const mapStorage = new WebStorage(localStorage, 'settings', Map)
mapStorage.setItem(
  new Map([
    ['theme', 'dark'],
    ['language', 'en'],
  ])
)

// 存储 Set
const setStorage = new WebStorage(localStorage, 'tags', Set)
setStorage.setItem(new Set(['important', 'urgent', 'todo']))

// 存储布尔值
const boolStorage = new WebStorage(localStorage, 'isLoggedIn', Boolean)
boolStorage.setItem(true)

// 存储数字
const numberStorage = new WebStorage(localStorage, 'count', Number)
numberStorage.setItem(42)

// 存储字符串
const stringStorage = new WebStorage(localStorage, 'message', String)
stringStorage.setItem('Hello, World!')
```

## API 参考

### 构造函数

```typescript
constructor(storage: Storage, keyName: string, valueType: any)
```

创建一个 WebStorage 实例。

参数：

- `storage`: 存储对象（localStorage 或 sessionStorage）
- `keyName`: 存储的键名
- `valueType`: 存储值的数据类型（Array、Object、Boolean、Number、String、Map、Set）

### getItem

```typescript
getItem(): any
```

获取存储的值。

返回值：

- 存储的值，如果不存在则返回 null

### setItem

```typescript
setItem(value: any): void
```

设置存储的值。

参数：

- `value`: 要存储的值

### removeItem

```typescript
removeItem(): void
```

删除存储的值。

### clear

```typescript
clear(): void
```

清空所有存储项。

### key

```typescript
key(key: number): string | null
```

获取指定索引的键名。

参数：

- `key`: 键的索引

返回值：

- 键名，如果索引无效则返回 null

### length

```typescript
get length(): number
```

获取存储的键值对个数。

### all

```typescript
all(): { [key: string]: string }
```

获取所有存储的键值对。

返回值：

- 包含所有存储项的对象

### getStorage

```typescript
getStorage(): Storage
```

获取存储对象。

返回值：

- 存储对象（localStorage 或 sessionStorage）

### getKeyName

```typescript
getKeyName(): string
```

获取存储的键名。

返回值：

- 键名

### getValueType

```typescript
getValueType(): any
```

获取存储值的数据类型。

返回值：

- 数据类型

## 注意事项

1. 支持的数据类型包括：Array、Object、Boolean、Number、String、Map、Set
2. 存储的值会自动序列化和反序列化
3. 存储空间有限，建议及时清理不需要的数据
4. 使用 Map 和 Set 类型时，会自动转换为数组进行存储

## 示例

### 存储用户信息

```typescript
import WebStorage from '@kazura/web-storage'

interface UserInfo {
  id: string
  name: string
  email: string
  preferences: {
    theme: 'light' | 'dark'
    language: string
  }
}

// 创建存储实例
const userStorage = new WebStorage(localStorage, 'userInfo', Object)

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

userStorage.setItem(userInfo)

// 获取用户信息
const storedUserInfo = userStorage.getItem() as UserInfo
```

### 管理购物车

```typescript
import WebStorage from '@kazura/web-storage'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

// 创建存储实例
const cartStorage = new WebStorage(localStorage, 'cart', Array)

// 添加商品到购物车
function addToCart(item: CartItem) {
  const cart = (cartStorage.getItem() as CartItem[]) || []
  const existingItem = cart.find((i) => i.id === item.id)

  if (existingItem) {
    existingItem.quantity += item.quantity
  } else {
    cart.push(item)
  }

  cartStorage.setItem(cart)
}

// 从购物车移除商品
function removeFromCart(itemId: string) {
  const cart = (cartStorage.getItem() as CartItem[]) || []
  const updatedCart = cart.filter((item) => item.id !== itemId)
  cartStorage.setItem(updatedCart)
}

// 清空购物车
function clearCart() {
  cartStorage.removeItem()
}

// 获取购物车总价
function getCartTotal(): number {
  const cart = (cartStorage.getItem() as CartItem[]) || []
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}
```

### 管理应用设置

```typescript
import WebStorage from '@kazura/web-storage'

interface AppSettings {
  theme: 'light' | 'dark'
  fontSize: number
  notifications: boolean
  recentFiles: Set<string>
  shortcuts: Map<string, string>
}

// 创建存储实例
const settingsStorage = new WebStorage(localStorage, 'appSettings', Object)

// 初始化默认设置
const defaultSettings: AppSettings = {
  theme: 'light',
  fontSize: 14,
  notifications: true,
  recentFiles: new Set(),
  shortcuts: new Map(),
}

// 保存设置
function saveSettings(settings: AppSettings) {
  settingsStorage.setItem(settings)
}

// 加载设置
function loadSettings(): AppSettings {
  const stored = settingsStorage.getItem()
  return stored || defaultSettings
}

// 更新主题
function updateTheme(theme: 'light' | 'dark') {
  const settings = loadSettings()
  settings.theme = theme
  saveSettings(settings)
}

// 添加最近文件
function addRecentFile(filePath: string) {
  const settings = loadSettings()
  settings.recentFiles.add(filePath)
  saveSettings(settings)
}

// 添加快捷键
function addShortcut(key: string, command: string) {
  const settings = loadSettings()
  settings.shortcuts.set(key, command)
  saveSettings(settings)
}
```

### 缓存 API 响应

```typescript
import WebStorage from '@kazura/web-storage'

interface CacheItem<T> {
  data: T
  timestamp: number
  expiresIn: number
}

// 创建存储实例
const cacheStorage = new WebStorage(localStorage, 'apiCache', Object)

// 缓存数据
function cacheData<T>(key: string, data: T, expiresIn: number = 3600000) {
  const cache = (cacheStorage.getItem() as { [key: string]: CacheItem<T> }) || {}
  cache[key] = {
    data,
    timestamp: Date.now(),
    expiresIn,
  }
  cacheStorage.setItem(cache)
}

// 获取缓存数据
function getCachedData<T>(key: string): T | null {
  const cache = (cacheStorage.getItem() as { [key: string]: CacheItem<T> }) || {}
  const item = cache[key]

  if (!item) return null

  const now = Date.now()
  if (now - item.timestamp > item.expiresIn) {
    delete cache[key]
    cacheStorage.setItem(cache)
    return null
  }

  return item.data
}

// 清除过期缓存
function clearExpiredCache() {
  const cache = (cacheStorage.getItem() as { [key: string]: CacheItem<any> }) || {}
  const now = Date.now()

  Object.entries(cache).forEach(([key, item]) => {
    if (now - item.timestamp > item.expiresIn) {
      delete cache[key]
    }
  })

  cacheStorage.setItem(cache)
}
```
