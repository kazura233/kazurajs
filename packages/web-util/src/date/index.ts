import dayjs from 'dayjs'

export { dayjs }

/**
 * 定义允许的输入类型
 */
export type ConfigType = dayjs.ConfigType

/**
 * 格式化为 YYYY-MM-DD
 */
export const formatDate = (date?: ConfigType): string => {
  return dayjs(date).format('YYYY-MM-DD')
}

/**
 * 格式化为 YYYYMMDD
 */
export const formatDateCompact = (date?: ConfigType): string => {
  return dayjs(date).format('YYYYMMDD')
}

/**
 * 格式化为 HH:mm
 */
export const formatTime = (date?: ConfigType): string => {
  return dayjs(date).format('HH:mm')
}

/**
 * 格式化为 YYYY-MM-DD HH:mm
 */
export const formatDateTime = (date?: ConfigType): string => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

/**
 * 格式化为 YYYY-MM-DD HH:mm:ss
 */
export const formatWithSeconds = (date?: ConfigType): string => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化为 YYYY-MM-DD HH:mm:ss.SSS
 */
export const formatWithMilliseconds = (date?: ConfigType): string => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss.SSS')
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

/**
 * 格式化为 YYYY-MM
 */
export const formatYearMonth = (date?: ConfigType): string => {
  return dayjs(date).format('YYYY-MM')
}

/**
 * 格式化为 YYYYMM
 */
export const formatYearMonthCompact = (date?: ConfigType): string => {
  return dayjs(date).format('YYYYMM')
}

/**
 * 格式化为 YYYY
 */
export const formatYear = (date?: ConfigType): string => {
  return dayjs(date).format('YYYY')
}

/**
 * 格式化为 MM-DD
 */
export const formatMonthDay = (date?: ConfigType): string => {
  return dayjs(date).format('MM-DD')
}

/**
 * 格式化为 HH:mm:ss
 */
export const formatTimeWithSeconds = (date?: ConfigType): string => {
  return dayjs(date).format('HH:mm:ss')
}

/**
 * 格式化为 HH:mm:ss.SSS
 */
export const formatTimeWithMilliseconds = (date?: ConfigType): string => {
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
