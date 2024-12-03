import type { Plugin } from 'vite'
import { VIRTUAL_MODULE_ID, MODULE_IDS, PLUGIN_NAME } from './constants'
import { ReactPagesContext } from './context'
import { Options } from './types'

export default function ReactPagesPlugin(options: Options = {}): Plugin {
  let ctx: ReactPagesContext
  return {
    name: PLUGIN_NAME,
    enforce: 'pre',
    async configResolved(config) {
      ctx = new ReactPagesContext(options, config.root)
      await ctx.searchGlob()
    },
    configureServer(server) {
      ctx.setupViteServer(server)
    },
    resolveId(id) {
      if (MODULE_IDS.includes(id)) return VIRTUAL_MODULE_ID
      return null
    },
    async load(id) {
      if (id === VIRTUAL_MODULE_ID) return ctx.resolveRoutes()
      return null
    },
  }
}
