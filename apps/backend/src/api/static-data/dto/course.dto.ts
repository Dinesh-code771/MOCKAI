import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiResponse } from '@common/dto/api-response';

export class CourseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Course ID',
  })
  id: string;

  @ApiProperty({
    example: 'JavaScript Fundamentals',
    description: 'Course name',
  })
  name: string;
}

export class CoursesResponseDto {
  @ApiProperty({
    type: [CourseDto],
    description: 'List of active courses',
  })
  courses: CourseDto[];
}

export class CoursesApiResponse extends ApiResponse<CoursesResponseDto> {
  @ApiPropertyOptional({ type: CoursesResponseDto })
  declare data?: CoursesResponseDto;
}
