import type { Plugin } from 'vite'
import { resolve } from 'node:path'
import { createFilter } from '@rollup/pluginutils'

import type { Options, OutputFixes, ESLint } from './types'
import { name } from '../package.json'
import { checkModule, isVirtualModule, parseRequest, pickESLintOptions, to } from './utils'

export { Options }

/**
 * Vite ESLint 插件主函数
 * 用于在 Vite 构建过程中集成 ESLint 代码检查
 * @param rawOptions - 插件配置选项
 * @returns Vite 插件实例
 */
export default function eslintPlugin(rawOptions: Options = {}): Plugin {
  // ESLint 实例
  let eslint: ESLint
  // 文件过滤器，用于确定哪些文件需要检查
  let filter: ReturnType<typeof createFilter>
  // 格式化器，用于格式化 ESLint 输出结果
  let formatter: ESLint.Formatter['format']
  // 合并后的配置选项
  let options: Options
  // ESLint 自动修复函数
  let outputFixes: OutputFixes
  // 如果启用缓存，将保存所有文件路径
  const fileCache = new Set<string>()

  return {
    name,
    /**
     * 配置解析完成后的回调
     * 在这里合并默认配置和用户配置
     */
    async configResolved(config) {
      options = Object.assign<Options, Options>(
        {
          // 是否在启动时检查所有文件
          lintOnStart: false,
          // 包含的文件类型
          include: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.vue', '**/*.svelte'],
          // 排除的文件
          exclude: ['**/node_modules/**'],
          // 使用 vite 的 cacheDir 作为默认缓存位置
          cacheLocation: resolve(config.cacheDir, '.eslintcache'),
          // 默认格式化器
          formatter: 'stylish',
          // 是否输出警告
          emitWarning: true,
          // 是否输出错误
          emitError: true,
          // 警告时是否失败
          failOnWarning: false,
          // 错误时是否失败
          failOnError: true,
          // 未匹配模式时是否报错
          errorOnUnmatchedPattern: false,
        },
        rawOptions
      )
    },
    /**
     * 构建开始时的回调
     * 初始化 ESLint 实例和相关配置
     */
    async buildStart() {
      // 动态导入 ESLint 模块
      const [error, module] = await to(import(options.eslintPath ?? 'eslint'))

      if (error) {
        this.error('Failed to import ESLint, do you install or configure eslintPath?')
      } else {
        // 提取 ESLint 相关配置选项
        const eslintOptions = pickESLintOptions(options)

        // 创建 ESLint 实例
        eslint = new module.ESLint(eslintOptions)
        outputFixes = module.ESLint.outputFixes
        // 创建文件过滤器
        filter = createFilter(options.include, options.exclude)

        // 设置格式化器
        switch (typeof options.formatter) {
          case 'string':
            // 如果是字符串，加载内置格式化器
            formatter = (await eslint.loadFormatter(options.formatter)).format
            break
          case 'function':
            // 如果是函数，直接使用
            formatter = options.formatter
          default:
            break
        }

        // 如果启用了启动时检查，检查所有匹配的文件
        if (options.lintOnStart && options.include) {
          this.warn('LintOnStart is turned on, and it will check for all matching files.')

          const [error] = await to(
            checkModule(this, eslint, options.include, options, formatter, outputFixes)
          )

          if (error) {
            this.error(error.message)
          }
        }
      }
    },
    /**
     * 文件转换时的回调
     * 对每个文件进行 ESLint 检查
     */
    async transform(_, id) {
      // 解析文件路径，移除查询参数
      const filePath = parseRequest(id)
      // 判断是否为虚拟模块
      const isVirtual = isVirtualModule(filePath)

      // 如果是虚拟模块且在缓存中，从缓存中删除
      if (isVirtual && fileCache.has(filePath)) {
        fileCache.delete(filePath)
      }

      // 如果文件不匹配过滤器、被 ESLint 忽略或是虚拟模块，跳过检查
      if (!filter(filePath) || (await eslint.isPathIgnored(filePath)) || isVirtual) {
        return null
      }

      // 如果启用缓存，将文件路径添加到缓存
      if (options.cache) {
        fileCache.add(filePath)
      }

      // 执行 ESLint 检查
      const [error] = await to(
        checkModule(
          this,
          eslint,
          options.cache ? Array.from(fileCache) : filePath,
          options,
          formatter,
          outputFixes
        )
      )

      if (error) {
        this.error(error.message)
      }

      return null
    },
  }
}
