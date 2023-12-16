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
  replace: RollupReplaceOptions | false
  alias: RollupAliasOptions | false
  resolve: RollupNodeResolveOptions | false
  json: RollupJsonOptions | false
  esbuild: EsbuildOptions | false
  commonjs: RollupCommonJSOptions | false
  dts: RollupDtsOptions
  rollup: RollupOptions
}

export type ModuleFormat = 'esm' | 'cjs' | 'umd' | 'iife'

export interface BuildEntry {
  entryFileName: string
  entryFileDir: string
  entryAlias: string
  outFileName: string
  outFileDir: string
  declaration?: boolean
  sourcemap: boolean
  format?: ModuleFormat
}

export interface BuildOptions {
  rootDir: string
  sourcemap: boolean
  declaration: boolean
  outDir: string
  alias: { [find: string]: string }
  replace: { [str: string]: string }
  external: (string | RegExp)[]
  entries: BuildEntry[]
  rollup: Partial<RollupPluginsOptions>
}

export interface KomekkoOptions extends Partial<BuildOptions> {}

export function defineConfig(options: KomekkoOptions): KomekkoOptions
export function defineConfig(options: KomekkoOptions[]): KomekkoOptions[]
export function defineConfig(
  $1: KomekkoOptions | KomekkoOptions[]
): KomekkoOptions | KomekkoOptions[] {
  return $1
}
