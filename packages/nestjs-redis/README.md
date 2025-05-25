[npm]: https://img.shields.io/npm/v/@kazura/nestjs-redis
[npm-url]: https://www.npmjs.com/package/@kazura/nestjs-redis
[size]: https://packagephobia.now.sh/badge?p=@kazura/nestjs-redis
[size-url]: https://packagephobia.now.sh/result?p=@kazura/nestjs-redis
[license]: https://img.shields.io/badge/License-MIT-blue
[license-url]: https://github.com/kazura233/kazurajs/blob/master/LICENSE

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![license][license]][license-url]

# @kazura/nestjs-redis

NestJS Redis 是一个用于 NestJS 框架的 Redis 模块，它提供了对 Redis 的简单集成和配置。

## 特性

- 支持多个 Redis 客户端
- 支持同步和异步配置
- 提供完整的 TypeScript 类型支持
- 基于 ioredis 客户端
- 支持自定义客户端配置

## 安装

```bash
npm install @kazura/nestjs-redis
```

## 使用方法

### 基本用法

```typescript
import { Module } from '@nestjs/common'
import { RedisModule } from '@kazura/nestjs-redis'

@Module({
  imports: [
    RedisModule.register({
      host: 'localhost',
      port: 6379,
    }),
  ],
})
export class AppModule {}
```

### 使用多个 Redis 客户端

```typescript
import { Module } from '@nestjs/common'
import { RedisModule } from '@kazura/nestjs-redis'

@Module({
  imports: [
    RedisModule.register([
      {
        name: 'client1',
        host: 'localhost',
        port: 6379,
      },
      {
        name: 'client2',
        host: 'localhost',
        port: 6380,
      },
    ]),
  ],
})
export class AppModule {}
```

### 异步配置

```typescript
import { Module } from '@nestjs/common'
import { RedisModule } from '@kazura/nestjs-redis'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## API 参考

### RedisModule

#### register

```typescript
static register(options: RedisModuleOptions | RedisModuleOptions[]): DynamicModule
```

注册 Redis 模块。

参数：

- `options`: Redis 配置选项或配置选项数组

返回值：

- 动态模块

#### forRootAsync

```typescript
static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule
```

异步注册 Redis 模块。

参数：

- `options`: 异步配置选项
  - `imports`: 导入的模块
  - `useClass`: 配置工厂类
  - `useFactory`: 配置工厂函数
  - `inject`: 注入的依赖

返回值：

- 动态模块

### RedisService

#### getClient

```typescript
getClient(name?: string): Redis
```

获取 Redis 客户端实例。

参数：

- `name`: 客户端名称（可选）

返回值：

- Redis 客户端实例

#### getClients

```typescript
getClients(): Map<string, Redis>
```

获取所有 Redis 客户端实例。

返回值：

- Redis 客户端实例映射

## 类型定义

### RedisModuleOptions

```typescript
interface RedisModuleOptions extends RedisOptions {
  name?: string
  url?: string
  onClientReady?: (client: Redis) => void
}
```

### RedisModuleAsyncOptions

```typescript
interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useClass?: Type<RedisOptionsFactory>
  useFactory?: (
    ...args: any[]
  ) =>
    | RedisModuleOptions
    | RedisModuleOptions[]
    | Promise<RedisModuleOptions>
    | Promise<RedisModuleOptions[]>
  inject?: any[]
}
```

## 注意事项

1. 确保 Redis 服务器已经启动并可访问
2. 在生产环境中使用环境变量配置 Redis 连接信息
3. 使用多个客户端时，需要为每个客户端指定唯一的名称
4. 建议使用异步配置来管理敏感信息

## 示例

### 在服务中使用 Redis

```typescript
import { Injectable } from '@nestjs/common'
import { RedisService } from '@kazura/nestjs-redis'

@Injectable()
export class UserService {
  constructor(private readonly redisService: RedisService) {}

  async getUserCache(userId: string) {
    const redis = this.redisService.getClient()
    return redis.get(`user:${userId}`)
  }

  async setUserCache(userId: string, data: any) {
    const redis = this.redisService.getClient()
    await redis.set(`user:${userId}`, JSON.stringify(data))
  }
}
```

### 使用多个 Redis 客户端

```typescript
import { Injectable } from '@nestjs/common'
import { RedisService } from '@kazura/nestjs-redis'

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}

  async getCache(key: string) {
    const cacheClient = this.redisService.getClient('cache')
    return cacheClient.get(key)
  }

  async getSession(key: string) {
    const sessionClient = this.redisService.getClient('session')
    return sessionClient.get(key)
  }
}
```

### 使用异步配置

```typescript
import { Module } from '@nestjs/common'
import { RedisModule } from '@kazura/nestjs-redis'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        password: configService.get('REDIS_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## 文档

更多详细信息请查看 [文档](https://kazura233.github.io/kazurajs/docs/nestjs-redis)。

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
