import { EnvConfig } from '@config/env.config';
import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private logger: WinstonLogger;

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    const environment = this.configService.get<string>('NODE_ENV');
    const isProduction = environment === 'production';

    this.logger = createLogger({
      level: isProduction ? 'warn' : 'debug',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message, context }) => {
          return `${timestamp} [${level}] [${context || 'App'}]: ${message}`;
        })
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ timestamp, level, message, context }) => {
              return `${timestamp} [${level}] [${context || 'App'}]: ${message}`;
            })
          ),
        }),
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: isProduction ? '30d' : '1d',
        }),
      ],
    });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error({ message, trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn({ message, context });
  }

  log(message: string, context?: string) {
    this.logger.info({ message, context });
  }

  debug(message: string, context?: string) {
    this.logger.debug({ message, context });
  }

  http(message: string, context?: string) {
    this.logger.info({ message, context: context || 'HTTP' });
  }
}
