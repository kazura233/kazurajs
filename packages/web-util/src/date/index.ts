import dayjs from 'dayjs'

export { dayjs }

export interface Formatter {
  (date?: ConfigType): string
}

/**
 * 定义允许的输入类型
 */
export type ConfigType = dayjs.ConfigType

/**
 * 格式化为 YYYY-MM-DD
 */
export const formatDate: Formatter = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

/**
 * 格式化为 YYYYMMDD
 */
export const formatDateCompact: Formatter = (date) => {
  return dayjs(date).format('YYYYMMDD')
}

/**
 * 格式化为 HH:mm
 */
export const formatTime: Formatter = (date) => {
  return dayjs(date).format('HH:mm')
}

/**
 * 格式化为 YYYY-MM-DD HH:mm
 */
export const formatDateTime: Formatter = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

/**
 * 格式化为 YYYY-MM-DD HH:mm:ss
 */
export const formatWithSeconds: Formatter = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化为 YYYY-MM-DD HH:mm:ss.SSS
 */
export const formatWithMilliseconds: Formatter = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss.SSS')
}

/**
 * 格式化为 YYYY-MM-DD 00:00:00
 */
export const formatStartOfDay: Formatter = (date) => {
  return dayjs(date).startOf('day').format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化为 YYYY-MM-DD 23:59:59
 */
export const formatEndOfDay: Formatter = (date) => {
  return dayjs(date).endOf('day').format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化为 YYYY-MM
 */
export const formatYearMonth: Formatter = (date) => {
  return dayjs(date).format('YYYY-MM')
}

/**
 * 格式化为 YYYYMM
 */
export const formatYearMonthCompact: Formatter = (date) => {
  return dayjs(date).format('YYYYMM')
}

/**
 * 格式化为 YYYY
 */
export const formatYear: Formatter = (date) => {
  return dayjs(date).format('YYYY')
}

/**
 * 格式化为 MM-DD
 */
export const formatMonthDay: Formatter = (date) => {
  return dayjs(date).format('MM-DD')
}

/**
 * 格式化为 HH:mm:ss
 */
export const formatTimeWithSeconds: Formatter = (date) => {
  return dayjs(date).format('HH:mm:ss')
}

/**
 * 格式化为 HH:mm:ss.SSS
 */
export const formatTimeWithMilliseconds: Formatter = (date) => {
  return dayjs(date).format('HH:mm:ss.SSS')
}

/**
 * 获取当前时间戳（秒）
 */
export const getTimestampInSeconds = (date?: ConfigType): number => {
  return dayjs(date).unix()
}

/**
 * 获取当前时间戳（毫秒）
 */
export const getTimestampInMilliseconds = (date?: ConfigType): number => {
  return dayjs(date).valueOf()
}
