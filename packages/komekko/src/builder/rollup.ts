import { resolve } from 'pathe'
import type { BuildEntry, BuildOptions, KomekkoOptions, ModuleFormat } from '../types'
import { arrayIncludes, getpkg, removeExtension } from '../utils'
import type { PackageJson } from 'pkg-types'
import Module from 'node:module'
import defu from 'defu'
import type { InputPluginOption, InputOptions, OutputOptions, PreRenderedChunk } from 'rollup'
import { rollup } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias'
import dts from 'rollup-plugin-dts'
import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'
import { esbuildPlugin } from '../plugins/esbuild'
import { obfuscatePlugin } from '../plugins/obfuscator'
import debug from 'debug'
import { fixCJSExportTypePlugin } from '../plugins/cjs'

const DEFAULT_EXTENSIONS = ['.ts', '.tsx', '.mjs', '.cjs', '.js', '.jsx', '.json']

const log = {
  info: debug('komekko:rollup:info'),
  error: debug('komekko:rollup:error'),
} as const

export interface RollupOptions extends InputOptions {
  output?: OutputOptions
}

export type OutputDescriptor =
  | {
      file: string
      format: ModuleFormat
    }
  | {
      file: string
      format: ModuleFormat
      declaration: boolean
    }

export class RollupBuilder {
  public rootDir: string
  public pkg: PackageJson
  public options: BuildOptions
  public warnings: Set<string> = new Set()

  constructor(rootDir: string, pkg: PackageJson, buildOptions: KomekkoOptions) {
    this.rootDir = rootDir
    this.pkg = pkg
    this.options = defu(buildOptions, this.defaultBuildOptions())
    this.options.external.push(
      ...Object.keys(this.pkg.dependencies || {}),
      ...Object.keys(this.pkg.peerDependencies || {}),
    )

    log.info('>>>>>>>>>> RollupBuilder->constructor->this.options: %O', this.options)
  }

  public defaultBuildOptions(): BuildOptions {
    return {
      target: 'esnext',
      rootDir: resolve(this.rootDir, './'),
      sourcemap: false,
      minify: false,
      declaration: false,
      outDir: resolve(this.rootDir, './dist'),
      alias: {},
      replace: {},
      external: [
        ...Module.builtinModules,
        ...Module.builtinModules.map((module) => 'node:' + module),
      ],
      entries: [],
      rollupOptions: {},
      rollupPluginsOptions: {
        replaceOptions: {
          preventAssignment: true,
        },
        aliasOptions: {},
        nodeResolveOptions: {
          preferBuiltins: true,
        },
        jsonOptions: {
          preferConst: true,
        },
        commonJSOptions: {
          ignoreTryCatch: true,
        },
        esbuildOptions: {},
        dtsOptions: {
          compilerOptions: {
            // https://github.com/Swatinem/rollup-plugin-dts/issues/143
            preserveSymlinks: false,
            // https://github.com/Swatinem/rollup-plugin-dts/issues/127
            composite: false,
          },
          respectExternal: true,
        },
      },
    }
  }

  public autoPreset() {
    // 如果通过 komekko.config.ts 配置了 entries，则不再自动预设
    if (this.options.entries.length) {
      return
    }

    const entries = this.inferEntries()
    log.info('>>>>>>>>>> RollupBuilder->autoPreset->entries: %O', entries)

    this.options.entries.push(...entries)
  }

  public inferEntries(): BuildEntry[] {
    const outputs = this.extractExports(this.pkg.exports)

    if (this.pkg.bin) {
      const binaries =
        typeof this.pkg.bin === 'string' ? [this.pkg.bin] : Object.values(this.pkg.bin)
      for (const file of binaries) {
        const output = this.inferExportType('', file)
        if (output) {
          outputs.push(output)
        }
      }
    }

    if (this.pkg.main) {
      const output = this.inferExportType('', this.pkg.main)
      if (output) {
        outputs.push(output)
      }
    }

    if (this.pkg.module) {
      outputs.push({ file: this.pkg.module, format: 'esm' })
    }

    if (this.pkg.types || this.pkg.typings) {
      const output = this.inferExportType('', this.pkg.types || this.pkg.typings!)
      if (output) {
        outputs.push(output)
      }
    }

    return outputs.map<BuildEntry>((output) => {
      let input = ''
      let outFileName = ''

      if (output.file.startsWith('dist/')) {
        input = output.file.replace(/^dist\//, 'src/')
        outFileName = output.file.replace(/^dist\//, '')
      } else if (output.file.startsWith('./dist/')) {
        input = output.file.replace(/^\.\/dist\//, 'src/')
        outFileName = output.file.replace(/^\.\/dist\//, '')
      } else {
        throw new Error(`Expected output file to start with dist/, received ${output.file}`)
      }

      input = removeExtension(input)

      const declaration = 'declaration' in output ? output.declaration : undefined
      const format = 'format' in output ? output.format : undefined

      return {
        input: resolve(this.options.rootDir, input),
        outFileName: outFileName,
        declaration,
        formats: format ? [format] : [],
      }
    })
  }

  public checkOutFileName(outFileName: string) {
    if (outFileName.startsWith('.') || outFileName.startsWith('/')) {
      throw new Error(`outFileName must be a relative path, but received "${outFileName}"`)
    }
  }

  public checkExtension(filename: string, declaration?: boolean): void
  public checkExtension(filename: string, format: ModuleFormat): void
  public checkExtension($1: string, $2?: boolean | ModuleFormat): void {
    if (!$2) return

    if (typeof $2 === 'boolean') {
      if (!$1.endsWith('.d.ts') && !$1.endsWith('.d.mts') && !$1.endsWith('.d.cts')) {
        throw new Error(
          `Expected declaration file to end with .d.ts, .d.mts, or .d.cts, received ${$1}`,
        )
      }
    }

    if (typeof $2 === 'string') {
      if ($2 === 'esm') {
        if (!$1.endsWith('.mjs') && !$1.endsWith('.js')) {
          throw new Error(`Expected ESM file to end with .mjs or .js, received ${$1}`)
        }
      }
      if ($2 === 'cjs') {
        if (!$1.endsWith('.cjs') && !$1.endsWith('.js')) {
          throw new Error(`Expected CJS file to end with .cjs or .js, received ${$1}`)
        }
      }
    }
  }

  public extractExports(exports: PackageJson['exports']): OutputDescriptor[] {
    if (!exports) {
      return []
    }

    if (typeof exports === 'string') {
      return [this.inferExportType('', exports)].filter(Boolean) as OutputDescriptor[]
    }

    return Object.entries(exports)
      .flatMap(([condition, exports]) => {
        log.info('>>>>>>>>>> RollupBuilder->extractExports->condition: %s', condition)
        log.info('>>>>>>>>>> RollupBuilder->extractExports->exports: %O', exports)
        if (typeof exports === 'string') {
          return this.inferExportType(condition, exports)
        }
        return this.extractExports(exports)
      })
      .filter(Boolean) as OutputDescriptor[]
  }

  public inferExportType(condition: string, file: string): OutputDescriptor | null {
    if (file.endsWith('.d.mts')) {
      return { file, format: 'esm', declaration: true }
    }
    if (file.endsWith('.d.cts')) {
      return { file, format: 'cjs', declaration: true }
    }
    if (file.endsWith('.d.ts')) {
      return { file, format: 'cjs', declaration: true }
    }
    if (file.endsWith('.mjs')) {
      return { file, format: 'esm' }
    }
    if (file.endsWith('.cjs')) {
      return { file, format: 'cjs' }
    }

    if (file.endsWith('.js')) {
      switch (condition) {
        case 'import': {
          return { file, format: 'esm' }
        }
        case 'require': {
          return { file, format: 'cjs' }
        }
        default: {
          return { file, format: this.pkg.type === 'module' ? 'esm' : 'cjs' }
        }
      }
    }

    return null
  }

  public async build() {
    if (!this.options.entries || !this.options.entries.length) {
      throw new Error('No entries found')
    }

    const rollupOptions = this.getRollupOptions()

    for (const options of rollupOptions) {
      const rollupBuild = await rollup(options)
      await rollupBuild.write(options.output as OutputOptions)
    }

    await this.writeTypes()
  }

  public getRollupOptions(): RollupOptions[] {
    const grouped = this.groupByFormat(this.options.entries)
    const external = this.options.external

    const { output, ...ext } = this.options.rollupOptions

    const options = Object.entries(grouped)
      .filter(([, entries]) => entries.length > 0)
      .map(([format, entries]) => {
        const options: RollupOptions = {
          input: Object.fromEntries(
            entries.map((entry) => {
              const outFileName =
                typeof entry.outFileName === 'string'
                  ? entry.outFileName
                  : entry.outFileName(entry.input, format as ModuleFormat)
              this.checkOutFileName(outFileName)
              this.checkExtension(outFileName, format as ModuleFormat)
              return [outFileName, entry.input]
            }),
          ),

          output: { ...this.getOutputOptionsByFormat(format as ModuleFormat), ...output },

          external(originalId) {
            const pkgName = getpkg(originalId)
            const isExplicitExternal =
              arrayIncludes(external, pkgName) || arrayIncludes(external, originalId)
            return isExplicitExternal
          },

          onwarn(warning, rollupWarn) {
            if (!warning.code || !['CIRCULAR_DEPENDENCY'].includes(warning.code)) {
              rollupWarn(warning)
            }
          },

          plugins: this.getInputPluginOption(),

          ...ext,
        }

        log.info('>>>>>>>>>> RollupBuilder->getRollupOptions->options->input: %s', options.input)
        log.info('>>>>>>>>>> RollupBuilder->getRollupOptions->options->output: %O', options.output)
        return options
      })

    return options
  }

  resolveAliases() {
    const aliases: Record<string, string> = {
      [this.pkg.name!]: this.options.rootDir,
      ...this.options.alias,
    }

    if (this.options.rollupPluginsOptions.aliasOptions) {
      if (Array.isArray(this.options.rollupPluginsOptions.aliasOptions.entries)) {
        Object.assign(
          aliases,
          Object.fromEntries(
            this.options.rollupPluginsOptions.aliasOptions.entries.map((entry) => {
              return [entry.find, entry.replacement]
            }),
          ),
        )
      } else {
        Object.assign(
          aliases,
          this.options.rollupPluginsOptions.aliasOptions.entries ||
            this.options.rollupPluginsOptions.aliasOptions,
        )
      }
    }

    return aliases
  }

  groupByFormat(buildEntries: BuildEntry[]): Record<ModuleFormat, BuildEntry[]> {
    return buildEntries.reduce<Record<ModuleFormat, BuildEntry[]>>(
      (map, entry) => {
        if (entry.formats && entry.formats.length && !entry.declaration) {
          for (const format of entry.formats) {
            map[format].push(entry)
          }
        }
        return map
      },
      {
        esm: [],
        cjs: [],
        umd: [],
        iife: [],
      },
    )
  }

  public async writeTypes() {
    const entries: BuildEntry[] = this.options.entries
      .filter(({ declaration }) => declaration)
      .map((entry) => {
        const outFileName =
          typeof entry.outFileName === 'string'
            ? entry.outFileName
            : entry.outFileName(entry.input, entry.formats[0])
        this.checkOutFileName(outFileName)
        this.checkExtension(outFileName, true)
        return {
          ...entry,
          outFileName,
        }
      })

    if (!entries.length) return

    log.info('>>>>>>>>>> RollupBuilder->writeTypes->entries: %O', entries)

    const external = this.options.external

    for (const entry of entries) {
      const outFileName = entry.outFileName as string
      const format = entry.formats[0]

      const outputOptions =
        format === 'esm' ? this.getESMOutputOptions() : this.getCJSOutputOptions()

      const chunkExt = outFileName.endsWith('.d.mts')
        ? 'd.mts'
        : outFileName.endsWith('.d.cts')
          ? 'd.cts'
          : 'd.ts'

      const options: RollupOptions = {
        input: { [outFileName]: entry.input },

        output: {
          ...outputOptions,
          chunkFileNames: (chunk: PreRenderedChunk) => this.getChunkFilename(chunk, chunkExt),
        },

        external(originalId) {
          const pkgName = getpkg(originalId)
          const isExplicitExternal =
            arrayIncludes(external, pkgName) || arrayIncludes(external, originalId)
          return isExplicitExternal
        },

        onwarn(warning, rollupWarn) {
          if (!warning.code || !['CIRCULAR_DEPENDENCY'].includes(warning.code)) {
            rollupWarn(warning)
          }
        },
        plugins: [
          ...this.getInputPluginOption(),
          dts(this.options.rollupPluginsOptions.dtsOptions),
          fixCJSExportTypePlugin(),
        ].filter(
          (plugin): plugin is NonNullable<Exclude<typeof plugin, false>> =>
            /**
             * rollup-plugin-dts 和 rollup-plugin-commonjs 冲突：
             * https://github.com/Swatinem/rollup-plugin-dts?tab=readme-ov-file#what-to-expect
             */
            !!plugin && (!('name' in plugin) || plugin.name !== 'commonjs'),
        ),
      }

      log.info('>>>>>>>>>> RollupBuilder->writeTypes->options->input: %s', options.input)
      log.info('>>>>>>>>>> RollupBuilder->writeTypes->options->output: %O', options.output)

      const rollupBuild = await rollup(options)
      await rollupBuild.write(options.output as OutputOptions)
    }
  }

  public getEntryFileNames(chunk: PreRenderedChunk) {
    return chunk.name
  }

  public getChunkFilename(chunk: PreRenderedChunk, ext: string) {
    if (chunk.isDynamicEntry) {
      return `chunks/[name].${ext}`
    }
    const pkgName = getpkg(this.pkg.name)
    const name = pkgName.split('/').pop()
    return `shared/${name}.[hash].${ext}`
  }

  public getCJSOutputOptions(): OutputOptions {
    return {
      dir: this.options.outDir,
      entryFileNames: (chunk: PreRenderedChunk) => this.getEntryFileNames(chunk),
      chunkFileNames: (chunk: PreRenderedChunk) => this.getChunkFilename(chunk, 'cjs'),
      format: 'cjs',
      exports: 'auto',
      interop: 'compat',
      generatedCode: { constBindings: true },
      externalLiveBindings: false,
      freeze: false,
      sourcemap: this.options.sourcemap,
    }
  }

  public getESMOutputOptions(): OutputOptions {
    return {
      dir: this.options.outDir,
      entryFileNames: (chunk: PreRenderedChunk) => this.getEntryFileNames(chunk),
      chunkFileNames: (chunk: PreRenderedChunk) => this.getChunkFilename(chunk, 'mjs'),
      format: 'esm',
      exports: 'auto',
      generatedCode: { constBindings: true },
      externalLiveBindings: false,
      freeze: false,
      sourcemap: this.options.sourcemap,
    }
  }

  public getUMDOutputOptions(): OutputOptions {
    return {
      dir: this.options.outDir,
      entryFileNames: (chunk: PreRenderedChunk) => this.getEntryFileNames(chunk),
      chunkFileNames: (chunk: PreRenderedChunk) => this.getChunkFilename(chunk, 'js'),
      format: 'umd',
      exports: 'auto',
      generatedCode: { constBindings: true },
      externalLiveBindings: false,
      freeze: false,
      sourcemap: this.options.sourcemap,
    }
  }

  public getIIFEOutputOptions(): OutputOptions {
    return {
      dir: this.options.outDir,
      entryFileNames: (chunk: PreRenderedChunk) => this.getEntryFileNames(chunk),
      chunkFileNames: (chunk: PreRenderedChunk) => this.getChunkFilename(chunk, 'js'),
      format: 'iife',
      generatedCode: { constBindings: true },
      externalLiveBindings: false,
      freeze: false,
      sourcemap: this.options.sourcemap,
    }
  }

  public getOutputOptionsByFormat(format: ModuleFormat): OutputOptions {
    switch (format) {
      case 'cjs':
        return this.getCJSOutputOptions()
      case 'esm':
        return this.getESMOutputOptions()
      case 'umd':
        return this.getUMDOutputOptions()
      case 'iife':
        return this.getIIFEOutputOptions()
      default:
        throw new Error(`Unexpected format ${format}`)
    }
  }

  public getInputPluginOption(): InputPluginOption[] {
    return [
      this.options.rollupPluginsOptions.replaceOptions &&
        replace({
          ...this.options.rollupPluginsOptions.replaceOptions,
          values: {
            ...this.options.replace,
            ...this.options.rollupPluginsOptions.replaceOptions.values,
          },
        }),
      this.options.rollupPluginsOptions.aliasOptions &&
        alias({
          ...this.options.rollupPluginsOptions.aliasOptions,
          entries: this.resolveAliases(),
        }),

      this.options.rollupPluginsOptions.nodeResolveOptions &&
        nodeResolve({
          extensions: DEFAULT_EXTENSIONS,
          exportConditions: ['production'],
          ...this.options.rollupPluginsOptions.nodeResolveOptions,
        }),

      this.options.rollupPluginsOptions.jsonOptions &&
        json({
          ...this.options.rollupPluginsOptions.jsonOptions,
        }),

      this.options.rollupPluginsOptions.esbuildOptions &&
        esbuildPlugin({
          target: this.options.target,
          sourcemap: this.options.sourcemap,
          minify: this.options.minify,
          ...this.options.rollupPluginsOptions.esbuildOptions,
        }),

      this.options.rollupPluginsOptions.commonJSOptions &&
        commonjs({
          extensions: DEFAULT_EXTENSIONS,
          ...this.options.rollupPluginsOptions.commonJSOptions,
        }),

      this.options.rollupPluginsOptions.obfuscatorOptions &&
        obfuscatePlugin({
          ...this.options.rollupPluginsOptions.obfuscatorOptions,
        }),
    ].filter(Boolean)
  }
}
