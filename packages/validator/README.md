[npm]: https://img.shields.io/npm/v/@kazura/validator
[npm-url]: https://www.npmjs.com/package/@kazura/validator
[size]: https://packagephobia.now.sh/badge?p=@kazura/validator
[size-url]: https://packagephobia.now.sh/result?p=@kazura/validator
[license]: https://img.shields.io/badge/License-MIT-blue
[license-url]: https://github.com/kazura233/kazurajs/blob/master/LICENSE

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![license][license]][license-url]

# @kazura/validator

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

```typescript
function isArray(value: any): boolean
function isBoolean(value: any): boolean
function isDate(value: any): boolean
function isEnum(value: any, enumType: any): boolean
function isInt(value: any): boolean
function isNumber(value: any, options?: { maxDecimalPlaces?: number }): boolean
function isObject(value: any): boolean
function isString(value: any): boolean
function isPromise(value: any): boolean
function isMap(value: any): boolean
function isSet(value: any): boolean
function isRegExp(value: any): boolean
function isFunction(value: any): boolean
function isSymbol(value: any): boolean
```

### 数组验证

```typescript
function arrayContains(array: any[], values: any[]): boolean
function arrayMaxSize(array: any[], max: number): boolean
function arrayMinSize(array: any[], min: number): boolean
function arrayNotContains(array: any[], values: any[]): boolean
function arrayNotEmpty(array: any[]): boolean
function arrayUnique(array: any[], keySelector?: (item: any) => any): boolean
```

### 字符串验证

```typescript
function isJSON(value: string): boolean
function isBase64(value: string): boolean
function isDataURL(value: string): boolean
function isMD5(value: string): boolean
function isLowercase(value: string): boolean
function isUppercase(value: string): boolean
function isHash(value: string, algorithm: string): boolean
function isHexColor(value: string): boolean
function isUUID(value: string): boolean
```

### 数字验证

```typescript
function isNegative(value: number): boolean
function isPositive(value: number): boolean
function max(value: number, max: number): boolean
function min(value: number, min: number): boolean
```

### 日期验证

```typescript
function maxDate(date: Date, maxDate: Date): boolean
function minDate(date: Date, minDate: Date): boolean
```

### 对象验证

```typescript
function isInstance(value: any, targetType: any): boolean
function isNotEmptyObject(value: any, options?: { nullable?: boolean }): boolean
```

### 通用验证

```typescript
function equals(value: any, comparison: any): boolean
function isDefined(value: any): boolean
function isEmpty(value: any): boolean
function isIn(value: any, possibleValues: any[]): boolean
function isNotEmpty(value: any): boolean
function isNotIn(value: any, possibleValues: any[]): boolean
function notEquals(value: any, comparison: any): boolean
```

## 注意事项

1. 所有验证函数都返回布尔值
2. 类型检查函数会严格检查类型
3. 数组验证函数支持自定义比较函数
4. 字符串验证函数支持多种格式
5. 数字验证函数支持小数位数限制
6. 日期验证函数支持时区
7. 对象验证函数支持空值检查
8. 通用验证函数支持多种比较方式

## 示例

### 表单验证

```typescript
import { isString, isEmail, isNotEmpty, arrayNotEmpty, arrayUnique } from '@kazura/validator'

function validateForm(data: any) {
  const errors: string[] = []

  // 验证用户名
  if (!isString(data.username) || !isNotEmpty(data.username)) {
    errors.push('用户名不能为空')
  }

  // 验证邮箱
  if (!isEmail(data.email)) {
    errors.push('邮箱格式不正确')
  }

  // 验证标签
  if (!arrayNotEmpty(data.tags)) {
    errors.push('至少选择一个标签')
  }

  // 验证标签唯一性
  if (!arrayUnique(data.tags)) {
    errors.push('标签不能重复')
  }

  return errors
}
```

### 数据转换验证

```typescript
import { isJSON, isBase64, isDataURL, isUUID } from '@kazura/validator'

function validateData(data: any) {
  // 验证 JSON 字符串
  if (!isJSON(data.jsonString)) {
    throw new Error('Invalid JSON string')
  }

  // 验证 Base64 字符串
  if (!isBase64(data.base64String)) {
    throw new Error('Invalid Base64 string')
  }

  // 验证 DataURL
  if (!isDataURL(data.dataUrl)) {
    throw new Error('Invalid DataURL')
  }

  // 验证 UUID
  if (!isUUID(data.uuid)) {
    throw new Error('Invalid UUID')
  }
}
```

### 类型检查

```typescript
import { isArray, isObject, isString, isNumber, isBoolean, isDate } from '@kazura/validator'

function validateType(value: any, type: string) {
  switch (type) {
    case 'array':
      return isArray(value)
    case 'object':
      return isObject(value)
    case 'string':
      return isString(value)
    case 'number':
      return isNumber(value)
    case 'boolean':
      return isBoolean(value)
    case 'date':
      return isDate(value)
    default:
      return false
  }
}
```

## 文档

更多详细信息请查看 [文档](https://kazura233.github.io/kazurajs/docs/validator)。

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
