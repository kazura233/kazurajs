import { isObject } from './typechecker'

/**
 * 检查值是否为指定对象的实例。
 * @param object
 * @param targetTypeConstructor
 * @returns
 */
export function isInstance(
  object: unknown,
  targetTypeConstructor: new (...args: any[]) => any
): boolean {
  return (
    targetTypeConstructor &&
    typeof targetTypeConstructor === 'function' &&
    object instanceof targetTypeConstructor
  )
}

/**
 * 检查值是否是有效的对象且非空。如果值不是对象或是空的有效对象，则返回false。
 * @param value
 * @param options 如果 options.nullable 被明确设置为 false，则函数会检查对象的每个属性，确保它们不是 null 或 undefined。
 * @returns
 */
export function isNotEmptyObject(value: unknown, options?: { nullable?: boolean }): boolean {
  if (!isObject(value)) {
    return false
  }

  if (options?.nullable === false) {
    return !Object.values(value).every(
      (propertyValue) => propertyValue === null || propertyValue === undefined
    )
  }

  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      return true
    }
  }

  return false
}
