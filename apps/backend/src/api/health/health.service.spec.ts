import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from '@health/health.service';
import {
  HealthCheckService,
  HttpHealthIndicator,
  PrismaHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { RedisHealthIndicator } from '@redis/redis.health';
import { DBService } from '@db/db.service';

describe('HealthService', () => {
  let service: HealthService;

  const mockHealthCheckService = {
    check: jest.fn(),
  };
  const mockHttp = { pingCheck: jest.fn() };
  const mockPrisma = { pingCheck: jest.fn() };
  const mockRedis = { isHealthy: jest.fn() };
  const mockDB = {}; // Not called directly
  const mockDisk = { checkStorage: jest.fn() };
  const mockMemory = { checkHeap: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: HealthCheckService, useValue: mockHealthCheckService },
        { provide: HttpHealthIndicator, useValue: mockHttp },
        { provide: PrismaHealthIndicator, useValue: mockPrisma },
        { provide: RedisHealthIndicator, useValue: mockRedis },
        { provide: DBService, useValue: mockDB },
        { provide: DiskHealthIndicator, useValue: mockDisk },
        { provide: MemoryHealthIndicator, useValue: mockMemory },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call health.check with all indicators', async () => {
    const expectedResult = { status: 'ok', info: {}, error: {}, details: {} };

    mockHealthCheckService.check.mockImplementation(async (indicators) => {
      await Promise.all(indicators.map((fn) => fn()));
      return expectedResult;
    });

    await expect(service.checkHealth()).resolves.toEqual(expectedResult);
    expect(mockHttp.pingCheck).toHaveBeenCalledWith(
      'google',
      'https://google.com',
    );
    expect(mockPrisma.pingCheck).toHaveBeenCalled();
    expect(mockRedis.isHealthy).toHaveBeenCalledWith('redis');
  });
});
