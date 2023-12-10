import type { Plugin } from 'rollup'

export function esbuildPlugin(config: any): Plugin {
  return {
    name: 'komekko:esbuild',
  }
}
