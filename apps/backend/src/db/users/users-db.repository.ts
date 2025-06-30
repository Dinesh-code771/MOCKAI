import { Injectable } from '@nestjs/common';
import { DBService } from '@db/db.service';
import { Gender } from '@users/enum/gender.enum';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersDBRepository {
  constructor(private readonly prisma: DBService) {}

  async getUserProfileWithCourses(userId: string) {
    return this.prisma.users.findUnique({
      where: {
        id: userId,
        is_active: true,
        is_deleted: false,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        avatar: true,
        phone_number: true,
        country_code: true,
        gender: true,
        date_of_birth: true,
        is_email_verified: true,
        is_phone_verified: true,
        created_at: true,
        user_courses: {
          where: {
            is_active: true,
          },
          select: {
            courses: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async validateCoursesExist(courseIds: string[]) {
    const courses = await this.prisma.courses.findMany({
      where: {
        id: {
          in: courseIds,
        },
        is_active: true,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      validCourses: courses,
      invalidCourseIds: courseIds.filter(
        (id) => !courses.some((course) => course.id === id),
      ),
    };
  }

  async updateUserProfileWithCourses(
    userId: string,
    updateData: {
      full_name?: string;
      gender?: Gender;
      date_of_birth?: string;
    },
    courseIds?: string[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      // Prepare user update data
      const userUpdateData: Prisma.usersUpdateInput = {};

      if (updateData.full_name !== undefined) {
        userUpdateData.full_name = updateData.full_name;
      }

      if (updateData.gender !== undefined) {
        userUpdateData.gender = updateData.gender;
      }

      if (updateData.date_of_birth !== undefined) {
        userUpdateData.date_of_birth = new Date(updateData.date_of_birth);
      }

      // Update user basic profile information
      await tx.users.update({
        where: {
          id: userId,
        },
        data: userUpdateData,
      });

      // Update course enrollments if provided
      if (courseIds !== undefined) {
        // Get current enrollments
        const currentEnrollments = await tx.user_courses.findMany({
          where: {
            user_id: userId,
            is_active: true,
          },
          select: {
            course_id: true,
          },
        });

        const currentCourseIds = currentEnrollments.map(
          (enrollment) => enrollment.course_id,
        );

        // Determine courses to add and remove
        const coursesToAdd = courseIds.filter(
          (courseId) => !currentCourseIds.includes(courseId),
        );
        const coursesToRemove = currentCourseIds.filter(
          (courseId) => !courseIds.includes(courseId),
        );

        // Remove courses that are no longer needed
        if (coursesToRemove.length) {
          await tx.user_courses.deleteMany({
            where: {
              user_id: userId,
              course_id: {
                in: coursesToRemove,
              },
            },
          });
        }

        // Add new courses
        if (coursesToAdd.length) {
          const courseEnrollments = coursesToAdd.map((courseId) => ({
            user_id: userId,
            course_id: courseId,
            is_active: true,
          }));

          await Promise.all(
            courseEnrollments.map((enrollment) =>
              tx.user_courses.upsert({
                where: {
                  user_id_course_id: {
                    user_id: enrollment.user_id,
                    course_id: enrollment.course_id,
                  },
                },
                create: enrollment,
                update: {
                  is_active: true,
                },
              }),
            ),
          );
        }
      }

      // Fetch and return the updated user with enrolled courses
      return tx.users.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          full_name: true,
          email: true,
          avatar: true,
          phone_number: true,
          country_code: true,
          gender: true,
          date_of_birth: true,
          is_email_verified: true,
          is_phone_verified: true,
          created_at: true,
          user_courses: {
            where: {
              is_active: true,
            },
            select: {
              courses: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    });
  }
}
