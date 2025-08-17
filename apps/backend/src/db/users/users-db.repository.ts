import { Injectable, NotFoundException } from '@nestjs/common';
import { DBService } from '@db/db.service';
import { Gender } from '@users/enum/gender.enum';
import { Prisma } from '@prisma/client';
import { RoleType } from '@common/enums/auth-type.enum';
import { APP_STRINGS } from '@common/strings';

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
      phone_number?: string;
      country_code?: string;
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

  async getUsersByEmail(emails: string[]) {
    return this.prisma.users.findMany({
      where: {
        email: {
          in: emails,
        },
        user_roles: {
          some: {
            roles: {
              name: RoleType.STUDENT,
            },
          },
        },
      },
    });
  }

  async addUsers(emails: string[]) {
    const insertData = emails.map((email) => ({
      email,
      is_temp: false,
      is_active: true,
    }));

    const role = await this.prisma.roles.findUnique({
      where: {
        name: RoleType.STUDENT,
      },
    });

    const users = await this.prisma.users.createManyAndReturn({
      data: insertData,
      skipDuplicates: true,
      select: {
        id: true,
      },
    });

    await this.prisma.user_roles.createMany({
      data: users.map((user) => ({
        user_id: user.id,
        role_id: role.id,
      })),
    });

    return users;
  }

  async getUsersList(
    search: string,
    skip: number,
    take: number,
    isActive?: boolean,
  ) {
    const where: Prisma.usersWhereInput = {
      is_deleted: false,
    };

    where.user_roles = {
      some: {
        roles: {
          name: RoleType.STUDENT,
        },
      },
    };

    if (search) {
      where.OR = [
        {
          full_name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (isActive !== undefined && isActive !== null) {
      where.is_active = {
        equals: isActive,
      };
    } 

    const [users, totalCount] = await Promise.all([
      this.prisma.users.findMany({
        where,
        select: {
          id: true,
          full_name: true,
          email: true,
          phone_number: true,
          country_code: true,
          is_active: true,
          is_email_verified: true,
          is_phone_verified: true,
          created_at: true,
          user_roles: {
            select: {
              roles: {
                select: {
                  name: true,
                },
              },
            },
          },
          _count: {
            select: {
              user_courses: {
                where: {
                  is_active: true,
                },
              },
            },
          },
        },
        skip,
        take,
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.users.count({
        where,
      }),
    ]);

    return { users, totalCount };
  }

  async disableUser(userId: string, isActive: boolean) {
    try {
      return this.prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          is_active: isActive,
        },
      });
    } catch (error) {
      // if user not found, throw error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new NotFoundException(
            APP_STRINGS.api_errors.auth.user_not_found,
          );
        }
      }
      throw error;
    }
  }

  async deleteUser(userId: string) {
    try {
      return this.prisma.users.delete({
        where: { id: userId },
      });
    } catch (error) {
      // if user not found, throw error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new NotFoundException(
            APP_STRINGS.api_errors.auth.user_not_found,
          );
        }
      }
      throw error;
    }
  }

  async getUserRanking(userId: string) {
    return this.prisma.user_ranking_view.findMany({
      where: {
        OR: [
          {
            rank: {
              lte: 10,
            },
          },
          {
            user_id: userId,
          },
        ],
      },
      orderBy: {
        rank: 'asc',
      },
      select: {
        id: true,
        test_taken_at: true,
        average_score: true,
        rank: true,
        user_id: true,
        full_name: true,
        email: true,
        avatar: true,
        given_assessments: true,
        upcoming_assessments: true,
      }
    });
  }

  async getCommunityAnalytics() {
    const count = await this.prisma.user_ranking_view.count({});
    const averageScore = await this.prisma.user_ranking_view.aggregate({
      _avg: {
        average_score: true,
      },
    });

    return { count, averageScore };
  }

  async getUserAnalytics(userId: string) {
    const ranking = await this.prisma.user_ranking_view.findFirst({
      where: {
        user_id: userId,
      },
      select: {
        given_assessments: true,
        upcoming_assessments: true,
        average_score: true,
        rank: true,
      },
    });

    const userAnalytics = await this.prisma.user_analytics.findUnique({
      where: {
        user_id: userId,
      },
    });

    return { ranking, userAnalytics };
  }
}
