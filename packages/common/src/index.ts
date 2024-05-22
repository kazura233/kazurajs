/**
 * 一个什么也不做的函数。
 */
export function noop(..._: any[]): any {}

/**
 * 对象的合并函数 Object.assign 的引用。
 */
export const extend = Object.assign

/**
 * Object.prototype 上的 hasOwnProperty 方法的引用。
 */
export const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * 检查对象是否直接拥有指定属性。
 * @param val 要检查的对象。
 * @param key 要检查的属性键。
 * @returns 如果对象直接拥有该属性，则返回 true，否则返回 false。
 */
export const hasOwn = (val: object, key: string | symbol): key is keyof typeof val =>
  hasOwnProperty.call(val, key)

/**
 * Object.prototype 上的 toString 方法的引用。
 */
export const objectToString = Object.prototype.toString

/**
 * 获取一个对象的类型字符串。
 * @param value 要获取类型字符串的对象。
 * @returns 对象的类型字符串。
 * @example
 * toTypeString(new Map()) // "[object Map]"
 */
export const toTypeString = (value: unknown): string => {
  return objectToString.call(value)
}

/**
 * 获取一个对象的原始类型。
 * @param value 要获取原始类型的对象。
 * @returns 对象的原始类型。
 * @example
 * toRawType(new Map()) // "Map"
 */
export const toRawType = (value: unknown): string => {
  return toTypeString(value).slice(8, -1)
}
