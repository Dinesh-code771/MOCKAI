import { Injectable } from '@nestjs/common';
import { CourseDto, CoursesResponseDto } from '@static-data/dto/course.dto';

@Injectable()
export class StaticDataTransform {
  transformToCourseResponse(course: any): CourseDto {
    return {
      id: course.id,
      name: course.name,
    };
  }

  transformToCoursesResponse(courses: any[]): CoursesResponseDto {
    return {
      courses: courses.map((course) => this.transformToCourseResponse(course)),
    };
  }
}
