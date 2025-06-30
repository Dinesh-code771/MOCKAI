import { Injectable } from '@nestjs/common';
import { CourseDto } from '@static-data/dto/course.dto';
import {
  UserProfileDto,
  UserProfileResponseDto,
} from '@users/dto/user-profile.dto';

@Injectable()
export class UsersTransform {
  transformToUserCourse(userCourse: any): CourseDto {
    return {
      id: userCourse.courses.id,
      name: userCourse.courses.name,
    };
  }

  transformToUserProfile(user: any): UserProfileDto {
    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      avatar: user.avatar,
      phone_number: user.phone_number,
      country_code: user.country_code,
      gender: user.gender,
      date_of_birth: user.date_of_birth
        ? new Date(user.date_of_birth).toISOString().split('T')[0]
        : undefined,
      is_email_verified: user.is_email_verified || false,
      is_phone_verified: user.is_phone_verified || false,
      enrolled_courses:
        user.user_courses?.map((userCourse) =>
          this.transformToUserCourse(userCourse),
        ) || [],
      created_at: user.created_at?.toISOString(),
    };
  }

  transformToUserProfileResponse(user: any): UserProfileResponseDto {
    return {
      profile: this.transformToUserProfile(user),
    };
  }
}
