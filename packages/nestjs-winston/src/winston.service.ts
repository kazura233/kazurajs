import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from './winston.constants';

@Injectable()
export class WinstonService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly winstonLogger: Logger,
  ) {}

  getLogger(): Logger {
    return this.winstonLogger;
  }

  error(message: string, data: any) {
    this.winstonLogger.error(message, { data });
  }

  warn(message: string, data: any) {
    this.winstonLogger.warn(message, { data });
  }

  info(message: string, data: any) {
    this.winstonLogger.info(message, { data });
  }

  debug(message: string, data: any) {
    this.winstonLogger.debug(message, { data });
  }
}
