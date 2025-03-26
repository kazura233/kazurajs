import dayjs, { Dayjs } from 'dayjs'

export { dayjs }

/**
 * 格式化日期字符串
 * @deprecated 此函数已不建议使用，请改用 `formatWithSeconds` 格式化函数。
 * @param t - 日期字符串 (默认当前时间)
 * @returns 格式化后的日期字符串 ('YYYY-MM-DD HH:mm:ss')
 */
export const formatDateStr = (t?: string): string => {
  return dayjs(t).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化日期字符串
 * @deprecated 此函数已不建议使用，请改用 `formatWithMilliseconds` 格式化函数。
 * @param t - 日期字符串 (默认当前时间)
 * @returns 格式化后的日期字符串 ('YYYY-MM-DD HH:mm:ss.SSS')
 */
export const formatDateStrSSS = (t?: string): string => {
  return dayjs(t).format('YYYY-MM-DD HH:mm:ss.SSS')
}

/**
 * 定义允许的输入类型
 */
export type InputType = string | number | Dayjs

/**
 * 格式化为 YYYY-MM-DD HH:mm:ss.SSS 格式
 */
export const formatWithMilliseconds = (input: InputType): string => {
  return dayjs(input).format('YYYY-MM-DD HH:mm:ss.SSS')
}

/**
 * 格式化为 YYYY-MM-DD HH:mm:ss 格式
 */
export const formatWithSeconds = (input: InputType): string => {
  return dayjs(input).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化为 YYYY-MM-DD 格式
 */
export const formatDate = (input: InputType): string => {
  return dayjs(input).format('YYYY-MM-DD')
}

/**
 * 格式化为 YYYY-MM-DD 00:00:00
 */
export const formatStartOfDay = (input: InputType): string => {
  return dayjs(input).startOf('day').format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化为 YYYY-MM-DD 23:59:59
 */
export const formatEndOfDay = (input: InputType): string => {
  return dayjs(input).endOf('day').format('YYYY-MM-DD HH:mm:ss')
}
