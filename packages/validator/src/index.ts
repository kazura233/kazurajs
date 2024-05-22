import { toTypeString } from '@kazura/common'

export * from './array'
export * from './common'
export * from './date'
export * from './number'
export * from './object'
export * from './string'
export * from './typechecker'
export * from './typed-is-promise'

/**
 * 判断一个值是否为Map类型
 */
export const isMap = <K = any, V = any>(val: unknown): val is Map<K, V> =>
  val instanceof Map && toTypeString(val) === '[object Map]'

/**
 * 判断一个值是否为Set类型
 */
export const isSet = <T = any>(val: unknown): val is Set<T> =>
  val instanceof Set && toTypeString(val) === '[object Set]'

/**
 * 判断一个值是否为RegExp类型
 */
export const isRegExp = (val: unknown): val is RegExp =>
  val instanceof RegExp && toTypeString(val) === '[object RegExp]'

/**
 * 判断一个值是否为函数类型
 */
export const isFunction = (val: unknown): val is Function => typeof val === 'function'

/**
 * 判断一个值是否为Symbol类型
 */
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
