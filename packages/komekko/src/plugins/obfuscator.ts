import type { Plugin } from 'rollup'
import { createFilter } from '@rollup/pluginutils'
import type { FilterPattern } from '@rollup/pluginutils'

import type { ObfuscatorOptions } from 'javascript-obfuscator'

import obfuscator from 'javascript-obfuscator'
const { obfuscate } = obfuscator

export type ObfuscatePluginOptions = ObfuscatorOptions & {
  include?: FilterPattern
  exclude?: FilterPattern
}

export function obfuscatePlugin(options: ObfuscatePluginOptions): Plugin {
  const { include = /\.(cjs|mjs|js)$/, exclude = /node_modules/, ...obfuscatorOptions } = options

  const filter = createFilter(include, exclude)

  return {
    name: 'komekko:obfuscator',
    renderChunk(code, { fileName }) {
      if (!filter(fileName)) return null

      const obfuscationResult = obfuscate(code, {
        ...obfuscatorOptions,
        inputFileName: fileName,
        sourceMap: true,
      })

      return {
        code: obfuscationResult.getObfuscatedCode(),
        map: obfuscationResult.getSourceMap(),
      }
    },
  }
}
