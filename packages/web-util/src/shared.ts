/**
 * () => {}
 */
export function noop(..._: any[]): any {}

/**
 * Object.assign
 */
export const extend = Object.assign

/**
 * Object.prototype.hasOwnProperty
 */
export const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * Object.prototype.hasOwnProperty.call
 * @param val
 * @param key
 * @returns
 */
export const hasOwn = (val: object, key: string | symbol): key is keyof typeof val =>
  hasOwnProperty.call(val, key)

/**
 * Object.prototype.toString
 */
export const objectToString = Object.prototype.toString

/**
 * Object.prototype.toString.call
 *
 * Object.prototype.toString.call(new Map()) // "[object Map]"
 */
export const toTypeString = (value: unknown): string => {
  return objectToString.call(value)
}
