/**
 * 检查数组是否包含给定数值数组中的所有值。如果输入为null或undefined，则该函数返回false。
 * @param array
 * @param values
 * @returns
 */
export function arrayContains(array: unknown, values: any[]): boolean {
  if (!Array.isArray(array)) return false

  return values.every((value) => array.indexOf(value) !== -1)
}

/**
 * 检查数组的长度是否小于或等于指定的数字。如果输入为null或undefined，则该函数返回false。
 * @param array
 * @param max
 * @returns
 */
export function arrayMaxSize(array: unknown, max: number): boolean {
  return Array.isArray(array) && array.length <= max
}

/**
 * 检查数组的长度是否大于或等于指定的数字。如果输入为null或undefined，则该函数返回false。
 * @param array
 * @param min
 * @returns
 */
export function arrayMinSize(array: unknown, min: number): boolean {
  return Array.isArray(array) && array.length >= min
}

/**
 * 检查数组是否不包含给定的任何值。如果输入为null或undefined，则该函数返回false。
 * @param array
 * @param values
 * @returns
 */
export function arrayNotContains(array: unknown, values: any[]): boolean {
  if (!Array.isArray(array)) return false

  return values.every((value) => array.indexOf(value) === -1)
}

/**
 * 检查给定的数组是否不为空。如果输入为null或undefined，则该函数返回false。
 * @param array
 * @returns
 */
export function arrayNotEmpty(array: unknown): boolean {
  return Array.isArray(array) && array.length > 0
}

export type ArrayUniqueIdentifier<T = any> = (o: T) => any

/**
 * 检查数组的所有值是否都是唯一的。对于对象的比较是基于引用的。如果输入为null或undefined，则该函数返回false。
 * @param array
 * @param identifier 一个自定义的标识函数，以便在比较数组元素的唯一性时进行定制。
 *   默认情况下，对象的比较是基于引用的，而不是内容。
 *   通过使用 identifier 函数，可以根据元素的特定属性或条件生成用于比较的标识。
 * @returns
 */
export function arrayUnique(array: unknown[], identifier?: ArrayUniqueIdentifier): boolean {
  if (!Array.isArray(array)) return false

  if (identifier) {
    array = array.map((o) => (o != null ? identifier(o) : o))
  }

  const uniqueItems = array.filter((a, b, c) => c.indexOf(a) === b)
  return array.length === uniqueItems.length
}
