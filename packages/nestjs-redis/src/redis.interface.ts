import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { Redis, RedisOptions } from 'ioredis';
export interface RedisOptionsFactory {
  createRedisModuleOptions(): Promise<RedisModuleOptions> | RedisModuleOptions;
}
export interface RedisModuleOptions extends RedisOptions {
  name?: string;
  url?: string;
  onClientReady?(client: Redis): void;
}

export interface RedisModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useClass?: Type<RedisOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) =>
    | RedisModuleOptions
    | RedisModuleOptions[]
    | Promise<RedisModuleOptions>
    | Promise<RedisModuleOptions[]>;
  inject?: any[];
}
