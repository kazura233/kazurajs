import { isNotEmpty } from '@kazura/validator'
import dayjs from 'dayjs'

export { dayjs }

export interface Formatter {
  (date?: ConfigType): string | null
}

/**
 * 定义允许的输入类型
 */
export type ConfigType = dayjs.ConfigType

/**
 * 格式化为 YYYY-MM-DD
 */
export const formatDate: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('YYYY-MM-DD') : null
}

/**
 * 格式化为 YYYYMMDD
 */
export const formatDateCompact: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('YYYYMMDD') : null
}

/**
 * 格式化为 HH:mm
 */
export const formatTime: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('HH:mm') : null
}

/**
 * 格式化为 YYYY-MM-DD HH:mm
 */
export const formatDateTime: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('YYYY-MM-DD HH:mm') : null
}

/**
 * 格式化为 YYYY-MM-DD HH:mm:ss
 */
export const formatWithSeconds: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : null
}

/**
 * 格式化为 YYYY-MM-DD HH:mm:ss.SSS
 */
export const formatWithMilliseconds: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('YYYY-MM-DD HH:mm:ss.SSS') : null
}

/**
 * 格式化为 YYYY-MM-DD 00:00:00
 */
export const formatStartOfDay: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).startOf('day').format('YYYY-MM-DD HH:mm:ss') : null
}

/**
 * 格式化为 YYYY-MM-DD 23:59:59
 */
export const formatEndOfDay: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).endOf('day').format('YYYY-MM-DD HH:mm:ss') : null
}

/**
 * 格式化为 YYYY-MM
 */
export const formatYearMonth: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('YYYY-MM') : null
}

/**
 * 格式化为 YYYYMM
 */
export const formatYearMonthCompact: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('YYYYMM') : null
}

/**
 * 格式化为 YYYY
 */
export const formatYear: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('YYYY') : null
}

/**
 * 格式化为 MM-DD
 */
export const formatMonthDay: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('MM-DD') : null
}

/**
 * 格式化为 HH:mm:ss
 */
export const formatTimeWithSeconds: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('HH:mm:ss') : null
}

/**
 * 格式化为 HH:mm:ss.SSS
 */
export const formatTimeWithMilliseconds: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('HH:mm:ss.SSS') : null
}
