import { ModuleNode, ViteDevServer } from 'vite'
import { Options, ResolvedOptions } from './types'
import { slash } from '@antfu/utils'
import { __debug_info, __debug_param } from './utils'
import { VIRTUAL_MODULE_ID } from './constants'

export class ReactPagesContext {
  private server: ViteDevServer | undefined

  private options: ResolvedOptions

  constructor(options: Options, root: string = process.cwd()) {
    __debug_param('constructor->options', options)
    __debug_param('constructor->root', root)

    this.options = this.resolveOptions(options, root)
  }

  resolveOptions(options: Options, root: string): ResolvedOptions {
    const { caseSensitive = false } = options

    const resolvedOptions: ResolvedOptions = {
      root: slash(root),
      caseSensitive,
    }

    __debug_param('resolveOptions->resolvedOptions', resolvedOptions)

    return resolvedOptions
  }

  setupViteServer(server: ViteDevServer) {
    if (this.server === server) return
    this.server = server
    this.setupWatcher(server.watcher)
  }

  setupWatcher(watcher: ViteDevServer['watcher']) {
    watcher.on('unlink', async (path) => {
      path = slash(path)
      // TODO: remove page
      this.onUpdate()
    })
    watcher.on('add', async (path) => {
      path = slash(path)
      // TODO: add page
      this.onUpdate()
    })
  }

  onUpdate() {
    if (!this.server) return

    const { moduleGraph } = this.server
    const mods = moduleGraph.getModulesByFile(VIRTUAL_MODULE_ID)
    if (mods) {
      const seen = new Set<ModuleNode>()
      mods.forEach((mod) => {
        moduleGraph.invalidateModule(mod, seen)
      })
    }

    __debug_info('Reload generated pages.')

    this.server.ws.send({
      type: 'full-reload',
    })
  }

  async resolveRoutes() {
    return {
      code: 'export default {};',
      map: null,
    }
  }

  async searchGlob() {}
}
