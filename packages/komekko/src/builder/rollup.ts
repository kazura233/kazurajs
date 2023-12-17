import { resolve } from 'pathe'
import type { BuildEntry, BuildOptions, KomekkoOptions, ModuleFormat } from '../types'
import { arrayIncludes, getpkg, md5, tryRequire } from '../utils'
import type { PackageJson } from 'pkg-types'
import Module from 'node:module'
import defu from 'defu'
import { InputPluginOption, OutputOptions, PreRenderedChunk, RollupOptions, rollup } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias'
import dts from 'rollup-plugin-dts'
import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'
import { esbuildPlugin } from '../plugins/esbuild'

const DEFAULT_EXTENSIONS = ['.ts', '.tsx', '.mjs', '.cjs', '.js', '.jsx', '.json']

export type OutputDescriptor =
  | {
      file: string
      format: ModuleFormat
    }
  | {
      file: string
      declaration: boolean
    }

export class RollupBuilder {
  public options: BuildOptions
  public pkg: PackageJson
  public warnings: Set<string> = new Set()

  constructor(buildOptions: KomekkoOptions) {
    const rootDir = resolve(process.cwd(), buildOptions.rootDir || './')
    this.pkg = tryRequire('./package.json', rootDir)
    this.options = defu(buildOptions, this.defaultBuildOptions())
    this.options.external.push(
      ...Object.keys(this.pkg.dependencies || {}),
      ...Object.keys(this.pkg.peerDependencies || {})
    )

    console.log('>>>>>>>>>>', 'RollupBuilder->constructor->this.options', this.options)
  }

  public defaultBuildOptions(): BuildOptions {
    return {
      rootDir: resolve(process.cwd(), './'),
      sourcemap: false,
      declaration: false,
      outDir: resolve(process.cwd(), './dist'),
      alias: {},
      replace: {},
      external: [
        ...Module.builtinModules,
        ...Module.builtinModules.map((module) => 'node:' + module),
      ],
      entries: [],
      plugins: {
        replace: {
          preventAssignment: true,
        },
        alias: {},
        resolve: {
          preferBuiltins: true,
        },
        json: {
          preferConst: true,
        },
        commonjs: {
          ignoreTryCatch: true,
        },
        esbuild: { target: 'esnext' },
        dts: {
          compilerOptions: { preserveSymlinks: false },
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
    console.log('>>>>>>>>>>', 'RollupBuilder->autoPreset->entries', entries)

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
      outputs.push({
        file: this.pkg.types || this.pkg.typings!,
        declaration: true,
      })
    }

    this.checkExtension(outputs)

    return outputs.map<BuildEntry>((output) => {
      let entryFileName = ''
      let outFileName = ''

      if (output.file.startsWith('dist/')) {
        entryFileName = output.file.replace(/^dist\//, 'src/')
        outFileName = output.file.replace(/^dist\//, '')
      } else if (output.file.startsWith('./dist/')) {
        entryFileName = output.file.replace(/^\.\/dist\//, 'src/')
        outFileName = output.file.replace(/^\.\/dist\//, '')
      } else {
        throw new Error(`Expected output file to start with dist/, received ${output.file}`)
      }

      return {
        entryFileName: entryFileName,
        entryFileDir: this.options.rootDir,
        entryAlias: md5(outFileName),
        outFileName: outFileName,
        outFileDir: this.options.outDir,
        declaration: 'declaration' in output ? output.declaration : undefined,
        sourcemap: this.options.sourcemap,
        format: 'format' in output ? output.format : undefined,
      }
    })
  }

  public checkExtension(outputs: OutputDescriptor[]) {
    outputs.forEach((output) => {
      if ('declaration' in output) {
        if (!output.file.endsWith('.d.ts')) {
          throw new Error(`Expected declaration file to end with .d.ts, received ${output.file}`)
        }
      }

      if ('format' in output) {
        if (output.format === 'esm') {
          if (!output.file.endsWith('.mjs') && !output.file.endsWith('.js')) {
            throw new Error(`Expected ESM file to end with .mjs or .js, received ${output.file}`)
          }
        }

        if (output.format === 'cjs') {
          if (!output.file.endsWith('.cjs') && !output.file.endsWith('.js')) {
            throw new Error(`Expected CJS file to end with .cjs or .js, received ${output.file}`)
          }
        }
      }
    })
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
        console.log('>>>>>>>>>>', 'RollupBuilder->extractExports->condition', condition)
        console.log('>>>>>>>>>>', 'RollupBuilder->extractExports->exports', exports)
        if (typeof exports === 'string') {
          return this.inferExportType(condition, exports)
        }
        return this.extractExports(exports)
      })
      .filter(Boolean) as OutputDescriptor[]
  }

  public inferExportType(condition: string, file: string): OutputDescriptor | null {
    if (file.endsWith('.d.ts')) {
      return { file, declaration: true }
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
    return Object.entries(grouped)
      .filter(([, entries]) => entries.length > 0)
      .map(([format, entries]) => {
        const outputOptions: OutputOptions = this.getOutputOptionsByFormat(format as ModuleFormat)

        outputOptions.entryFileNames = (chunkInfo: PreRenderedChunk) =>
          this.getEntryFileNames(chunkInfo, entries)

        const options: RollupOptions = {
          input: Object.fromEntries(
            entries.map((entry) => [
              entry.entryAlias,
              resolve(entry.entryFileDir, entry.entryFileName),
            ])
          ),

          output: outputOptions,

          external(id) {
            const pkg = getpkg(id)
            const isExplicitExternal = arrayIncludes(external, pkg) || arrayIncludes(external, id)
            return isExplicitExternal
          },

          onwarn(warning, rollupWarn) {
            if (!warning.code || !['CIRCULAR_DEPENDENCY'].includes(warning.code)) {
              rollupWarn(warning)
            }
          },

          plugins: this.getInputPluginOption(),
        }

        console.log('>>>>>>>>>>', 'RollupBuilder->getRollupOptions->options->input', options.input)
        console.log(
          '>>>>>>>>>>',
          'RollupBuilder->getRollupOptions->options->output',
          options.output
        )

        return options
      })
  }

  resolveAliases() {
    const aliases: Record<string, string> = {
      [this.pkg.name!]: this.options.rootDir,
      ...this.options.alias,
    }

    if (this.options.plugins.alias) {
      if (Array.isArray(this.options.plugins.alias.entries)) {
        Object.assign(
          aliases,
          Object.fromEntries(
            this.options.plugins.alias.entries.map((entry) => {
              return [entry.find, entry.replacement]
            })
          )
        )
      } else {
        Object.assign(aliases, this.options.plugins.alias.entries || this.options.plugins.alias)
      }
    }

    return aliases
  }

  groupByFormat(buildEntries: BuildEntry[]): Record<ModuleFormat, BuildEntry[]> {
    return buildEntries.reduce<Record<ModuleFormat, BuildEntry[]>>(
      (map, entry) => {
        if (entry.format) {
          map[entry.format].push(entry)
        }
        return map
      },
      {
        esm: [],
        cjs: [],
        umd: [],
        iife: [],
      }
    )
  }

  public async writeTypes() {
    const entries = this.options.entries.filter(({ declaration }) => declaration)

    const external = this.options.external

    const outputOptions: OutputOptions = this.getESMOutputOptions()

    outputOptions.entryFileNames = (chunkInfo: PreRenderedChunk) =>
      this.getEntryFileNames(chunkInfo, entries)

    const options: RollupOptions = {
      input: Object.fromEntries(
        entries.map((entry) => [entry.entryAlias, resolve(entry.entryFileDir, entry.entryFileName)])
      ),

      output: outputOptions,

      external(id) {
        const pkg = getpkg(id)
        const isExplicitExternal = arrayIncludes(external, pkg) || arrayIncludes(external, id)
        return isExplicitExternal
      },

      onwarn(warning, rollupWarn) {
        if (!warning.code || !['CIRCULAR_DEPENDENCY'].includes(warning.code)) {
          rollupWarn(warning)
        }
      },
      plugins: [...this.getInputPluginOption(), dts(this.options.plugins.dts)],
    }

    console.log('>>>>>>>>>>', 'RollupBuilder->writeTypes->options->input', options.input)
    console.log('>>>>>>>>>>', 'RollupBuilder->writeTypes->options->output', options.output)

    const rollupBuild = await rollup(options)
    await rollupBuild.write(options.output as OutputOptions)
  }

  public getEntryFileNames(chunk: PreRenderedChunk, entries: BuildEntry[]) {
    const name = entries.find(({ entryAlias }) => entryAlias === chunk.name)
    if (!name) {
      console.log(entries)
      throw new Error(`Could not find entry for chunk ${chunk.name}`)
    }
    return name.outFileName
  }

  public getChunkFilename(chunk: PreRenderedChunk, ext: string) {
    if (chunk.isDynamicEntry) {
      return `chunks/[name].${ext}`
    }
    const name = getpkg(this.pkg.name)
    return `shared/${name}.[hash].${ext}`
  }

  public getCJSOutputOptions(): OutputOptions {
    return {
      dir: this.options.outDir,
      chunkFileNames: (chunk: PreRenderedChunk) => this.getChunkFilename(chunk, 'cjs'),
      format: 'cjs',
      exports: 'auto',
      interop: 'compat',
      generatedCode: { constBindings: true },
      externalLiveBindings: false,
      freeze: false,
      sourcemap: this.options.sourcemap,
      ...this.options.plugins.rollup?.output,
    }
  }

  public getESMOutputOptions(): OutputOptions {
    return {
      dir: this.options.outDir,
      chunkFileNames: (chunk: PreRenderedChunk) => this.getChunkFilename(chunk, 'mjs'),
      format: 'esm',
      exports: 'auto',
      generatedCode: { constBindings: true },
      externalLiveBindings: false,
      freeze: false,
      sourcemap: this.options.sourcemap,
      ...this.options.plugins.rollup?.output,
    }
  }

  public getUMDOutputOptions(): OutputOptions {
    return {} // TODO
  }

  public getIIFEOutputOptions(): OutputOptions {
    return {} // TODO
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
      this.options.plugins.replace &&
        replace({
          ...this.options.plugins.replace,
          values: {
            ...this.options.replace,
            ...this.options.plugins.replace.values,
          },
        }),
      this.options.plugins.alias &&
        alias({
          ...this.options.plugins.alias,
          entries: this.resolveAliases(),
        }),

      this.options.plugins.resolve &&
        nodeResolve({
          extensions: DEFAULT_EXTENSIONS,
          ...this.options.plugins.resolve,
        }),

      this.options.plugins.json &&
        json({
          ...this.options.plugins.json,
        }),

      this.options.plugins.esbuild &&
        esbuildPlugin({
          sourcemap: this.options.sourcemap,
          ...this.options.plugins.esbuild,
        }),

      this.options.plugins.commonjs &&
        commonjs({
          extensions: DEFAULT_EXTENSIONS,
          ...this.options.plugins.commonjs,
        }),
    ].filter(Boolean)
  }
}