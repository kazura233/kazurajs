import { describe, it, expect } from 'vitest'
import { RollupBuilder } from '../../src/builder/rollup'
import type { PackageJson } from 'pkg-types'

function createBuilder(pkg: Partial<PackageJson> = {}) {
  const rootDir = '/test'
  const fullPkg: PackageJson = {
    name: 'test-package',
    version: '1.0.0',
    ...pkg,
  } as PackageJson
  return new RollupBuilder(rootDir, fullPkg, {})
}

describe('extractExports', () => {
  it('exports 为 undefined 时应返回空数组', () => {
    const builder = createBuilder()
    expect(builder.extractExports(undefined)).toEqual([])
  })

  it('应处理字符串形式的 exports', () => {
    const builder = createBuilder()
    expect(builder.extractExports('./dist/index.mjs')).toEqual([
      { file: './dist/index.mjs', format: 'esm' },
    ])
  })

  it('应处理简单对象形式的 exports', () => {
    const builder = createBuilder()
    const exports = {
      '.': './dist/index.mjs',
    }
    expect(builder.extractExports(exports)).toEqual([{ file: './dist/index.mjs', format: 'esm' }])
  })

  it('应处理 import/require 条件', () => {
    const builder = createBuilder()
    const exports = {
      '.': {
        import: './dist/index.mjs',
        require: './dist/index.cjs',
      },
    }
    expect(builder.extractExports(exports)).toEqual([
      { file: './dist/index.mjs', format: 'esm' },
      { file: './dist/index.cjs', format: 'cjs' },
    ])
  })

  it('应处理嵌套 exports 中的 types 条件', () => {
    const builder = createBuilder()
    const exports = {
      '.': {
        import: {
          types: './dist/index.d.mts',
          default: './dist/index.mjs',
        },
        require: {
          types: './dist/index.d.cts',
          default: './dist/index.cjs',
        },
      },
    }
    expect(builder.extractExports(exports)).toEqual([
      { file: './dist/index.d.mts', format: 'esm', declaration: true },
      { file: './dist/index.mjs', format: 'esm' },
      { file: './dist/index.d.cts', format: 'cjs', declaration: true },
      { file: './dist/index.cjs', format: 'cjs' },
    ])
  })

  it('应处理多个子路径 exports', () => {
    const builder = createBuilder()
    const exports = {
      '.': {
        import: './dist/index.mjs',
        require: './dist/index.cjs',
      },
      './utils': {
        import: './dist/utils.mjs',
        require: './dist/utils.cjs',
      },
    }
    expect(builder.extractExports(exports)).toEqual([
      { file: './dist/index.mjs', format: 'esm' },
      { file: './dist/index.cjs', format: 'cjs' },
      { file: './dist/utils.mjs', format: 'esm' },
      { file: './dist/utils.cjs', format: 'cjs' },
    ])
  })

  it('应处理 .d.ts 文件', () => {
    const builder = createBuilder()
    expect(builder.extractExports('./dist/index.d.ts')).toEqual([
      { file: './dist/index.d.ts', format: 'cjs', declaration: true },
    ])
  })

  it('应处理 .d.mts 文件', () => {
    const builder = createBuilder()
    expect(builder.extractExports('./dist/index.d.mts')).toEqual([
      { file: './dist/index.d.mts', format: 'esm', declaration: true },
    ])
  })

  it('应处理 .d.cts 文件', () => {
    const builder = createBuilder()
    expect(builder.extractExports('./dist/index.d.cts')).toEqual([
      { file: './dist/index.d.cts', format: 'cjs', declaration: true },
    ])
  })

  it('应处理 .js 文件的 import 条件', () => {
    const builder = createBuilder()
    expect(builder.inferExportType('import', './dist/index.js')).toEqual({
      file: './dist/index.js',
      format: 'esm',
    })
  })

  it('应处理 .js 文件的 require 条件', () => {
    const builder = createBuilder()
    expect(builder.inferExportType('require', './dist/index.js')).toEqual({
      file: './dist/index.js',
      format: 'cjs',
    })
  })

  it('无条件时 .js 文件应根据 package type 推断为 esm', () => {
    const builder = createBuilder({ type: 'module' })
    expect(builder.inferExportType('', './dist/index.js')).toEqual({
      file: './dist/index.js',
      format: 'esm',
    })
  })

  it('无条件时 .js 文件应根据 package type 推断为 cjs', () => {
    const builder = createBuilder()
    expect(builder.inferExportType('', './dist/index.js')).toEqual({
      file: './dist/index.js',
      format: 'cjs',
    })
  })

  it('未知文件扩展名应返回 null', () => {
    const builder = createBuilder()
    expect(builder.inferExportType('', './dist/index.xyz')).toBeNull()
  })
})
