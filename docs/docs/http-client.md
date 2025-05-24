---
sidebar_position: 19
---

# HTTP Client

HTTP Client 是一个基于 Axios 的 HTTP 客户端工具包，它提供了更简洁的 API 和更好的类型支持。

## 特性

- 基于 Axios 的 HTTP 客户端
- 支持请求和响应拦截器
- 支持配置合并
- 提供完整的 TypeScript 类型支持
- 支持自定义实例配置
- 支持导出底层 Axios 实例

## 安装

```bash
npm install @kazura/http-client
```

## 使用方法

### 基本用法

```typescript
import HttpClient from '@kazura/http-client'

// 创建 HTTP 客户端实例
const http = HttpClient.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
})

// 发送 GET 请求
const response = await http.request({
  method: 'GET',
  url: '/users',
})

// 发送 POST 请求
const data = await http.request({
  method: 'POST',
  url: '/users',
  data: {
    name: 'John',
    age: 30,
  },
})
```

### 使用拦截器

```typescript
const http = HttpClient.create()

// 添加请求拦截器
http.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
http.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
```

### 合并配置

```typescript
const http = HttpClient.create({
  baseURL: 'https://api.example.com',
})

// 合并新的配置
http.mergeConfig({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

## API 参考

### 构造函数

```typescript
constructor(config: HttpRequestConfig = {})
```

参数：

- `config`: HTTP 请求配置对象

### 静态属性

- `http: HttpStatic` - Axios 静态实例

### 静态方法

#### create

```typescript
static create(config?: HttpRequestConfig): HttpClient
```

创建一个新的 HTTP 客户端实例。

参数：

- `config`: HTTP 请求配置对象（可选）

返回值：

- HTTP 客户端实例

#### mergeConfig

```typescript
static mergeConfig(config1: HttpRequestConfig, config2: HttpRequestConfig): HttpRequestConfig
```

合并两个配置对象。

参数：

- `config1`: 第一个配置对象
- `config2`: 第二个配置对象

返回值：

- 合并后的配置对象

### 实例方法

#### request

```typescript
request<T = any, D = any, R = HttpResponse<T, D>>(config: HttpRequestConfig<D>): Promise<R>
```

发送 HTTP 请求。

参数：

- `config`: HTTP 请求配置对象
  - `method`: 请求方法
  - `url`: 请求 URL
  - `data`: 请求数据
  - `params`: URL 参数
  - 其他 Axios 配置选项...

返回值：

- Promise 对象，解析为响应数据

#### mergeConfig

```typescript
mergeConfig(config: HttpRequestConfig): void
```

合并新的配置到当前实例。合并后会重新创建 Axios 实例，但会保留原有的拦截器。

参数：

- `config`: 要合并的配置对象

#### exportHttpInstance

```typescript
exportHttpInstance(): HttpInstance
```

导出底层的 Axios 实例。

返回值：

- Axios 实例

### 属性

- `interceptors` - 请求和响应拦截器

## 类型定义

### HttpStatic

```typescript
interface HttpStatic extends AxiosStatic {}
```

Axios 静态类型。

### HttpInstance

```typescript
interface HttpInstance extends AxiosInstance {}
```

Axios 实例类型。

### HttpRequestConfig

```typescript
interface HttpRequestConfig<D = any> extends AxiosRequestConfig<D> {}
```

HTTP 请求配置类型。

### CreateHttpDefaults

```typescript
interface CreateHttpDefaults<D = any> extends CreateAxiosDefaults<D> {}
```

创建 HTTP 客户端默认配置类型。

### HttpResponse

```typescript
interface HttpResponse<T = any, D = any> extends AxiosResponse<T, D> {}
```

HTTP 响应类型。

### InternalHttpRequestConfig

```typescript
interface InternalHttpRequestConfig<D = any> extends InternalAxiosRequestConfig<D> {}
```

内部 HTTP 请求配置类型。

## 注意事项

1. 合并配置时会重新创建 Axios 实例，但会保留原有的拦截器
2. 使用 TypeScript 来获得更好的类型提示
3. 可以通过 `exportHttpInstance` 方法获取底层的 Axios 实例
4. 所有类型定义都继承自 Axios 的类型定义

## 示例

### 创建自定义实例

```typescript
import HttpClient from '@kazura/http-client'

const http = HttpClient.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 使用实例发送请求
const response = await http.request({
  method: 'GET',
  url: '/users',
})
```

### 使用拦截器处理认证

```typescript
import HttpClient from '@kazura/http-client'

const http = HttpClient.create()

// 添加认证拦截器
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 添加错误处理拦截器
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权错误
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### 动态更新配置

```typescript
import HttpClient from '@kazura/http-client'

const http = HttpClient.create({
  baseURL: 'https://api.example.com',
})

// 更新超时时间
http.mergeConfig({
  timeout: 10000,
})

// 更新请求头
http.mergeConfig({
  headers: {
    'X-Custom-Header': 'value',
  },
})
```

```

```
