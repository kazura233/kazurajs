[npm]: https://img.shields.io/npm/v/@kazura/komekko
[npm-url]: https://www.npmjs.com/package/@kazura/komekko
[size]: https://packagephobia.now.sh/badge?p=@kazura/komekko
[size-url]: https://packagephobia.now.sh/result?p=@kazura/komekko
[license]: https://img.shields.io/badge/License-MIT-blue
[license-url]: https://github.com/kazura233/kazurajs/blob/master/LICENSE

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![license][license]][license-url]

# @kazura/komekko

Komekko 是一个基于 Rollup 和 esbuild 的构建工具，用于构建 TypeScript/JavaScript 库，支持多种模块格式和高级构建选项。

## 特性

- 支持多种模块格式（ESM、CommonJS、UMD、IIFE）
- 支持 TypeScript 声明文件生成
- 支持代码混淆
- 支持源码映射
- 支持代码压缩
- 支持别名和路径替换
- 支持外部依赖配置
- 支持多入口构建
- 支持自定义 Rollup 配置
- 支持命令行工具

## 安装

```bash
npm install @kazura/komekko --save-dev
```

## 使用方法

### 基本配置

在项目根目录创建 `komekko.config.ts` 文件：

```typescript
import { defineConfig } from '@kazura/komekko'

export default defineConfig({
  // 构建目标
  target: 'esnext',
  // 源码目录
  rootDir: './src',
  // 输出目录
  outDir: './dist',
  // 是否生成源码映射
  sourcemap: true,
  // 是否压缩代码
  minify: true,
  // 是否生成类型声明文件
  declaration: true,
  // 构建入口
  entries: [
    {
      input: 'index.ts',
      outFileName: 'index',
      formats: ['esm', 'cjs'],
      declaration: true,
    },
  ],
})
```

### 命令行使用

```bash
# 构建项目
komekko

# 指定构建目录
komekko ./src

# 启用源码映射
komekko --sourcemap

# 启用代码压缩
komekko --minify
```

### 高级配置

```typescript
import { defineConfig } from '@kazura/komekko'

export default defineConfig({
  // 别名配置
  alias: {
    '@': './src',
  },
  // 环境变量替换
  replace: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  // 外部依赖
  external: ['react', 'react-dom'],
  // 自定义 Rollup 配置
  rollupOptions: {
    output: {
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
  },
  // Rollup 插件配置
  rollupPluginsOptions: {
    // 替换插件配置
    replaceOptions: {
      preventAssignment: true,
    },
    // 别名插件配置
    aliasOptions: {
      entries: [{ find: '@', replacement: './src' }],
    },
    // Node 解析插件配置
    nodeResolveOptions: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    // JSON 插件配置
    jsonOptions: {
      compact: true,
    },
    // esbuild 插件配置
    esbuildOptions: {
      target: 'esnext',
      minify: true,
    },
    // CommonJS 插件配置
    commonJSOptions: {
      include: /node_modules/,
    },
    // 类型声明文件插件配置
    dtsOptions: {
      compilerOptions: {
        moduleResolution: 'node',
      },
    },
    // 混淆插件配置
    obfuscatorOptions: {
      compact: true,
      controlFlowFlattening: true,
    },
  },
})
```

### 多配置构建

```typescript
import { defineConfig } from '@kazura/komekko'

export default defineConfig([
  // 主包配置
  {
    entries: [
      {
        input: 'index.ts',
        outFileName: 'index',
        formats: ['esm', 'cjs'],
        declaration: true,
      },
    ],
  },
  // 子包配置
  {
    entries: [
      {
        input: 'sub/index.ts',
        outFileName: 'sub/index',
        formats: ['esm', 'cjs'],
        declaration: true,
      },
    ],
  },
])
```

## API 参考

### defineConfig

```typescript
function defineConfig(options: KomekkoOptions): KomekkoOptions
function defineConfig(options: KomekkoOptions[]): KomekkoOptions[]
```

定义构建配置。

参数：

- `options`: 构建配置对象或配置对象数组

返回值：

- 构建配置对象或配置对象数组

### KomekkoOptions

构建配置选项。

#### target

```typescript
target: string
```

构建目标，默认为 `'esnext'`。

#### rootDir

```typescript
rootDir: string
```

源码目录，默认为 `'./'`。

#### outDir

```typescript
outDir: string
```

输出目录，默认为 `'./dist'`。

#### sourcemap

```typescript
sourcemap: boolean
```

是否生成源码映射，默认为 `false`。

#### minify

```typescript
minify: boolean
```

是否压缩代码，默认为 `false`。

#### declaration

```typescript
declaration: boolean
```

是否生成类型声明文件，默认为 `false`。

#### alias

```typescript
alias: { [find: string]: string }
```

别名配置。

#### replace

```typescript
replace: { [key: string]: string }
```

环境变量替换配置。

#### external

```typescript
external: string[]
```

外部依赖配置。

#### rollupOptions

```typescript
rollupOptions: RollupOptions
```

自定义 Rollup 配置。

#### rollupPluginsOptions

```typescript
rollupPluginsOptions: {
  replaceOptions?: ReplaceOptions
  aliasOptions?: AliasOptions
  nodeResolveOptions?: NodeResolveOptions
  jsonOptions?: JsonOptions
  esbuildOptions?: EsbuildOptions
  commonJSOptions?: CommonJSOptions
  dtsOptions?: DtsOptions
  obfuscatorOptions?: ObfuscatorOptions
}
```

Rollup 插件配置。

### EntryOptions

构建入口选项。

#### input

```typescript
input: string
```

入口文件路径。

#### outFileName

```typescript
outFileName: string
```

输出文件名。

#### formats

```typescript
formats: ('esm' | 'cjs' | 'umd' | 'iife')[]
```

输出格式。

#### declaration

```typescript
declaration: boolean
```

是否生成类型声明文件。

## 注意事项

1. 确保安装了所有必要的依赖
2. 注意配置文件的路径和格式
3. 合理设置外部依赖
4. 注意构建目标和兼容性
5. 合理使用插件配置

## 示例

### 构建 React 组件库

```typescript
import { defineConfig } from '@kazura/komekko'

export default defineConfig({
  target: 'esnext',
  rootDir: './src',
  outDir: './dist',
  sourcemap: true,
  minify: true,
  declaration: true,
  external: ['react', 'react-dom'],
  alias: {
    '@': './src',
  },
  entries: [
    {
      input: 'index.ts',
      outFileName: 'index',
      formats: ['esm', 'cjs', 'umd'],
      declaration: true,
    },
  ],
  rollupOptions: {
    output: {
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
  },
})
```

### 构建多包项目

```typescript
import { defineConfig } from '@kazura/komekko'

export default defineConfig([
  // 核心包
  {
    entries: [
      {
        input: 'core/index.ts',
        outFileName: 'core/index',
        formats: ['esm', 'cjs'],
        declaration: true,
      },
    ],
  },
  // 工具包
  {
    entries: [
      {
        input: 'utils/index.ts',
        outFileName: 'utils/index',
        formats: ['esm', 'cjs'],
        declaration: true,
      },
    ],
  },
  // 插件包
  {
    entries: [
      {
        input: 'plugins/index.ts',
        outFileName: 'plugins/index',
        formats: ['esm', 'cjs'],
        declaration: true,
      },
    ],
  },
])
```

## 文档

更多详细信息请查看 [文档](https://kazura233.github.io/kazurajs/docs/komekko)。

## 许可证

MIT

## Author

👤 **kazura233**

- Website: https://github.com/kazura233
- Github: [@kazura233](https://github.com/kazura233)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/kazura233/kazurajs/issues).

## Show your support

Give a ⭐️ if this project helped you!
