import dayjs from 'dayjs'

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
export type ConfigType = dayjs.ConfigType

/**
 * 格式化为 YYYY-MM-DD HH:mm:ss.SSS 格式
 */
export const formatWithMilliseconds = (date?: ConfigType): string => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss.SSS')
}

/**
 * 格式化为 YYYY-MM-DD HH:mm:ss 格式
 */
export const formatWithSeconds = (date?: ConfigType): string => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化为 YYYY-MM-DD 格式
 */
export const formatDate = (date?: ConfigType): string => {
  return dayjs(date).format('YYYY-MM-DD')
}

/**
 * 格式化为 YYYY-MM-DD 00:00:00
 */
export const formatStartOfDay = (date?: ConfigType): string => {
  return dayjs(date).startOf('day').format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化为 YYYY-MM-DD 23:59:59
 */
export const formatEndOfDay = (date?: ConfigType): string => {
  return dayjs(date).endOf('day').format('YYYY-MM-DD HH:mm:ss')
}
