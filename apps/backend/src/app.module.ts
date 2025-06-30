import { BackgroundModule } from '@bg/background.module';
import { DEFAULT_JOB_OPTIONS, QueuePrefix } from '@bg/constants/job.constant';
import { EnvConfigModule } from '@config/env-config.module';
import { DBModule } from '@db/db.module';
import { HealthModule } from '@health/health.module';
import { HttpLoggingInterceptor } from '@interceptors/logging.interceptor';
import { TransformInterceptor } from '@interceptors/transform.interceptor';
import { LoggerModule } from '@logger/logger.module';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from '@redis/redis.module';
import { REDIS_CLIENT } from '@redis/redis.provider';
import { Redis } from 'ioredis';
import { ErrorHandlerService } from '@common/services/error-handler.service';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '@config/env.config';
import { JwtInterceptor } from '@interceptors/jwt.interceptor';
import { CookieAuthMiddleware } from '@middlewares/cookies.middleware';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '@email/email.module';
import { MediaUploadModule } from '@media-upload/media-upload.module';
import { AuthModule } from '@auth/auth.module';
import { StaticDataModule } from '@static-data/static-data.module';
import { UsersModule } from '@users/users.module';
import { CustomJwtService } from '@common/services/jwt.service';

const configService = new ConfigService<EnvConfig>();

// Queue module
const queueModule = BullModule.forRootAsync({
  imports: [RedisModule],
  useFactory: (redisClient: Redis) => {
    Logger.log(`Connecting to Redis using predefined client`);
    return {
      prefix: QueuePrefix.SYSTEM, // For grouping queues
      connection: redisClient.options,
      defaultJobOptions: DEFAULT_JOB_OPTIONS,
    };
  },
  inject: [REDIS_CLIENT],
});

// Rate Limiting
const rateLimit = ThrottlerModule.forRoot([
  {
    name: 'short',
    ttl: 1 * 60, // Time to live in seconds (1 minute)
    limit: 100, // Maximum number of requests within the ttl
  },
  {
    name: 'medium',
    ttl: 5 * 60, // 5 minutes
    limit: 200,
  },
  {
    name: 'long',
    ttl: 30 * 60, // 30 minutes
    limit: 500,
  },
  {
    name: 'very-long',
    ttl: 60 * 60, // 1 hour
    limit: 1000,
  },
]);

// Cache Module
const cacheModule = CacheModule.registerAsync({
  useFactory: async () => {
    const store = await redisStore({
      socket: {
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
      },
    });

    return {
      store: store as unknown as CacheStore,
      ttl: 5 * 60000, // Default - 5 minutes (milliseconds)
    };
  },
  isGlobal: true,
});

@Module({
  imports: [
    JwtModule.register({}),
    rateLimit,
    cacheModule,
    EnvConfigModule,
    LoggerModule,
    RedisModule,
    DBModule,
    // Background Workers
    queueModule,
    BackgroundModule,
    // APIs
    HealthModule,
    EmailModule,
    MediaUploadModule,
    AuthModule,
    StaticDataModule,
    UsersModule,
  ],
  providers: [
    CustomJwtService,
    ErrorHandlerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: JwtInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CookieAuthMiddleware).forRoutes('*');
  }
}
