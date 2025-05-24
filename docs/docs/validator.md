---
sidebar_position: 21
---

# Validator

Validator 是一个提供类型检查和数据验证功能的工具包，支持多种数据类型的验证。

## 特性

- 类型检查（数组、布尔值、日期、枚举、数字、对象、字符串等）
- 数组验证（包含、最大/最小长度、唯一性等）
- 字符串验证（JSON、Base64、DataURL、MD5、大小写、哈希、颜色、UUID 等）
- 数字验证（正负数、最大/最小值等）
- 日期验证（最大/最小日期）
- 对象验证（实例检查、非空检查）
- 通用验证（相等、定义、空值、包含等）

## 安装

```bash
npm install @kazura/validator
```

## 使用方法

### 类型检查

```typescript
import {
  isArray,
  isBoolean,
  isDate,
  isEnum,
  isInt,
  isNumber,
  isObject,
  isString,
  isPromise,
  isMap,
  isSet,
  isRegExp,
  isFunction,
  isSymbol,
} from '@kazura/validator'

// 数组检查
isArray([1, 2, 3]) // true

// 布尔值检查
isBoolean(true) // true

// 日期检查
isDate(new Date()) // true

// 枚举检查
enum Color {
  Red,
  Green,
  Blue,
}
isEnum(Color.Red, Color) // true

// 整数检查
isInt(42) // true

// 数字检查
isNumber(3.14, { maxDecimalPlaces: 2 }) // true

// 对象检查
isObject({}) // true

// 字符串检查
isString('Hello') // true

// Promise 检查
isPromise(Promise.resolve()) // true

// Map 检查
isMap(new Map()) // true

// Set 检查
isSet(new Set()) // true

// RegExp 检查
isRegExp(/test/) // true

// 函数检查
isFunction(() => {}) // true

// Symbol 检查
isSymbol(Symbol()) // true
```

### 数组验证

```typescript
import {
  arrayContains,
  arrayMaxSize,
  arrayMinSize,
  arrayNotContains,
  arrayNotEmpty,
  arrayUnique,
} from '@kazura/validator'

// 检查数组是否包含所有值
arrayContains([1, 2, 3], [1, 2]) // true

// 检查数组长度是否小于等于指定值
arrayMaxSize([1, 2, 3], 3) // true

// 检查数组长度是否大于等于指定值
arrayMinSize([1, 2, 3], 2) // true

// 检查数组是否不包含任何指定值
arrayNotContains([1, 2, 3], [4, 5]) // true

// 检查数组是否非空
arrayNotEmpty([1, 2, 3]) // true

// 检查数组是否唯一
arrayUnique([1, 2, 3]) // true
arrayUnique([{ id: 1 }, { id: 2 }], (item) => item.id) // true
```

### 字符串验证

```typescript
import {
  isJSON,
  isBase64,
  isDataURL,
  isMD5,
  isLowercase,
  isUppercase,
  isHash,
  isHexColor,
  isUUID,
} from '@kazura/validator'

// JSON 检查
isJSON('{"name": "John"}') // true

// Base64 检查
isBase64('SGVsbG8=') // true

// DataURL 检查
isDataURL(
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
) // true

// MD5 检查
isMD5('d41d8cd98f00b204e9800998ecf8427e') // true

// 小写检查
isLowercase('hello') // true

// 大写检查
isUppercase('HELLO') // true

// 哈希检查
isHash('5d41402abc4b2a76b9719d911017c592', 'md5') // true

// 十六进制颜色检查
isHexColor('#ff0000') // true

// UUID 检查
isUUID('123e4567-e89b-12d3-a456-426614174000') // true
```

### 数字验证

```typescript
import { isNegative, isPositive, max, min } from '@kazura/validator'

// 负数检查
isNegative(-1) // true

// 正数检查
isPositive(1) // true

// 最大值检查
max(5, 10) // true

// 最小值检查
min(10, 5) // true
```

### 日期验证

```typescript
import { maxDate, minDate } from '@kazura/validator'

const now = new Date()
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

// 最大日期检查
maxDate(now, tomorrow) // true

// 最小日期检查
minDate(now, yesterday) // true
```

### 对象验证

```typescript
import { isInstance, isNotEmptyObject } from '@kazura/validator'

class User {}

// 实例检查
isInstance(new User(), User) // true

// 非空对象检查
isNotEmptyObject({ name: 'John' }) // true
isNotEmptyObject({ name: 'John' }, { nullable: false }) // true
```

### 通用验证

```typescript
import { equals, isDefined, isEmpty, isIn, isNotEmpty, isNotIn, notEquals } from '@kazura/validator'

// 相等检查
equals(1, 1) // true

// 定义检查
isDefined('test') // true

// 空值检查
isEmpty('') // true

// 包含检查
isIn('a', ['a', 'b', 'c']) // true

// 非空检查
isNotEmpty('test') // true

// 不包含检查
isNotIn('d', ['a', 'b', 'c']) // true

// 不相等检查
notEquals(1, 2) // true
```

## API 参考

### 类型检查

#### isArray

```typescript
function isArray<T = any>(value: unknown): value is Array<T>
```

检查值是否为数组。

#### isBoolean

```typescript
function isBoolean(value: unknown): value is boolean
```

检查值是否为布尔值。

#### isDate

```typescript
function isDate(value: unknown): value is Date
```

检查值是否为日期。

#### isEnum

```typescript
function isEnum(value: unknown, entity: any): boolean
```

检查值是否为枚举成员。

#### isInt

```typescript
function isInt(val: unknown): val is Number
```

检查值是否为整数。

#### isNumber

```typescript
function isNumber(value: unknown, options?: IsNumberOptions): value is number
```

检查值是否为数字。

参数：

- `options`: 数字选项
  - `allowNaN`: 是否允许 NaN
  - `allowInfinity`: 是否允许无穷大
  - `maxDecimalPlaces`: 最大小数位数

#### isObject

```typescript
function isObject<T = object>(value: unknown): value is T
```

检查值是否为对象。

#### isString

```typescript
function isString(value: unknown): value is string
```

检查值是否为字符串。

#### isPromise

```typescript
function isPromise<T>(p: any): p is Promise<T>
```

检查值是否为 Promise。

#### isMap

```typescript
function isMap<K = any, V = any>(val: unknown): val is Map<K, V>
```

检查值是否为 Map。

#### isSet

```typescript
function isSet<T = any>(val: unknown): val is Set<T>
```

检查值是否为 Set。

#### isRegExp

```typescript
function isRegExp(val: unknown): val is RegExp
```

检查值是否为 RegExp。

#### isFunction

```typescript
function isFunction(val: unknown): val is Function
```

检查值是否为函数。

#### isSymbol

```typescript
function isSymbol(val: unknown): val is symbol
```

检查值是否为 Symbol。

### 数组验证

#### arrayContains

```typescript
function arrayContains(array: unknown, values: any[]): boolean
```

检查数组是否包含所有指定值。

#### arrayMaxSize

```typescript
function arrayMaxSize(array: unknown, max: number): boolean
```

检查数组长度是否小于等于指定值。

#### arrayMinSize

```typescript
function arrayMinSize(array: unknown, min: number): boolean
```

检查数组长度是否大于等于指定值。

#### arrayNotContains

```typescript
function arrayNotContains(array: unknown, values: any[]): boolean
```

检查数组是否不包含任何指定值。

#### arrayNotEmpty

```typescript
function arrayNotEmpty(array: unknown): boolean
```

检查数组是否非空。

#### arrayUnique

```typescript
function arrayUnique(array: unknown[], identifier?: ArrayUniqueIdentifier): boolean
```

检查数组是否唯一。

参数：

- `identifier`: 自定义标识函数

### 字符串验证

#### isJSON

```typescript
function isJSON(str: string): boolean
```

检查字符串是否为 JSON。

#### isBase64

```typescript
function isBase64(str: string, regex?: boolean): boolean
```

检查字符串是否为 Base64。

参数：

- `regex`: 是否使用正则表达式判断

#### isDataURL

```typescript
function isDataURL(str: string, regex?: boolean): boolean
```

检查字符串是否为 DataURL。

参数：

- `regex`: 是否使用正则表达式判断

#### isMD5

```typescript
function isMD5(str: string): boolean
```

检查字符串是否为 MD5。

#### isLowercase

```typescript
function isLowercase(str: string): boolean
```

检查字符串是否为小写。

#### isUppercase

```typescript
function isUppercase(str: string): boolean
```

检查字符串是否为大写。

#### isHash

```typescript
function isHash(str: string, algorithm: keyof typeof HashAlgorithmMap): boolean
```

检查字符串是否为指定算法的哈希值。

参数：

- `algorithm`: 哈希算法类型

#### isHexColor

```typescript
function isHexColor(str: string): boolean
```

检查字符串是否为十六进制颜色值。

#### isUUID

```typescript
function isUUID(str: string, version?: keyof typeof UUIDVersionMap): boolean
```

检查字符串是否为 UUID。

参数：

- `version`: UUID 版本

### 数字验证

#### isNegative

```typescript
function isNegative(value: unknown): boolean
```

检查值是否为负数。

#### isPositive

```typescript
function isPositive(value: unknown): boolean
```

检查值是否为正数。

#### max

```typescript
function max(num: unknown, max: number): boolean
```

检查数字是否小于等于指定值。

#### min

```typescript
function min(num: unknown, min: number): boolean
```

检查数字是否大于等于指定值。

### 日期验证

#### maxDate

```typescript
function maxDate(date: unknown, maxDate: Date | (() => Date)): boolean
```

检查日期是否早于指定日期。

#### minDate

```typescript
function minDate(date: unknown, minDate: Date | (() => Date)): boolean
```

检查日期是否晚于指定日期。

### 对象验证

#### isInstance

```typescript
function isInstance(object: unknown, targetTypeConstructor: new (...args: any[]) => any): boolean
```

检查值是否为指定对象的实例。

#### isNotEmptyObject

```typescript
function isNotEmptyObject(value: unknown, options?: { nullable?: boolean }): boolean
```

检查值是否为非空对象。

参数：

- `options`: 对象选项
  - `nullable`: 是否允许 null 值

### 通用验证

#### equals

```typescript
function equals(value: unknown, comparison: unknown): boolean
```

检查值是否相等。

#### isDefined

```typescript
function isDefined(value: any): boolean
```

检查值是否已定义。

#### isEmpty

```typescript
function isEmpty(value: unknown): boolean
```

检查值是否为空。

#### isIn

```typescript
function isIn(value: unknown, possibleValues: readonly unknown[]): boolean
```

检查值是否在允许值数组中。

#### isNotEmpty

```typescript
function isNotEmpty(value: unknown): boolean
```

检查值是否非空。

#### isNotIn

```typescript
function isNotIn(value: unknown, possibleValues: readonly unknown[]): boolean
```

检查值是否不在允许值数组中。

#### notEquals

```typescript
function notEquals(value: unknown, comparison: unknown): boolean
```

检查值是否不相等。

## 注意事项

1. 类型检查函数返回类型保护，可以在 TypeScript 中使用
2. 数组验证函数对 null 和 undefined 返回 false
3. 字符串验证函数只接受字符串参数
4. 数字验证函数只接受数字参数
5. 日期验证函数只接受 Date 对象参数
6. 对象验证函数对非对象参数返回 false
7. 通用验证函数可以处理任何类型的参数
