import { Injectable } from '@nestjs/common';
import { CourseDto } from '@static-data/dto/course.dto';
import {
  UserProfileDto,
  UserProfileResponseDto,
} from '@users/dto/user-profile.dto';
import {
  UserListItemDto,
  UserListResponseDto,
} from '@users/dto/user-management.dto';
import {
  UserRankingDto,
  CommunityAnalyticsDto,
  UserAnalyticsDto,
} from '@users/dto/user-ranking.dto';
import { PaginationDetailsDto } from '@common/dto/pagination.dto';

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

  transformToUserListItem(user: any): UserListItemDto {
    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      country_code: user.country_code,
      is_active: user.is_active,
      is_email_verified: user.is_email_verified || false,
      is_phone_verified: user.is_phone_verified || false,
      created_at: user.created_at,
      roles: user.user_roles?.map((userRole: any) => userRole.roles.name) || [],
      enrolled_courses_count: user._count?.user_courses || 0,
    };
  }

  transformToUserListResponse(
    users: any[],
    pagination: PaginationDetailsDto,
  ): UserListResponseDto {
    return {
      users: users.map((user) => this.transformToUserListItem(user)),
      pagination,
    };
  }

  transformToUserRankingResponse(ranking: any): UserRankingDto {
    return {
      id: ranking.id,
      user_id: ranking.user_id,
      full_name: ranking.full_name,
      email: ranking.email,
      avatar: ranking.avatar,
      average_score: ranking.average_score
        ? Number(ranking.average_score)
        : null,
      test_taken_at: ranking.test_taken_at,
      rank: ranking.rank ? Number(ranking.rank) : null,
      given_assessments: ranking.given_assessments || null,
      upcoming_assessments: ranking.upcoming_assessments || null,
    };
  }

  transformToCommunityAnalyticsResponse(analytics: any): CommunityAnalyticsDto {
    return {
      total_users: analytics.count || 0,
      community_average_score: analytics.averageScore?._avg?.average_score
        ? Number(analytics.averageScore._avg.average_score)
        : null,
    };
  }

  transformToUserAnalyticsResponse(analytics: any): UserAnalyticsDto {
    return {
      test_taken_at: analytics?.test_taken_at || null,
      average_score: analytics?.average_score
        ? Number(analytics.average_score)
        : null,
      rank: analytics?.rank ? Number(analytics.rank) : null,
      given_assessments: analytics?.given_assessments || null,
      upcoming_assessments: analytics?.upcoming_assessments || null,
    };
  }
}
