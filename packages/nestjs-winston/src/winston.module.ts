import { DynamicModule, Module } from '@nestjs/common';
import {
  WinstonModuleAsyncOptions,
  WinstonModuleOptions,
} from './winston.interfaces';
import { WinstonCoreModule } from './winston-core.module';

@Module({})
export class WinstonModule {
  public static forRoot(options: WinstonModuleOptions): DynamicModule {
    return {
      module: WinstonModule,
      imports: [WinstonCoreModule.forRoot(options)],
    };
  }

  public static forRootAsync(
    options: WinstonModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: WinstonModule,
      imports: [WinstonCoreModule.forRootAsync(options)],
    };
  }
}
