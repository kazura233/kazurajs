import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  WinstonModuleAsyncOptions,
  WinstonModuleOptions,
} from './winston.interfaces';
import {
  createWinstonAsyncProviders,
  createWinstonProviders,
} from './winston.providers';
import { WinstonService } from './winston.service';

@Global()
@Module({
  providers: [WinstonService],
  exports: [WinstonService],
})
export class WinstonCoreModule {
  public static forRoot(options: WinstonModuleOptions): DynamicModule {
    const providers = createWinstonProviders(options);

    return {
      module: WinstonCoreModule,
      providers: providers,
      exports: [...providers, WinstonService],
    };
  }

  public static forRootAsync(
    options: WinstonModuleAsyncOptions,
  ): DynamicModule {
    const providers = createWinstonAsyncProviders(options);

    return {
      module: WinstonCoreModule,
      imports: options.imports,
      providers: providers,
      exports: [...providers, WinstonService],
    };
  }
}
