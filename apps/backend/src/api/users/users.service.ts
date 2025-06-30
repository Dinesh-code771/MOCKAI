import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersDBService } from '@db/users/users-db.service';
import { UsersTransform } from '@users/users.transform';
import {
  UserProfileResponseDto,
  UpdateUserProfileDto,
} from '@users/dto/user-profile.dto';
import { APP_STRINGS } from '@common/strings';
import { Gender } from '@users/enum/gender.enum';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersDBService: UsersDBService,
    private readonly usersTransform: UsersTransform,
  ) {}

  async getUserProfile(userId: string): Promise<UserProfileResponseDto> {
    const user = await this.usersDBService.getUserProfileWithCourses(userId);

    if (!user) {
      throw new NotFoundException(APP_STRINGS.api_errors.auth.user_not_found);
    }

    return this.usersTransform.transformToUserProfileResponse(user);
  }

  async updateUserProfile(
    userId: string,
    updateData: UpdateUserProfileDto,
  ): Promise<UserProfileResponseDto> {
    // Validate courses if provided
    if (updateData.enrolled_courses && updateData.enrolled_courses.length > 0) {
      const courseValidation = await this.usersDBService.validateCoursesExist(
        updateData.enrolled_courses,
      );

      if (courseValidation.invalidCourseIds.length > 0) {
        throw new BadRequestException(
          `Invalid course IDs: ${courseValidation.invalidCourseIds.join(', ')}`,
        );
      }
    }

    // Prepare update data for database
    const dbUpdateData: {
      full_name?: string;
      gender?: Gender;
      date_of_birth?: string;
    } = {};

    if (updateData.full_name !== undefined) {
      dbUpdateData.full_name = updateData.full_name;
    }

    if (updateData.gender !== undefined) {
      dbUpdateData.gender = updateData.gender;
    }

    if (updateData.date_of_birth !== undefined) {
      dbUpdateData.date_of_birth = updateData.date_of_birth;
    }

    // Update user profile
    const updatedUser = await this.usersDBService.updateUserProfileWithCourses(
      userId,
      dbUpdateData,
      updateData.enrolled_courses,
    );

    if (!updatedUser) {
      throw new NotFoundException(APP_STRINGS.api_errors.auth.user_not_found);
    }

    return this.usersTransform.transformToUserProfileResponse(updatedUser);
  }
}
