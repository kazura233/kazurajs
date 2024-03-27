import { LoggerOptions, createLogger } from 'winston';
import { Provider } from '@nestjs/common';
import {
  WINSTON_MODULE_OPTIONS,
  WINSTON_MODULE_PROVIDER,
} from './winston.constants';
import {
  WinstonModuleAsyncOptions,
  WinstonModuleOptions,
  WinstonOptionsFactory,
} from './winston.interfaces';

export function createWinstonProviders(
  options: WinstonModuleOptions,
): Provider[] {
  return [
    {
      provide: WINSTON_MODULE_PROVIDER,
      useFactory: (options: WinstonModuleOptions) =>
        options.instance ?? createLogger(options),
    },
    {
      provide: WINSTON_MODULE_OPTIONS,
      useValue: options,
    },
  ];
}

export function createWinstonAsyncProviders(
  options: WinstonModuleAsyncOptions,
): Provider[] {
  const providers: Provider[] = [
    {
      provide: WINSTON_MODULE_PROVIDER,
      useFactory: (options: WinstonModuleOptions) =>
        options.instance ?? createLogger(options),
      inject: [WINSTON_MODULE_OPTIONS],
    },
  ];

  if (options.useClass) {
    providers.push(
      ...[
        {
          provide: WINSTON_MODULE_OPTIONS,
          useFactory: async (optionsFactory: WinstonOptionsFactory) =>
            await optionsFactory.createWinstonModuleOptions(),
          inject: [options.useClass],
        },
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
      ],
    );
  }

  if (options.useFactory) {
    providers.push({
      provide: WINSTON_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    });
  }

  return providers;
}
