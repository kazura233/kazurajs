import type { PluginContext } from 'rollup'
import { existsSync } from 'node:fs'

import type { Options, ESLint, OutputFixes } from './types'

/**
 * 解析请求 ID，移除查询参数
 * @param id - 请求 ID，可能包含查询参数
 * @returns 清理后的文件路径
 */
export function parseRequest(id: string) {
  return id.split('?', 2)[0]
}

/**
 * 判断文件是否为虚拟模块
 * @param file - 文件路径
 * @returns 如果文件不存在则为虚拟模块
 */
export function isVirtualModule(file: string) {
  return !existsSync(file)
}

/**
 * 从插件选项中提取 ESLint 相关配置
 * 过滤掉插件特有的配置项，只保留 ESLint 原生支持的选项
 * @param options - 完整的插件配置选项
 * @returns 纯 ESLint 配置选项
 */
export function pickESLintOptions(options: Options): ESLint.Options {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    eslintPath,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    lintOnStart,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    include,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exclude,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formatter,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    emitWarning,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    emitError,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    failOnWarning,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    failOnError,
    ...eslintOptions
  } = options

  return eslintOptions
}

/**
 * Promise 错误处理工具函数
 * 将 Promise 的结果包装为 [error, data] 的元组形式
 * @param promise - 要处理的 Promise
 * @returns 包含错误和数据的元组，成功时 [null, data]，失败时 [error, undefined]
 */
export async function to<R, E = Error>(promise: Promise<R>) {
  return promise
    .then<[null, R]>((data) => [null, data])
    .catch<[E, undefined]>((error: E) => [error, undefined])
}

/**
 * 检查模块的 ESLint 规则
 * 执行 ESLint 检查并根据配置输出警告或错误
 * @param ctx - Rollup 插件上下文
 * @param eslint - ESLint 实例
 * @param files - 要检查的文件路径或文件路径数组
 * @param options - 插件配置选项
 * @param formatter - 格式化器函数
 * @param outputFixes - ESLint 自动修复函数
 */
export async function checkModule(
  ctx: PluginContext,
  eslint: ESLint,
  files: string | string[],
  options: Options,
  formatter: ESLint.Formatter['format'],
  outputFixes: OutputFixes
) {
  // 执行 ESLint 检查
  const [error, report] = await to(eslint.lintFiles(files))

  if (error) {
    return Promise.reject(error)
  }

  // 检查是否存在警告或错误
  const hasWarning = report.some((item) => item.warningCount > 0)
  const hasError = report.some((item) => item.errorCount > 0)
  const result = formatter(report)

  // 如果启用了自动修复，执行修复
  if (options.fix && report) {
    const [error] = await to(outputFixes(report))

    if (error) {
      return Promise.reject(error)
    }
  }

  // 输出警告信息
  if (hasWarning && options.emitWarning) {
    const warning = typeof result === 'string' ? result : await result

    if (options.failOnWarning) {
      ctx.error(warning)
    } else {
      ctx.warn(warning)
    }
  }

  // 输出错误信息
  if (hasError && options.emitError) {
    const error = typeof result === 'string' ? result : await result

    if (options.failOnError) {
      ctx.error(error)
    } else {
      console.log(error)
    }
  }

  return Promise.resolve()
}
