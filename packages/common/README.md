[npm]: https://img.shields.io/npm/v/@kazura/common
[npm-url]: https://www.npmjs.com/package/@kazura/common
[size]: https://packagephobia.now.sh/badge?p=@kazura/common
[size-url]: https://packagephobia.now.sh/result?p=@kazura/common
[license]: https://img.shields.io/badge/License-MIT-blue
[license-url]: https://github.com/kazura233/kazurajs/blob/master/LICENSE

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![license][license]][license-url]

# @kazura/common

Common 是一个提供常用工具函数的工具包，它包含了一些在日常开发中经常使用的基础函数。

## 特性

- 提供常用的工具函数
- 类型安全的函数实现
- 提供完整的 TypeScript 类型支持
- 轻量级，无依赖

## 安装

```bash
npm install @kazura/common
```

## 使用方法

### 基本用法

```typescript
import { noop, extend, hasOwn, toRawType } from '@kazura/common'

// 使用 noop 函数
const callback = noop

// 使用 extend 函数（Object.assign 的别名）
const obj1 = { a: 1 }
const obj2 = { b: 2 }
const result = extend({}, obj1, obj2) // { a: 1, b: 2 }

// 使用 hasOwn 函数
const obj = { prop: 'value' }
console.log(hasOwn(obj, 'prop')) // true
console.log(hasOwn(obj, 'toString')) // false

// 使用 toRawType 函数
console.log(toRawType(new Map())) // "Map"
console.log(toRawType([])) // "Array"
console.log(toRawType({})) // "Object"
```

## API 参考

### 函数

#### noop

```typescript
function noop(..._: any[]): any
```

一个什么也不做的函数。用于作为默认的回调函数或占位符。

#### extend

```typescript
const extend = Object.assign
```

对象的合并函数 Object.assign 的引用。用于合并多个对象的属性。

#### hasOwnProperty

```typescript
const hasOwnProperty = Object.prototype.hasOwnProperty
```

Object.prototype 上的 hasOwnProperty 方法的引用。

#### hasOwn

```typescript
function hasOwn(val: object, key: string | symbol): key is keyof typeof val
```

检查对象是否直接拥有指定属性。

参数：

- `val`: 要检查的对象
- `key`: 要检查的属性键

返回值：

- 如果对象直接拥有该属性，则返回 true，否则返回 false

#### objectToString

```typescript
const objectToString = Object.prototype.toString
```

Object.prototype 上的 toString 方法的引用。

#### toTypeString

```typescript
function toTypeString(value: unknown): string
```

获取一个对象的类型字符串。

参数：

- `value`: 要获取类型字符串的对象

返回值：

- 对象的类型字符串

示例：

```typescript
toTypeString(new Map()) // "[object Map]"
toTypeString([]) // "[object Array]"
toTypeString({}) // "[object Object]"
```

#### toRawType

```typescript
function toRawType(value: unknown): string
```

获取一个对象的原始类型。

参数：

- `value`: 要获取原始类型的对象

返回值：

- 对象的原始类型

示例：

```typescript
toRawType(new Map()) // "Map"
toRawType([]) // "Array"
toRawType({}) // "Object"
toRawType('string') // "String"
toRawType(123) // "Number"
toRawType(true) // "Boolean"
```

## 注意事项

1. `hasOwn` 函数只会检查对象自身的属性，不会检查原型链上的属性
2. `toTypeString` 和 `toRawType` 函数可以用于类型检查，但建议使用 TypeScript 的类型系统进行类型检查
3. `extend` 函数是 `Object.assign` 的别名，使用方式完全相同

## 示例

### 类型检查

```typescript
import { toRawType } from '@kazura/common'

function processValue(value: unknown) {
  switch (toRawType(value)) {
    case 'Array':
      return value.map((item) => processValue(item))
    case 'Object':
      return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, processValue(val)]))
    default:
      return value
  }
}
```

### 对象属性检查

```typescript
import { hasOwn } from '@kazura/common'

function validateConfig(config: object) {
  const requiredProps = ['name', 'version', 'description']

  for (const prop of requiredProps) {
    if (!hasOwn(config, prop)) {
      throw new Error(`Missing required property: ${prop}`)
    }
  }
}
```

### 对象合并

```typescript
import { extend } from '@kazura/common'

const defaultConfig = {
  timeout: 5000,
  retries: 3,
  debug: false,
}

const userConfig = {
  timeout: 3000,
  debug: true,
}

const finalConfig = extend({}, defaultConfig, userConfig)
// { timeout: 3000, retries: 3, debug: true }
```

## 文档

更多详细信息请查看 [文档](https://kazura233.github.io/kazurajs/docs/common)。

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
