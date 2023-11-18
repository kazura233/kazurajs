import dayjs from 'dayjs'

/**
 * 格式化日期字符串
 * @param t - 日期字符串
 * @returns 格式化后的日期字符串 ('YYYY-MM-DD HH:mm:ss')
 */
export const formatDateStr = (t: string): string => {
  // 使用 dayjs 解析日期字符串，然后格式化成指定格式
  return dayjs(t).format('YYYY-MM-DD HH:mm:ss')
}
