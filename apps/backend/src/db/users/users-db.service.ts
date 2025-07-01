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
}
