import { extname, relative } from 'pathe'
import type { Plugin, PluginContext } from 'rollup'
import { Loader, TransformResult, CommonOptions, transform } from 'esbuild'
import { createFilter } from '@rollup/pluginutils'
import type { FilterPattern } from '@rollup/pluginutils'

const loaders: { [ext: string]: Loader } = {
  '.js': 'js',
  '.mjs': 'js',
  '.cjs': 'js',

  '.ts': 'ts',
  '.mts': 'ts',
  '.cts': 'ts',

  '.tsx': 'tsx',
  '.jsx': 'jsx',
}

const getLoader = (id = '') => {
  return loaders[extname(id)]
}

const printWarnings = (id: string, result: TransformResult, plugin: PluginContext) => {
  if (result.warnings) {
    for (const warning of result.warnings) {
      let message = '[esbuild]'
      if (warning.location) {
        message += ` (${relative(process.cwd(), id)}:${warning.location.line}:${
          warning.location.column
        })`
      }
      message += ` ${warning.text}`
      plugin.warn(message)
    }
  }
}

export type EsbuildOptions = CommonOptions & {
  include?: FilterPattern
  exclude?: FilterPattern
}

export function esbuildPlugin(options: EsbuildOptions): Plugin {
  const { include = /\.(ts|js|tsx|jsx)$/, exclude = /node_modules/, ...esbuildOptions } = options

  const filter = createFilter(include, exclude)

  return {
    name: 'komekko:esbuild',
    async transform(code, id) {
      if (!filter(id)) {
        return null
      }

      const loader = getLoader(id)
      if (!loader) {
        return null
      }

      const result = await transform(code, {
        ...esbuildOptions,
        loader,
        sourcefile: id,
      })

      printWarnings(id, result, this)

      return (
        result.code && {
          code: result.code,
          map: result.map || null,
        }
      )
    },

    async renderChunk(code, { fileName }) {
      if (!options.minify) {
        return null
      }

      if (/\.d\.(c|m)?tsx?$/.test(fileName)) {
        return null
      }

      const loader = getLoader(fileName)
      if (!loader) {
        return null
      }

      const result = await transform(code, {
        ...esbuildOptions,
        loader,
        sourcefile: fileName,
        minify: true,
      })

      if (result.code) {
        return {
          code: result.code,
          map: result.map || null,
        }
      }
    },
  }
}
