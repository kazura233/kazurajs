---
sidebar_position: 18
---

# NestJS Winston

NestJS Winston 是一个用于 NestJS 框架的 Winston 日志模块，它提供了对 Winston 日志库的简单集成和配置。

## 特性

- 支持 Winston 的所有功能
- 支持同步和异步配置
- 提供完整的 TypeScript 类型支持
- 支持自定义日志格式和传输
- 提供简单的日志服务接口

## 安装

```bash
npm install @kazura/nestjs-winston
```

## 使用方法

### 基本用法

```typescript
import { Module } from '@nestjs/common'
import { WinstonModule } from '@kazura/nestjs-winston'
import * as winston from 'winston'

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
      ],
    }),
  ],
})
export class AppModule {}
```

### 使用自定义实例

```typescript
import { Module } from '@nestjs/common'
import { WinstonModule } from '@kazura/nestjs-winston'
import * as winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

@Module({
  imports: [
    WinstonModule.forRoot({
      instance: logger,
    }),
  ],
})
export class AppModule {}
```

### 异步配置

```typescript
import { Module } from '@nestjs/common'
import { WinstonModule } from '@kazura/nestjs-winston'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        level: configService.get('LOG_LEVEL'),
        format: winston.format.json(),
        transports: [new winston.transports.Console()],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## API 参考

### WinstonModule

#### forRoot

```typescript
static forRoot(options: WinstonModuleOptions): DynamicModule
```

注册 Winston 模块。

参数：

- `options`: Winston 配置选项

返回值：

- 动态模块

#### forRootAsync

```typescript
static forRootAsync(options: WinstonModuleAsyncOptions): DynamicModule
```

异步注册 Winston 模块。

参数：

- `options`: 异步配置选项
  - `imports`: 导入的模块
  - `useClass`: 配置工厂类
  - `useFactory`: 配置工厂函数
  - `inject`: 注入的依赖

返回值：

- 动态模块

### WinstonService

#### getLogger

```typescript
getLogger(): Logger
```

获取 Winston 日志实例。

返回值：

- Winston 日志实例

#### error

```typescript
error(message: string, data: any): void
```

记录错误日志。

参数：

- `message`: 日志消息
- `data`: 日志数据

#### warn

```typescript
warn(message: string, data: any): void
```

记录警告日志。

参数：

- `message`: 日志消息
- `data`: 日志数据

#### info

```typescript
info(message: string, data: any): void
```

记录信息日志。

参数：

- `message`: 日志消息
- `data`: 日志数据

#### debug

```typescript
debug(message: string, data: any): void
```

记录调试日志。

参数：

- `message`: 日志消息
- `data`: 日志数据

## 类型定义

### WinstonModuleOptions

```typescript
interface WinstonModuleOptions extends LoggerOptions {
  instance?: Logger
}
```

### WinstonModuleAsyncOptions

```typescript
interface WinstonModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useClass?: Type<WinstonOptionsFactory>
  useFactory?: (...args: any[]) => Promise<WinstonModuleOptions> | WinstonModuleOptions
  inject?: any[]
}
```

## 注意事项

1. 确保在生产环境中配置适当的日志级别
2. 考虑使用文件传输来持久化日志
3. 可以使用自定义格式来满足特定的日志需求
4. 建议使用异步配置来管理日志配置

## 示例

### 在服务中使用日志

```typescript
import { Injectable } from '@nestjs/common'
import { WinstonService } from '@kazura/nestjs-winston'

@Injectable()
export class UserService {
  constructor(private readonly logger: WinstonService) {}

  async createUser(userData: any) {
    try {
      // 创建用户逻辑...
      this.logger.info('User created successfully', { userId: '123' })
    } catch (error) {
      this.logger.error('Failed to create user', { error, userData })
      throw error
    }
  }
}
```

### 使用自定义格式

```typescript
import { Module } from '@nestjs/common'
import { WinstonModule } from '@kazura/nestjs-winston'
import * as winston from 'winston'

@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ''
          }`
        })
      ),
      transports: [new winston.transports.Console()],
    }),
  ],
})
export class AppModule {}
```

### 使用多个传输

```typescript
import { Module } from '@nestjs/common'
import { WinstonModule } from '@kazura/nestjs-winston'
import * as winston from 'winston'

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: 'info',
        }),
        new winston.transports.File({
          filename: 'error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'combined.log',
        }),
      ],
    }),
  ],
})
export class AppModule {}
```

### 使用异步配置

```typescript
import { Module } from '@nestjs/common'
import { WinstonModule } from '@kazura/nestjs-winston'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as winston from 'winston'

@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        level: configService.get('LOG_LEVEL', 'info'),
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        transports: [
          new winston.transports.Console(),
          new winston.transports.File({
            filename: configService.get('LOG_FILE', 'app.log'),
          }),
        ],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```
