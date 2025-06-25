import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '@health/health.controller';
import { HealthService } from '@health/health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthService;

  const mockService = {
    checkHealth: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: HealthService, useValue: mockService }],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate to healthService.checkHealth()', async () => {
    const result = { status: 'ok' };
    mockService.checkHealth.mockResolvedValue(result);

    const response = await controller.check();

    expect(response).toEqual(result);
    expect(mockService.checkHealth).toHaveBeenCalled();
  });
});
