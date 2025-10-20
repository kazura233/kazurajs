import type { Plugin } from 'vite'
import * as path from 'node:path'
import { Project } from 'ts-morph'

function toPosixPath(filePath: string): string {
  return filePath.replace(/\\/g, '/')
}

interface BootstrapClass {
  filePath: string
  className: string
  relativePath: string
}

const VIRTUAL_MODULE_ID = 'virtual:bootstrap-entry'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

const state = {
  bootstrapClasses: [] as BootstrapClass[],
  srcDir: '',
  isBuild: false,
  generatedFileName: null as string | null,
}

export function viteBootstrapPlugin(): Plugin[] {
  return [
    {
      name: 'vite-plugin-bootstrap:main',

      configResolved(config) {
        state.srcDir = path.resolve(config.root, 'src')
        state.isBuild = config.command === 'build'
      },

      async buildStart() {
        state.bootstrapClasses = await findBootstrapClasses(state.srcDir)

        if (state.bootstrapClasses.length > 0) {
          console.log('[vite-plugin-bootstrap] 找到以下 Bootstrap 类:')
          state.bootstrapClasses.forEach(({ className, relativePath }) => {
            console.log(`  - ${className} (${relativePath})`)
          })

          if (state.isBuild) {
            this.emitFile({
              type: 'chunk',
              id: VIRTUAL_MODULE_ID,
              name: 'bootstrap-entry',
            })
          }
        } else {
          console.warn('[vite-plugin-bootstrap] 未找到使用 @Bootstrap 装饰器的类')
        }
      },

      resolveId(id) {
        if (id === VIRTUAL_MODULE_ID) {
          return RESOLVED_VIRTUAL_MODULE_ID
        }
      },

      load(id) {
        if (id === RESOLVED_VIRTUAL_MODULE_ID) {
          if (state.bootstrapClasses.length === 0) {
            return `console.warn('[Bootstrap] 未找到使用 @Bootstrap 装饰器的类');`
          }

          const imports = state.bootstrapClasses
            .map(({ className, filePath }) => {
              const posixPath = toPosixPath(filePath)
              return `import { ${className} } from '${posixPath}';`
            })
            .join('\n')

          const calls = state.bootstrapClasses
            .map(({ className }) => {
              return `${className}.main();`
            })
            .join('\n')

          return `// 此文件由 vite-plugin-bootstrap 自动生成\n${imports}\n\n${calls}`
        }
      },

      async generateBundle(_options, bundle) {
        if (!state.isBuild || state.bootstrapClasses.length === 0) {
          return
        }

        for (const fileName in bundle) {
          const chunk = bundle[fileName]
          if (chunk.type === 'chunk' && chunk.facadeModuleId === RESOLVED_VIRTUAL_MODULE_ID) {
            state.generatedFileName = toPosixPath(fileName)
            break
          }
        }
      },

      transformIndexHtml: {
        order: 'pre',
        handler() {
          if (!state.isBuild && state.bootstrapClasses.length > 0) {
            return [
              {
                tag: 'script',
                attrs: {
                  type: 'module',
                  src: `/@id/${VIRTUAL_MODULE_ID}`,
                },
                injectTo: 'body',
              },
            ]
          }
          return []
        },
      },
    },
    {
      name: 'vite-plugin-bootstrap:post',

      enforce: 'post',

      transformIndexHtml() {
        if (state.isBuild && state.generatedFileName && state.bootstrapClasses.length > 0) {
          return [
            {
              tag: 'script',
              attrs: {
                type: 'module',
                crossorigin: true,
                src: `./${state.generatedFileName}`,
              },
              injectTo: 'body',
            },
          ]
        }
        return []
      },
    },
  ]
}

async function findBootstrapClasses(srcDir: string): Promise<BootstrapClass[]> {
  const results: BootstrapClass[] = []

  const projectRoot = path.dirname(srcDir)
  const tsconfigPath = path.join(projectRoot, 'tsconfig.app.json')

  const project = new Project({
    tsConfigFilePath: tsconfigPath,
    skipAddingFilesFromTsConfig: true,
  })

  const pattern = toPosixPath(path.join(srcDir, '**', '*.{ts,tsx}'))
  project.addSourceFilesAtPaths(pattern)

  if (project.getSourceFiles().length === 0) {
    return results
  }

  for (const sourceFile of project.getSourceFiles()) {
    const filePath = sourceFile.getFilePath()

    const classes = sourceFile.getClasses()

    for (const classDeclaration of classes) {
      const decorators = classDeclaration.getDecorators()

      const hasBootstrapDecorator = decorators.some((decorator) => {
        const name = decorator.getName()
        return name === 'Bootstrap'
      })

      if (hasBootstrapDecorator) {
        const className = classDeclaration.getName()
        if (className) {
          const relativeFilePath = path.relative(srcDir, filePath)
          const posixRelativePath = toPosixPath(relativeFilePath)
          const relativePath = './' + posixRelativePath.replace(/\.tsx?$/, '')

          results.push({
            filePath,
            className,
            relativePath,
          })
        }
      }
    }
  }

  return results
}
