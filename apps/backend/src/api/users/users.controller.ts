import { RouteNames } from '@common/route-names';
import { Controller, Get, Patch, Body, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { UsersService } from '@users/users.service';
import { ResponseUtil } from '@common/helpers/response.utils';
import { Auth } from '@auth/decorator/auth.decorator';
import { AuthType } from '@common/enums/auth-type.enum';
import { User } from '@common/decorators/user.decorator';
import {
  UserProfileApiResponse,
  UpdateUserProfileDto,
} from '@users/dto/user-profile.dto';

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
}
