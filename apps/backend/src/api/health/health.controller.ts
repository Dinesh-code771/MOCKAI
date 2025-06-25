import { User } from '@common/decorators/user.decorator';
import { AuthType } from '@common/enums/auth-type.enum';
import { RouteNames } from '@common/route-names';
import { UserInfo } from '@common/types/auth.types';
import { HealthService } from '@health/health.service';
import { Controller, Get, Render } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';

@Controller(RouteNames.HEALTH)
@ApiTags('Health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Check the health of the service',
    description: 'Health check endpoint',
  })
  async check() {
    return this.healthService.checkHealth();
  }

  @Get(RouteNames.HEALTH_UI)
  @Render('health') // Renders views/health.pug
  async showHealth(@User() user: UserInfo) {
    const raw = await this.healthService.checkHealth();
    return {
      status: raw.status,
      info: raw.info,
      user: user.full_name,
    };
  }
}
