import { BadRequestException, Injectable } from '@nestjs/common';
import { DBService } from '@db/db.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StaticDataDBRepository {
  constructor(private readonly prisma: DBService) {}

  async getActiveCourses() {
    return this.prisma.courses.findMany({
      where: {
        is_active: true,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async addCourse(course: string) {
    try {
      return this.prisma.courses.create({
        data: {
          name: course,
          is_active: true,
        },
      });
    } catch (error) {
      // unique constraint violation
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Course already exists');
        }
      }
      throw error;
    }
  }
}
