/**
 * 检查值是否为早于指定日期的日期。
 * @param date
 * @param maxDate
 * @returns
 */
export function maxDate(date: unknown, maxDate: Date | (() => Date)): boolean {
  return (
    date instanceof Date &&
    date.getTime() <= (maxDate instanceof Date ? maxDate : maxDate()).getTime()
  )
}

/**
 * 检查值是否为晚于指定日期的日期。
 * @param date
 * @param minDate
 * @returns
 */
export function minDate(date: unknown, minDate: Date | (() => Date)): boolean {
  return (
    date instanceof Date &&
    date.getTime() >= (minDate instanceof Date ? minDate : minDate()).getTime()
  )
}
