import type { RollupReplaceOptions } from '@rollup/plugin-replace'
import type { RollupAliasOptions } from '@rollup/plugin-alias'
import type { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve'
import type { RollupJsonOptions } from '@rollup/plugin-json'
import type { Options as RollupDtsOptions } from 'rollup-plugin-dts'
import type commonjs from '@rollup/plugin-commonjs'
import type { RollupOptions } from 'rollup'
import type { EsbuildOptions } from './plugins/esbuild'

export type RollupCommonJSOptions = NonNullable<Parameters<typeof commonjs>[0]>

export interface RollupPluginsOptions {
  replaceOptions: RollupReplaceOptions | false
  aliasOptions: RollupAliasOptions | false
  nodeResolveOptions: RollupNodeResolveOptions | false
  jsonOptions: RollupJsonOptions | false
  esbuildOptions: EsbuildOptions | false
  commonJSOptions: RollupCommonJSOptions | false
  dtsOptions: RollupDtsOptions
}

export type ModuleFormat = 'esm' | 'cjs' | 'umd' | 'iife'

export interface BuildEntry {
  /**
   * 相对于 rootDir 的文件路径
   */
  input: string
  /**
   * 相对于 outDir 的文件路径
   */
  outFileName: string | ((input: string, format: ModuleFormat) => string)
  declaration?: boolean
  formats: ModuleFormat[]
}

export interface BuildOptions {
  /**
   * 默认：esnext，参考 https://esbuild.github.io/api/#target
   */
  target: string
  /**
   * 默认：./
   */
  rootDir: string
  sourcemap: boolean
  minify: boolean
  declaration: boolean
  /**
   * 默认：./dist
   */
  outDir: string
  alias: { [find: string]: string }
  replace: { [str: string]: string }
  external: (string | RegExp)[]
  entries: BuildEntry[]
  rollupOptions: RollupOptions
  rollupPluginsOptions: Partial<RollupPluginsOptions>
}

export interface KomekkoOptions extends Partial<BuildOptions> {}

export function defineConfig(options: KomekkoOptions): KomekkoOptions
export function defineConfig(options: KomekkoOptions[]): KomekkoOptions[]
export function defineConfig(
  $1: KomekkoOptions | KomekkoOptions[]
): KomekkoOptions | KomekkoOptions[] {
  return $1
}
