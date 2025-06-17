import type { ConfigType as DayjsConfigType } from 'dayjs'

export interface Formatter {
  (date?: ConfigType): string
}

/**
 * 定义允许的输入类型
 */
export type ConfigType = DayjsConfigType
