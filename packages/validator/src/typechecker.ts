/**
 * 检查给定的值是否是数组。
 * @param value
 * @returns
 */
export function isArray<T = any>(value: unknown): value is Array<T> {
  return Array.isArray(value)
}

/**
 * 检查给定的值是否为布尔值。
 * @param value
 * @returns
 */
export function isBoolean(value: unknown): value is boolean {
  return value instanceof Boolean || typeof value === 'boolean'
}

/**
 * 检查给定的值是否为日期。
 * @param value
 * @returns
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime())
}

/**
 * 检查给定的值是否是所提供枚举的成员。
 * @param value
 * @param entity
 * @returns
 */
export function isEnum(value: unknown, entity: any): boolean {
  const enumValues = Object.keys(entity).map((k) => entity[k])
  return enumValues.includes(value)
}

/**
 * 检查值是否为整数。
 * @param val
 * @returns
 */
export function isInt(val: unknown): val is Number {
  return typeof val === 'number' && Number.isInteger(val)
}

export interface IsNumberOptions {
  /**
   * 一个可选的布尔值参数。如果设置为 true，则允许值为 NaN 时通过检查。默认为 false。
   */
  allowNaN?: boolean
  /**
   * 一个可选的布尔值参数。如果设置为 true，则允许值为正无穷大或负无穷大时通过检查。默认为 false。
   */
  allowInfinity?: boolean
  /**
   * 一个可选的数字参数。如果设置，表示允许的最大小数位数。如果给定数字的小数位数超过这个值，检查将失败。默认为未定义，表示不限制小数位数。
   */
  maxDecimalPlaces?: number
}

/**
 * 检查给定的值是否是一个数字。
 * @param value
 * @param options
 * @returns
 */
export function isNumber(value: unknown, options: IsNumberOptions = {}): value is number {
  // 检查值是否是 JavaScript 的 number 类型
  if (typeof value !== 'number') {
    return false
  }

  // 检查是否允许正无穷大或负无穷大
  if (value === Infinity || value === -Infinity) {
    return !!options.allowInfinity
  }
  // 检查是否允许值为 NaN
  if (Number.isNaN(value)) {
    return !!options.allowNaN
  }

  // 检查小数位数是否超过指定的最大值
  if (options.maxDecimalPlaces !== undefined) {
    let decimalPlaces = 0
    if (value % 1 !== 0) {
      decimalPlaces = value.toString().split('.')[1].length
    }
    if (decimalPlaces > options.maxDecimalPlaces) {
      return false
    }
  }

  // 最后检查是否是有限的数字
  return Number.isFinite(value)
}

/**
 * 检查值是否为有效的对象。
 * 如果值不是对象，则返回false。
 * @param value
 * @returns
 */
export function isObject<T = object>(value: unknown): value is T {
  return (
    value != null &&
    (typeof value === 'object' || typeof value === 'function') &&
    !Array.isArray(value)
  )
}

/**
 * 检查给定的值是否为真实字符串。
 * @param value
 * @returns
 */
export function isString(value: unknown): value is string {
  return value instanceof String || typeof value === 'string'
}
