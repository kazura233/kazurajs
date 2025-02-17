import { ModuleNode, ViteDevServer } from 'vite'
import { Options, ResolvedOptions } from './types'
import { slash, toArray } from '@antfu/utils'
import { __debug_info, __debug_param } from './utils'
import { VIRTUAL_MODULE_ID } from './constants'
import { join, resolve } from 'node:path'
import FastGlob from 'fast-glob'

export interface PageRoute {
  /**
   * 文件路径
   */
  filePath: string

  /**
   * 原始路由
   */
  rawRoute: string

  /**
   * 是否为同步加载
   */
  sync: boolean
}

export class ReactPagesContext {
  private server: ViteDevServer | undefined

  private routeMap = new Map<string, PageRoute>()

  private options: ResolvedOptions

  constructor(options: Options, root: string = process.cwd()) {
    __debug_param('constructor->options', options)
    __debug_param('constructor->root', root)

    this.options = this.resolveOptions(options, root)
  }

  resolveOptions(options: Options, root: string): ResolvedOptions {
    const {
      dirs = ['src/pages'],
      exclude = ['internal', 'components'],
      extensions = ['tsx', 'jsx', 'ts', 'js'],
      caseSensitive = false,
    } = options

    const resolvedOptions: ResolvedOptions = {
      root: slash(root),
      dirs,
      exclude,
      extensions,
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
      if (!this.isPagesDir(path)) return
      await this.removePage(path)
      this.onUpdate()
    })
    watcher.on('add', async (path) => {
      path = slash(path)
      if (!this.isPagesDir(path)) return
      const routeMap = this.routeMap
      await this.searchGlob()
      if (JSON.stringify(routeMap) !== JSON.stringify(this.routeMap)) this.onUpdate()
    })
  }

  isPagesDir(path: string) {
    for (const dir of this.options.dirs) {
      const dirPath = slash(resolve(this.options.root, dir))
      if (path.startsWith(dirPath)) return true
    }
    return false
  }

  async addPage(path: string | string[], pageDir: string) {
    __debug_param('removePage->path', path)
    __debug_param('removePage->pageDir', path)

    for (const filePath of toArray(path)) {
      const extension = this.options.extensions.find((ext) => filePath.endsWith(`.${ext}`))
      if (!extension) continue

      const pageDirPath = slash(resolve(this.options.root, pageDir))

      let rawRoute = slash(filePath.replace(`${pageDirPath}/`, '').replace(`.${extension}`, ''))

      const sync = filePath.endsWith('.sync')
      if (sync) rawRoute = rawRoute.replace('.sync', '')

      this.routeMap.set(filePath, {
        filePath,
        rawRoute,
        sync,
      })
    }
  }

  async removePage(path: string) {
    __debug_param('removePage->path', path)
    this.routeMap.delete(path)
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

  async searchGlob() {
    const pageDirFiles = this.options.dirs.map((dir) => {
      const pagesDirPath = slash(resolve(this.options.root, dir))
      __debug_info('searchGlob->pagesDirPath', pagesDirPath)

      const files = this.getPageFiles(pagesDirPath, this.options)
      __debug_info('searchGlob->files', files)

      return {
        dir,
        files: files.map((file) => slash(file)),
      }
    })

    this.routeMap = new Map()
    for (const page of pageDirFiles) {
      await this.addPage(page.files, page.dir)
    }

    __debug_info('searchGlob->routeMap', this.routeMap)
  }

  private extsToGlob(extensions: string[]) {
    return extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0] || ''
  }

  getPageFiles(path: string, options: ResolvedOptions): string[] {
    const { exclude, extensions } = options

    const ext = this.extsToGlob(extensions)

    const files = FastGlob.sync(`**/*.${ext}`, {
      ignore: exclude,
      onlyFiles: true,
      cwd: path,
    }).map((p) => slash(join(path, p)))

    return files
  }
}
