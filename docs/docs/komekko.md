---
sidebar_position: 25
---

# Komekko

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
npm install komekko --save-dev
```

## 使用方法

### 基本配置

在项目根目录创建 `komekko.config.ts` 文件：

```typescript
import { defineConfig } from 'komekko'

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
import { defineConfig } from 'komekko'

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
import { defineConfig } from 'komekko'

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
replace: { [str: string]: string }
```

环境变量替换配置。

#### external

```typescript
external: (string | RegExp)[]
```

外部依赖配置。

#### entries

```typescript
entries: BuildEntry[]
```

构建入口配置。

#### rollupOptions

```typescript
rollupOptions: RollupOptions
```

自定义 Rollup 配置。

#### rollupPluginsOptions

```typescript
rollupPluginsOptions: Partial<RollupPluginsOptions>
```

Rollup 插件配置。

### BuildEntry

构建入口配置。

#### input

```typescript
input: string
```

相对于 `rootDir` 的文件路径。

#### outFileName

```typescript
outFileName: string | ((input: string, format: ModuleFormat) => string)
```

相对于 `outDir` 的文件路径。

#### declaration

```typescript
declaration?: boolean
```

是否生成类型声明文件。

#### formats

```typescript
formats: ModuleFormat[]
```

构建格式列表。

## 注意事项

1. 确保已安装 TypeScript 作为开发依赖
2. 注意配置正确的构建目标和模块格式
3. 合理使用外部依赖配置
4. 注意代码混淆的性能影响
5. 及时更新依赖版本

## 示例

### React 组件库

```typescript
import { defineConfig } from 'komekko'

export default defineConfig({
  target: 'esnext',
  rootDir: './src',
  outDir: './dist',
  sourcemap: true,
  minify: true,
  declaration: true,
  external: ['react', 'react-dom'],
  entries: [
    {
      input: 'index.ts',
      outFileName: 'index',
      formats: ['esm', 'cjs'],
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

### Node.js 工具库

```typescript
import { defineConfig } from 'komekko'

export default defineConfig({
  target: 'node16',
  rootDir: './src',
  outDir: './dist',
  sourcemap: true,
  minify: true,
  declaration: true,
  entries: [
    {
      input: 'index.ts',
      outFileName: 'index',
      formats: ['cjs', 'esm'],
      declaration: true,
    },
  ],
  rollupPluginsOptions: {
    nodeResolveOptions: {
      extensions: ['.ts', '.js'],
    },
  },
})
```

### 浏览器工具库

```typescript
import { defineConfig } from 'komekko'

export default defineConfig({
  target: 'es2015',
  rootDir: './src',
  outDir: './dist',
  sourcemap: true,
  minify: true,
  entries: [
    {
      input: 'index.ts',
      outFileName: 'index',
      formats: ['iife', 'umd'],
    },
  ],
  rollupOptions: {
    output: {
      name: 'MyLib',
    },
  },
})
```

### 多包构建

```typescript
import { defineConfig } from 'komekko'

export default defineConfig([
  // 主包
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
  // 子包 A
  {
    entries: [
      {
        input: 'a/index.ts',
        outFileName: 'a/index',
        formats: ['esm', 'cjs'],
        declaration: true,
      },
    ],
  },
  // 子包 B
  {
    entries: [
      {
        input: 'b/index.ts',
        outFileName: 'b/index',
        formats: ['esm', 'cjs'],
        declaration: true,
      },
    ],
  },
])
```

### 混淆构建

```typescript
import { defineConfig } from 'komekko'

export default defineConfig({
  target: 'es2015',
  rootDir: './src',
  outDir: './dist',
  minify: true,
  entries: [
    {
      input: 'index.ts',
      outFileName: 'index',
      formats: ['iife'],
    },
  ],
  rollupPluginsOptions: {
    obfuscatorOptions: {
      compact: true,
      controlFlowFlattening: true,
      deadCodeInjection: true,
      debugProtection: true,
      debugProtectionInterval: true,
      disableConsoleOutput: true,
      identifierNamesGenerator: 'hexadecimal',
      log: false,
      numbersToExpressions: true,
      renameGlobals: false,
      selfDefending: true,
      simplify: true,
      splitStrings: true,
      stringArray: true,
      stringArrayCallsTransform: true,
      stringArrayEncoding: ['base64'],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 2,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersParametersMaxCount: 4,
      stringArrayWrappersType: 'function',
      stringArrayThreshold: 0.75,
      transformObjectKeys: true,
      unicodeEscapeSequence: false,
    },
  },
})
```
