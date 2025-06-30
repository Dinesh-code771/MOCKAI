import { RouteNames } from '@common/route-names';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { StaticDataService } from './static-data.service';
import { ResponseUtil } from '@common/helpers/response.utils';
import { Auth } from '@auth/decorator/auth.decorator';
import { AuthType } from '@common/enums/auth-type.enum';
import { CoursesApiResponse } from './dto/course.dto';

@Controller(RouteNames.STATIC_DATA)
@ApiTags('Static Data')
export class StaticDataController {
  constructor(private readonly staticDataService: StaticDataService) {}

  @Get(RouteNames.STATIC_DATA_COURSES)
  @Auth(AuthType.NONE)
  @ApiOperation({ summary: 'API to get all active courses' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Active courses retrieved successfully',
    type: CoursesApiResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async getActiveCourses(): Promise<CoursesApiResponse> {
    const response = await this.staticDataService.getActiveCourses();
    return ResponseUtil.success(
      response,
      'Active courses retrieved successfully',
      HttpStatus.OK,
    );
  }
}
