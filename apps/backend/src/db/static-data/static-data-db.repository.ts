import { Injectable } from '@nestjs/common';
import { DBService } from '@db/db.service';

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
}
