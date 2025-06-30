import { Injectable } from '@nestjs/common';
import { StaticDataDBService } from '@db/static-data/static-data-db.service';
import { CoursesResponseDto } from '@static-data/dto/course.dto';
import { StaticDataTransform } from '@static-data/static-data.transform';

@Injectable()
export class StaticDataService {
  constructor(
    private readonly staticDataDBService: StaticDataDBService,
    private readonly staticDataTransform: StaticDataTransform,
  ) {}

  async getActiveCourses(): Promise<CoursesResponseDto> {
    const courses = await this.staticDataDBService.getActiveCourses();
    return this.staticDataTransform.transformToCoursesResponse(courses);
  }
}
