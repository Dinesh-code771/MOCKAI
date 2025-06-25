import { EnvConfig } from '@config/env.config';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const RedisProvider = {
  provide: REDIS_CLIENT,
  useFactory: (configService: ConfigService<EnvConfig>) => {
    const redisHost = configService.get<string>('REDIS_HOST');
    const redisPort = configService.get<number>('REDIS_PORT');
    const redisPassword = configService.get<string>('REDIS_PASSWORD');
    const redisTlsEnabled = configService.get<boolean>('REDIS_TLS_ENABLED');

    return new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      tls: redisTlsEnabled ? {} : undefined,
      maxRetriesPerRequest: null,
    });
  },
  inject: [ConfigService],
};
