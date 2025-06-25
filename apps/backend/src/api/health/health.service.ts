import { DBService } from '@db/db.service';
import { Injectable } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { RedisHealthIndicator } from '@redis/redis.health';

@Injectable()
export class HealthService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly prisma: PrismaHealthIndicator,
    private readonly redisHealth: RedisHealthIndicator,
    private readonly db: DBService,
  ) {}

  async checkHealth(): Promise<HealthCheckResult> {
    return this.health.check([
      async () => this.http.pingCheck('google', 'https://google.com'),
      async () => this.prisma.pingCheck('database', this.db),
      async () => this.redisHealth.isHealthy('redis'),
      // () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.45 }), // Unhealthy if less than 45% disk space available.
      // () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // Unhealthy if process does have more than 150MB allocated.
    ]);
  }
}
