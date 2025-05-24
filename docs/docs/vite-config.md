---
sidebar_position: 22
---

# Vite Config

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

#### getContext

```typescript
static getContext(): Config | null
```

获取全局配置上下文。

返回值：

- 配置实例或 null

#### setContext

```typescript
static setContext(context: Config): void
```

设置全局配置上下文。

参数：

- `context`: 配置实例

#### clearContext

```typescript
static clearContext(): void
```

清除全局配置上下文。

## 注意事项

1. 使用 TypeScript 来获得更好的类型提示
2. 环境变量名称区分大小写
3. 使用类型转换方法时注意默认值
4. 全局上下文是单例的，注意及时清理
5. 环境变量值应该是字符串类型

## 示例

### 应用配置

```typescript
import { Config, ConfigContextHolder } from '@kazura/vite-config'

// 创建配置实例
const config = new Config(import.meta.env)

// 设置全局上下文
ConfigContextHolder.setContext(config)

// 获取应用配置
function getAppConfig() {
  return {
    apiUrl: config.getStringFromEnv('API_URL'),
    port: config.getNumberFromEnv('PORT'),
    debug: config.getBooleanFromEnv('DEBUG'),
    environment: config.getMode(),
  }
}
```

### 环境适配

```typescript
import { Config } from '@kazura/vite-config'

const config = new Config(import.meta.env)

function setupEnvironment() {
  if (config.isDevelopment()) {
    // 开发环境配置
    console.log('Development mode')
    console.log('API URL:', config.getStringFromEnv('API_URL'))
  } else if (config.isProduction()) {
    // 生产环境配置
    console.log('Production mode')
    console.log('API URL:', config.getStringFromEnv('API_URL'))
  }
}
```

### 服务配置

```typescript
import { Config } from '@kazura/vite-config'

const config = new Config(import.meta.env)

function getServerConfig() {
  return {
    host: config.getStringFromEnv('HOST'),
    port: config.getNumberFromEnv('PORT'),
    ssl: config.getBooleanFromEnv('SSL'),
    baseUrl: config.getBaseUrl(),
  }
}
```

### 特性开关

```typescript
import { Config } from '@kazura/vite-config'

const config = new Config(import.meta.env)

function isFeatureEnabled(featureName: string): boolean {
  return config.getBooleanFromEnv(`FEATURE_${featureName.toUpperCase()}`)
}

// 使用示例
if (isFeatureEnabled('newUI')) {
  // 启用新 UI
}
```
