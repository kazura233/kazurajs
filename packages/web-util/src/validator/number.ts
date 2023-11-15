/**
 * 检查值是否为小于零的负数。
 * @param value
 * @returns
 */
export function isNegative(value: unknown): boolean {
  return typeof value === 'number' && value < 0
}

/**
 * 检查值是否为大于零的正数。
 * @param value
 * @returns
 */
export function isPositive(value: unknown): boolean {
  return typeof value === 'number' && value > 0
}

/**
 * 检查第一个数字是否小于或等于第二个数字。
 * @param num
 * @param max
 * @returns
 */
export function max(num: unknown, max: number): boolean {
  return typeof num === 'number' && typeof max === 'number' && num <= max
}

/**
 * 检查第一个数字是否大于或等于第二个数字。
 * @param num
 * @param min
 * @returns
 */
export function min(num: unknown, min: number): boolean {
  return typeof num === 'number' && typeof min === 'number' && num >= min
}
