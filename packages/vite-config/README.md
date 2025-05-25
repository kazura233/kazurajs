[npm]: https://img.shields.io/npm/v/@kazura/vite-config
[npm-url]: https://www.npmjs.com/package/@kazura/vite-config
[size]: https://packagephobia.now.sh/badge?p=@kazura/vite-config
[size-url]: https://packagephobia.now.sh/result?p=@kazura/vite-config
[license]: https://img.shields.io/badge/License-MIT-blue
[license-url]: https://github.com/kazura233/kazurajs/blob/master/LICENSE

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![license][license]][license-url]

# @kazura/vite-config

Vite Config 是一个用于管理 Vite 环境变量的工具包，提供了类型安全的环境变量访问和类型转换功能。

## 特性

- 提供类型安全的环境变量访问
- 支持环境变量类型转换
- 支持环境变量上下文管理
- 提供环境状态检查功能
- 类型安全的 API

## 安装

```bash
npm install @kazura/vite-config
```

## 使用方法

### 基本使用

```typescript
import { Config, ConfigContextHolder } from '@kazura/vite-config'

// 创建配置实例
const config = new Config(import.meta.env)

// 设置全局上下文
ConfigContextHolder.setContext(config)

// 获取全局上下文
const globalConfig = ConfigContextHolder.getContext()

// 清除全局上下文
ConfigContextHolder.clearContext()
```

### 环境状态检查

```typescript
import { Config } from '@kazura/vite-config'

const config = new Config(import.meta.env)

// 检查是否为开发环境
if (config.isDevelopment()) {
  console.log('Running in development mode')
}

// 检查是否为生产环境
if (config.isProduction()) {
  console.log('Running in production mode')
}

// 检查是否为服务端渲染
if (config.isServerSideRendering()) {
  console.log('Running in SSR mode')
}

// 检查当前模式
if (config.isModeEqualTo('test')) {
  console.log('Running in test mode')
}
```

### 环境变量访问

```typescript
import { Config } from '@kazura/vite-config'

const config = new Config(import.meta.env)

// 获取基础 URL
const baseUrl = config.getBaseUrl()

// 获取当前模式
const mode = config.getMode()

// 获取自定义环境变量
const apiKey = config.get('API_KEY')

// 获取字符串类型的环境变量
const apiUrl = config.getStringFromEnv('API_URL')

// 获取数字类型的环境变量
const port = config.getNumberFromEnv('PORT')

// 获取布尔类型的环境变量
const debug = config.getBooleanFromEnv('DEBUG')
```

## API 参考

### Config

#### 构造函数

```typescript
constructor(env: ImportMetaEnv)
```

创建一个 Config 实例。

参数：

- `env`: Vite 环境变量对象

#### isDevelopment

```typescript
isDevelopment(): boolean
```

检查是否为开发环境。

返回值：

- 如果是开发环境则返回 true，否则返回 false

#### isProduction

```typescript
isProduction(): boolean
```

检查是否为生产环境。

返回值：

- 如果是生产环境则返回 true，否则返回 false

#### isServerSideRendering

```typescript
isServerSideRendering(): boolean
```

检查是否为服务端渲染。

返回值：

- 如果是服务端渲染则返回 true，否则返回 false

#### getBaseUrl

```typescript
getBaseUrl(): string
```

获取基础 URL。

返回值：

- 基础 URL 字符串

#### getMode

```typescript
getMode(): string
```

获取当前模式。

返回值：

- 当前模式字符串

#### isModeEqualTo

```typescript
isModeEqualTo(mode: string): boolean
```

检查当前模式是否等于指定模式。

参数：

- `mode`: 要比较的模式

返回值：

- 如果当前模式等于指定模式则返回 true，否则返回 false

#### get

```typescript
get(key: string): any
```

获取环境变量的值。

参数：

- `key`: 环境变量键名

返回值：

- 环境变量的值

#### getStringFromEnv

```typescript
getStringFromEnv(key: string): string
```

获取字符串类型的环境变量。

参数：

- `key`: 环境变量键名

返回值：

- 环境变量的字符串值，如果不存在则返回空字符串

#### getNumberFromEnv

```typescript
getNumberFromEnv(key: string): number
```

获取数字类型的环境变量。

参数：

- `key`: 环境变量键名

返回值：

- 环境变量的数字值，如果不存在则返回 0

#### getBooleanFromEnv

```typescript
getBooleanFromEnv(key: string): boolean
```

获取布尔类型的环境变量。

参数：

- `key`: 环境变量键名

返回值：

- 环境变量的布尔值，如果不存在则返回 false

### ConfigContextHolder

#### setContext

```typescript
static setContext(config: Config): void
```

设置全局配置上下文。

参数：

- `config`: Config 实例

#### getContext

```typescript
static getContext(): Config
```

获取全局配置上下文。

返回值：

- Config 实例

#### clearContext

```typescript
static clearContext(): void
```

清除全局配置上下文。

## 注意事项

1. 确保在使用环境变量之前正确配置了 Vite
2. 使用 TypeScript 来获得更好的类型提示
3. 环境变量名称应该使用大写字母和下划线
4. 布尔类型的环境变量值应该是 'true' 或 'false'
5. 数字类型的环境变量值应该是有效的数字字符串
6. 建议使用 ConfigContextHolder 来管理全局配置
7. 在服务端渲染时注意环境变量的可用性

## 示例

### 配置 API 客户端

```typescript
import { Config } from '@kazura/vite-config'

const config = new Config(import.meta.env)

export const apiClient = {
  baseUrl: config.getStringFromEnv('API_BASE_URL'),
  timeout: config.getNumberFromEnv('API_TIMEOUT'),
  debug: config.getBooleanFromEnv('API_DEBUG'),
  apiKey: config.get('API_KEY'),
}
```

### 配置应用主题

```typescript
import { Config } from '@kazura/vite-config'

const config = new Config(import.meta.env)

export const theme = {
  primaryColor: config.getStringFromEnv('THEME_PRIMARY_COLOR'),
  fontSize: config.getNumberFromEnv('THEME_FONT_SIZE'),
  darkMode: config.getBooleanFromEnv('THEME_DARK_MODE'),
}
```

### 配置构建选项

```typescript
import { Config } from '@kazura/vite-config'

const config = new Config(import.meta.env)

export const buildOptions = {
  sourceMap: config.getBooleanFromEnv('BUILD_SOURCE_MAP'),
  minify: config.getBooleanFromEnv('BUILD_MINIFY'),
  chunkSize: config.getNumberFromEnv('BUILD_CHUNK_SIZE'),
  outputDir: config.getStringFromEnv('BUILD_OUTPUT_DIR'),
}
```

## 文档

更多详细信息请查看 [文档](https://kazura233.github.io/kazurajs/docs/vite-config)。

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
