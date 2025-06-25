import { APP_STRINGS } from '@common/strings';
import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { Redis } from 'ioredis';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private readonly redisClient: Redis) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Ping Redis to check if it’s responsive
      await this.redisClient.ping();
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        APP_STRINGS.redis.health.redis_check_failed,
        this.getStatus(key, false, { message: error.message }),
      );
    }
  }
}
