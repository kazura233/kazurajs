[npm]: https://img.shields.io/npm/v/@kazura/web-storage
[npm-url]: https://www.npmjs.com/package/@kazura/web-storage
[size]: https://packagephobia.now.sh/badge?p=@kazura/web-storage
[size-url]: https://packagephobia.now.sh/result?p=@kazura/web-storage
[license]: https://img.shields.io/badge/License-MIT-blue
[license-url]: https://github.com/kazura233/kazurajs/blob/master/LICENSE

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![license][license]][license-url]

# @kazura/web-storage

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

## 文档

更多详细信息请查看 [文档](https://kazura233.github.io/kazurajs/docs/web-storage)。

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
