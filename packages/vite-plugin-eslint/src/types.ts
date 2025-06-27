import { ESLint } from 'eslint'

export { ESLint }
export type OutputFixes = typeof ESLint.outputFixes

/**
 * 插件配置选项，继承自 ESLint 选项
 * 扩展了 Vite 插件特有的配置项
 */
export interface Options extends ESLint.Options {
  /** ESLint 实例的路径，用于代码检查 */
  eslintPath?: string
  /** 是否在项目启动时检查所有匹配的文件 */
  lintOnStart?: boolean
  /** 单个文件或文件数组，指定需要检查的文件 */
  include?: string | string[]
  /** 单个文件或文件数组，指定需要排除的文件 */
  exclude?: string | string[]
  /** 自定义错误格式化器或内置格式化器的名称 */
  formatter?: string | ESLint.Formatter['format']
  /** 是否输出发现的警告信息 */
  emitWarning?: boolean
  /** 是否输出发现的错误信息 */
  emitError?: boolean
  /** 如果存在警告是否导致模块构建失败，基于 emitWarning 设置 */
  failOnWarning?: boolean
  /** 如果存在错误是否导致模块构建失败，基于 emitError 设置 */
  failOnError?: boolean
}
