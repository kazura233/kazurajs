/**
 * 检查值是否与比较相匹配（"==="）。
 * @param value
 * @param comparison
 * @returns
 */
export function equals(value: unknown, comparison: unknown): boolean {
  return value === comparison
}

/**
 * 检查值是否已定义（! == undefined，! == null）。
 * @param value
 * @returns
 */
export function isDefined(value: any): boolean {
  return value !== undefined && value !== null
}

/**
 * 检查给定的值是否为空（=== ''，=== null，=== undefined）。
 * @param value
 * @returns
 */
export function isEmpty(value: unknown): boolean {
  return value === '' || value === null || value === undefined
}

/**
 * 检查给定的值是否在允许值的数组中。
 * @param value
 * @param possibleValues
 * @returns
 */
export function isIn(value: unknown, possibleValues: readonly unknown[]): boolean {
  return (
    Array.isArray(possibleValues) && possibleValues.some((possibleValue) => possibleValue === value)
  )
}

/**
 * 检查给定的值是否不为空（!== ''，!== null，!== undefined）。
 * @param value
 * @returns
 */
export function isNotEmpty(value: unknown): boolean {
  return value !== '' && value !== null && value !== undefined
}

/**
 * 检查给定的值是否不在允许值的数组中。
 * @param value
 * @param possibleValues
 * @returns
 */
export function isNotIn(value: unknown, possibleValues: readonly unknown[]): boolean {
  return (
    !Array.isArray(possibleValues) ||
    !possibleValues.some((possibleValue) => possibleValue === value)
  )
}

/**
 * 检查值是否不与比较相匹配（"!=="）。
 * @param value
 * @param comparison
 * @returns
 */
export function notEquals(value: unknown, comparison: unknown): boolean {
  return value !== comparison
}
