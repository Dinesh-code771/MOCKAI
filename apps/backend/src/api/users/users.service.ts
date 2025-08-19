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
import {
  AddUsersDto,
  UserListQueryDto,
  UserListResponseDto,
  UserStatus,
} from '@users/dto/user-management.dto';
import {
  UserRankingResponseDto,
  UserAnalyticsResponseDto,
} from '@users/dto/user-ranking.dto';
import { APP_STRINGS } from '@common/strings';
import { Gender } from '@users/enum/gender.enum';
import {
  calculateSkipAndTake,
  getPaginatedData,
} from '@common/helpers/pagination.utils';

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
    if (updateData.phone_number && !updateData.country_code) {
      throw new BadRequestException(
        APP_STRINGS.api_errors.users.country_code_required,
      );
    }

    // Validate courses if provided
    if (updateData.enrolled_courses && updateData.enrolled_courses.length > 0) {
      const courseValidation = await this.usersDBService.validateCoursesExist(
        updateData.enrolled_courses,
      );

      if (courseValidation.invalidCourseIds.length > 0) {
        throw new BadRequestException(
          APP_STRINGS.api_errors.users.invalid_phone_number(
            courseValidation.invalidCourseIds,
          ),
        );
      }
    }

    // Prepare update data for database
    const dbUpdateData: {
      full_name?: string;
      gender?: Gender;
      date_of_birth?: string;
      phone_number?: string;
      country_code?: string;
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

    if (updateData.phone_number !== undefined) {
      dbUpdateData.phone_number = updateData.phone_number;
      dbUpdateData.country_code = updateData.country_code;
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

  async addUsers(addUsersDto: AddUsersDto) {
    const { emails } = addUsersDto;

    if (!emails || emails.length === 0) {
      throw new BadRequestException('At least one email is required');
    }

    // Check for existing users
    const existingUsers = await this.usersDBService.getUsersByEmail(emails);
    const existingEmails = existingUsers.map((user) => user.email);
    const newEmails = emails.filter((email) => !existingEmails.includes(email));

    let usersAdded = 0;

    // Add new users if any
    if (newEmails.length > 0) {
      await this.usersDBService.addUsers(newEmails);
    }

    return;
  }

  async getUsersList(query: UserListQueryDto): Promise<UserListResponseDto> {
    const { skip, take } = calculateSkipAndTake(query.page, query.limit);

    const { users, totalCount } = await this.usersDBService.getUsersList(
      query.search || '',
      skip,
      take,
      query?.status ? query.status === UserStatus.ENABLED : undefined,
    );

    const pagination = {
      pageNo: query.page || 1,
      pageSize: take,
      totalCount,
      ...getPaginatedData(totalCount, query.page, query.limit),
    };

    return this.usersTransform.transformToUserListResponse(users, pagination);
  }

  async disableUser(userId: string, isActive: boolean) {
    return await this.usersDBService.disableUser(userId, isActive);
  }

  async deleteUser(userId: string) {
    return await this.usersDBService.deleteUser(userId);
  }

  async getUserRanking(userId: string, page: number, limit: number): Promise<UserRankingResponseDto> {
    const rankings = await this.usersDBService.getUserRanking(userId, page, limit);
    const communityAnalytics =
      await this.usersDBService.getCommunityAnalytics();

    return {
      rankings: rankings.map((ranking) =>
        this.usersTransform.transformToUserRankingResponse(ranking),
      ),
      communityAnalytics:
        this.usersTransform.transformToCommunityAnalyticsResponse(
          communityAnalytics,
        ),
    };
  }

  async getUserAnalytics(userId: string): Promise<UserAnalyticsResponseDto> {
    const { userAnalytics, ranking } = await this.usersDBService.getUserAnalytics(userId);
    return {
      analytics:
        this.usersTransform.transformToUserAnalyticsResponse(ranking, userAnalytics?.given_assessments, userAnalytics?.upcoming_assessments),
    };
  }

  async adminDashboardAnalytics() {
    const { count: totalUsers, averageScore, totalAssessments, totalQuestions } = await this.usersDBService.adminDashboardAnalytics();
    return {
      totalUsers,
      averageScore: averageScore._avg.average_score.toFixed(2),
      totalAssessments,
      totalQuestions,
    };
  }
}
