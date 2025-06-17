import { isNotEmpty } from '@kazura/validator'
import dayjs from 'dayjs'
import type { Formatter } from './types'

/**
 * 格式化为 YYYY/MM/DD
 */
export const formatDate: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('YYYY/MM/DD') : ''
}

/**
 * 格式化为 YYYY/MM/DD HH:mm
 */
export const formatDateTime: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('YYYY/MM/DD HH:mm') : ''
}

/**
 * 格式化为 YYYY/MM/DD HH:mm:ss
 */
export const formatWithSeconds: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('YYYY/MM/DD HH:mm:ss') : ''
}

/**
 * 格式化为 YYYY/MM/DD HH:mm:ss.SSS
 */
export const formatWithMilliseconds: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('YYYY/MM/DD HH:mm:ss.SSS') : ''
}

/**
 * 格式化为 YYYY/MM/DD 00:00:00
 */
export const formatStartOfDay: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).startOf('day').format('YYYY/MM/DD HH:mm:ss') : ''
}

/**
 * 格式化为 YYYY/MM/DD 23:59:59
 */
export const formatEndOfDay: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).endOf('day').format('YYYY/MM/DD HH:mm:ss') : ''
}

/**
 * 格式化为 YYYY/MM
 */
export const formatYearMonth: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('YYYY/MM') : ''
}

/**
 * 格式化为 MM/DD
 */
export const formatMonthDay: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('MM/DD') : ''
}

/**
 * 格式化为 MM/DD HH:mm
 */
export const formatMonthDayTime: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('MM/DD HH:mm') : ''
}

/**
 * 格式化为 MM/DD HH:mm:ss
 */
export const formatMonthDayTimeWithSeconds: Formatter = (date) => {
  return isNotEmpty(date) ? dayjs(date).format('MM/DD HH:mm:ss') : ''
}
