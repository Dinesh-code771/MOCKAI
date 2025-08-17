import { Injectable } from '@nestjs/common';
import { UsersDBRepository } from '@db/users/users-db.repository';
import { Gender } from '@users/enum/gender.enum';

@Injectable()
export class UsersDBService {
  constructor(private readonly usersRepository: UsersDBRepository) {}

  async getUserProfileWithCourses(userId: string) {
    return this.usersRepository.getUserProfileWithCourses(userId);
  }

  async validateCoursesExist(courseIds: string[]) {
    return this.usersRepository.validateCoursesExist(courseIds);
  }

  async updateUserProfileWithCourses(
    userId: string,
    updateData: {
      full_name?: string;
      gender?: Gender;
      date_of_birth?: string;
      phone_number?: string;
      country_code?: string;
    },
    courseIds?: string[],
  ) {
    return this.usersRepository.updateUserProfileWithCourses(
      userId,
      updateData,
      courseIds,
    );
  }

  async getUsersByEmail(emails: string[]) {
    return this.usersRepository.getUsersByEmail(emails);
  }

  async addUsers(emails: string[]) {
    return this.usersRepository.addUsers(emails);
  }

  async getUsersList(
    search: string,
    skip: number,
    take: number,
    isActive?: boolean,
  ) {
    return this.usersRepository.getUsersList(search, skip, take, isActive);
  }

  async disableUser(userId: string, isActive: boolean) {
    return this.usersRepository.disableUser(userId, isActive);
  }

  async deleteUser(userId: string) {
    return this.usersRepository.deleteUser(userId);
  }

  async getUserRanking(userId: string) {
    return this.usersRepository.getUserRanking(userId);
  }

  async getCommunityAnalytics() {
    return this.usersRepository.getCommunityAnalytics();
  }

  async getUserAnalytics(userId: string) {
    return this.usersRepository.getUserAnalytics(userId);
  }
}
