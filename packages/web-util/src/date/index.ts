import { isNotEmpty } from '@kazura/validator'
import dayjs from 'dayjs'
import type { Formatter } from './types'

export { dayjs }
export * from './types'
export * from './utc'

/**
 * 格式化为 YYYYMMDD
 */
export const formatDateCompact: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('YYYYMMDD') : ''
}

/**
 * 格式化为 HH:mm
 */
export const formatTime: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('HH:mm') : ''
}

/**
 * 格式化为 YYYYMM
 */
export const formatYearMonthCompact: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('YYYYMM') : ''
}

/**
 * 格式化为 YYYY
 */
export const formatYear: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('YYYY') : ''
}

/**
 * 格式化为 HH:mm:ss
 */
export const formatTimeWithSeconds: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('HH:mm:ss') : ''
}

/**
 * 格式化为 HH:mm:ss.SSS
 */
export const formatTimeWithMilliseconds: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('HH:mm:ss.SSS') : ''
}
