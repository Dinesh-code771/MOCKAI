import { RouteNames } from '@common/route-names';
import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { StaticDataService } from './static-data.service';
import { ResponseUtil } from '@common/helpers/response.utils';
import { Auth } from '@auth/decorator/auth.decorator';
import { AuthType, RoleType } from '@common/enums/auth-type.enum';
import { AddCourseRequestDto, CoursesApiResponse } from '@static-data/dto/course.dto';
import { Roles } from '@auth/decorator/roles.decorator';

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

  @Post(RouteNames.STATIC_DATA_COURSES)
  @ApiBearerAuth()
  @Auth(AuthType.JWT)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'API to add a course' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Course added successfully',
    type: CoursesApiResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Course already exists',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async addCourse(@Body() body: AddCourseRequestDto): Promise<CoursesApiResponse> {
    const response = await this.staticDataService.addCourse(body.course);
    return ResponseUtil.success(response, 'Course added successfully', HttpStatus.OK);
  }
}
