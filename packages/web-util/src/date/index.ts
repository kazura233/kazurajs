import dayjs from 'dayjs'

/**
 * 格式化日期字符串
 * @param t - 日期字符串 (默认当前时间)
 * @returns 格式化后的日期字符串 ('YYYY-MM-DD HH:mm:ss')
 */
export const formatDateStr = (t?: string): string => {
  return dayjs(t).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化日期字符串
 * @param t - 日期字符串 (默认当前时间)
 * @returns 格式化后的日期字符串 ('YYYY-MM-DD HH:mm:ss.SSS')
 */
export const formatDateStrSSS = (t?: string): string => {
  return dayjs(t).format('YYYY-MM-DD HH:mm:ss.SSS')
}
