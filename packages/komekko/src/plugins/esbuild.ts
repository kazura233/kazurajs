import type { Plugin, PluginContext } from 'rollup'
import type { FilterPattern } from '@rollup/pluginutils'
import type { Loader, TransformResult, CommonOptions } from 'esbuild'
import { transform } from 'esbuild'
import { extname, relative } from 'pathe'
import { createFilter } from '@rollup/pluginutils'

const DefaultLoaders: { [ext: string]: Loader } = {
  '.js': 'js',
  '.mjs': 'js',
  '.cjs': 'js',

  '.ts': 'ts',
  '.mts': 'ts',
  '.cts': 'ts',

  '.tsx': 'tsx',
  '.jsx': 'jsx',
}

function printWarnings(id: string, result: TransformResult, plugin: PluginContext): void {
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

  loaders?: {
    [ext: string]: Loader | false
  }
}

export function esbuildPlugin(options: EsbuildOptions): Plugin {
  const {
    include = new RegExp(Object.keys(DefaultLoaders).join('|')),
    exclude = /node_modules/,
    loaders: loaderOptions,
    ...esbuildOptions
  } = options

  const loaders = { ...DefaultLoaders }
  if (loaderOptions) {
    for (const [key, value] of Object.entries(loaderOptions)) {
      if (typeof value === 'string') {
        loaders[key] = value
      } else if (value === false) {
        delete loaders[key]
      }
    }
  }
  const getLoader = (id = ''): Loader | undefined => {
    return loaders[extname(id)]
  }

  const filter = createFilter(include, exclude)

  return {
    name: 'komekko:esbuild',

    async transform(code, id): Promise<null | { code: string; map: any }> {
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

      return {
        code: result.code || '',
        map: result.map || null,
      }
    },

    async renderChunk(code, { fileName }): Promise<null | undefined | { code: string; map: any }> {
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

      return {
        code: result.code || '',
        map: result.map || null,
      }
    },
  }
}
