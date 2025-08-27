import { RouteNames } from '@common/route-names';
import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Query,
  HttpStatus,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { UsersService } from '@users/users.service';
import { ResponseUtil } from '@common/helpers/response.utils';
import { Auth } from '@auth/decorator/auth.decorator';
import { AuthType, RoleType } from '@common/enums/auth-type.enum';
import { User } from '@common/decorators/user.decorator';
import { Roles } from '@auth/decorator/roles.decorator';
import {
  UserProfileApiResponse,
  UpdateUserProfileDto,
} from '@users/dto/user-profile.dto';
import {
  AddUsersDto,
  UserListQueryDto,
  UserListApiResponse,
  DisableUserDto,
  UserIdDto,
} from '@users/dto/user-management.dto';
import {
  UserRankingApiResponse,
  UserAnalyticsApiResponse,
  AdminDashboardAnalyticsApiResponse,
} from '@users/dto/user-ranking.dto';
import { ApiResponse as apiResponse } from '@common/dto/api-response';
import { OptionalParseIntPipe } from '@common/pipes/optional-parse-int.pipe';

@Controller(RouteNames.USERS)
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(RouteNames.USERS_PROFILE)
  @Auth(AuthType.JWT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'API to get user profile with enrolled courses' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile retrieved successfully',
    type: UserProfileApiResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async getUserProfile(
    @User('id') userId: string,
  ): Promise<UserProfileApiResponse> {
    const response = await this.usersService.getUserProfile(userId);
    return ResponseUtil.success(
      response,
      'User profile retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Patch(RouteNames.USERS_PROFILE)
  @Auth(AuthType.JWT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'API to update user profile (full_name, gender, enrolled courses)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile updated successfully',
    type: UserProfileApiResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid course IDs provided.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async updateUserProfile(
    @User('id') userId: string,
    @Body() updateData: UpdateUserProfileDto,
  ): Promise<UserProfileApiResponse> {
    const response = await this.usersService.updateUserProfile(
      userId,
      updateData,
    );
    return ResponseUtil.success(
      response,
      'User profile updated successfully',
      HttpStatus.OK,
    );
  }

  @Post(RouteNames.USERS_ADD)
  @Auth(AuthType.JWT)
  @Roles(RoleType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'API to add multiple users by email addresses (Admin only)',
    description:
      'Add users by providing email addresses. Only emails that are not already in the database will be added.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users processed successfully',
    type: apiResponse<null>,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid email addresses or no emails provided.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Admin access required.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async addUsers(@Body() addUsersDto: AddUsersDto): Promise<apiResponse<null>> {
    await this.usersService.addUsers(addUsersDto);
    return ResponseUtil.success(
      null,
      'Users processed successfully',
      HttpStatus.OK,
    );
  }

  @Get(RouteNames.USERS_LIST)
  @Auth(AuthType.JWT)
  @Roles(RoleType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'API to get users list with filtering and pagination (Admin only)',
    description:
      'Get paginated list of users with optional filtering by search term and active status. For admin use to manage users.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users list retrieved successfully',
    type: UserListApiResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid query parameters.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Admin access required.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async getUsersList(
    @Query() query: UserListQueryDto,
  ): Promise<UserListApiResponse> {
    const response = await this.usersService.getUsersList(query);
    return ResponseUtil.success(
      response,
      'Users list retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Patch(RouteNames.USERS_DISABLE)
  @Auth(AuthType.JWT)
  @Roles(RoleType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'API to disable a user (Admin only)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User disabled successfully',
    type: apiResponse<null>,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Admin access required.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async disableUser(@Body() input: DisableUserDto): Promise<apiResponse<null>> {
    await this.usersService.disableUser(input.user_id, input.is_active);
    return ResponseUtil.success(
      null,
      `User ${input.is_active ? 'enabled' : 'disabled'} successfully`,
      HttpStatus.OK,
    );
  }

  @Delete(RouteNames.USERS_DELETE)
  @Auth(AuthType.JWT)
  @Roles(RoleType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'API to delete a user (Admin only)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully',
    type: apiResponse<null>,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Admin access required.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async deleteUser(@Body() input: UserIdDto): Promise<apiResponse<null>> {
    await this.usersService.deleteUser(input.user_id);
    return ResponseUtil.success(
      null,
      'User deleted successfully',
      HttpStatus.OK,
    );
  }

  @Get(RouteNames.USERS_RANKING)
  @Auth(AuthType.JWT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'API to get user ranking and community analytics',
    description:
      'Get user ranking information including top performers and community statistics. Shows top 10 users and current user ranking.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User ranking data retrieved successfully',
    type: UserRankingApiResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Limit number',
  })
  async getUserRanking(
    @User('id') userId: string,
    @Query('page', new OptionalParseIntPipe) page: number = 1,
    @Query('limit', new OptionalParseIntPipe) limit: number = 10,
  ): Promise<UserRankingApiResponse> {
    const response = await this.usersService.getUserRanking(userId, page, limit);
    return ResponseUtil.success(
      response,
      'User ranking data retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get(RouteNames.USERS_ANALYTICS)
  @Auth(AuthType.JWT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'API to get user personal analytics',
    description:
      'Get individual user analytics including average score, rank, and last test taken time.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User analytics data retrieved successfully',
    type: UserAnalyticsApiResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async getUserAnalytics(
    @User('id') userId: string,
  ): Promise<UserAnalyticsApiResponse> {
    const response = await this.usersService.getUserAnalytics(userId);
    return ResponseUtil.success(
      response,
      'User analytics data retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get(RouteNames.ADMIN_DASHBOARD_ANALYTICS)
  @Auth(AuthType.JWT)
  @Roles(RoleType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'API to get admin dashboard analytics',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin dashboard analytics retrieved successfully',
    type: AdminDashboardAnalyticsApiResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async adminDashboardAnalytics() {
    const response = await this.usersService.adminDashboardAnalytics();
    return ResponseUtil.success(
      response,
      'Admin dashboard analytics retrieved successfully',
      HttpStatus.OK,
    );
  }
}
