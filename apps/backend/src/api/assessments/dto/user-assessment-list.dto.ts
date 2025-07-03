import { ApiProperty } from '@nestjs/swagger';
import { AssessmentType } from '@assessments/enum/assessment-type.enum';
import { Difficulty } from '@assessments/enum/difficulty.enum';
import { PaginationDetailsDto } from '@common/dto/pagination.dto';
import { ApiResponse } from '@common/dto/api-response';
import { AssessmentStatus } from '@assessments/enum/assessment-status.enum';
import { Type } from 'class-transformer';
import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';

export class UserAssessmentQueryDto {
  @ApiProperty({
    description: 'Assessment type filter',
    enum: AssessmentType,
    required: false,
  })
  @IsOptional()
  @IsEnum(AssessmentType)
  type?: AssessmentType;

  @ApiProperty({
    description: 'Course ID filter',
    required: false,
  })
  @IsOptional()
  @IsString()
  course_id?: string;

  @ApiProperty({
    description: 'Difficulty level filter',
    enum: Difficulty,
    required: false,
  })
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @ApiProperty({
    description: 'Assessment status filter',
    enum: AssessmentStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(AssessmentStatus)
  status?: AssessmentStatus;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

export class UserAssessmentItemDto {
  @ApiProperty({
    description: 'Assessment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Assessment name',
    example: 'JavaScript Fundamentals Test',
  })
  name: string;

  @ApiProperty({
    description: 'Assessment type',
    enum: AssessmentType,
    example: AssessmentType.MCQ,
  })
  type: AssessmentType;

  @ApiProperty({
    description: 'Difficulty level',
    enum: Difficulty,
    example: Difficulty.INTERMEDIATE,
  })
  difficulty: Difficulty;

  @ApiProperty({
    description: 'Duration in minutes',
    example: 60,
  })
  duration_minutes: number;

  @ApiProperty({
    description: 'Assessment description',
    example: 'A comprehensive test covering JavaScript fundamentals',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Maximum score',
    example: 100,
  })
  max_score: number;

  @ApiProperty({
    description: 'Total number of questions',
    example: 25,
  })
  total_questions: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'User assessment details',
  })
  user_assessment: {
    id: string;
    status: AssessmentStatus;
    started_at: string | null;
    completed_at: string | null;
    total_score: number | null;
    percentage_score: number | null;
    feedback: string | null;
    scheduled_at: string;
    weak_areas: string[];
    strong_areas: string[];
    created_at: Date;
  };

  @ApiProperty({
    description: 'Course information',
    nullable: true,
  })
  course: {
    id: string;
    name: string;
  } | null;
}

export class UserAssessmentListResponseDto {
  @ApiProperty({
    description: 'List of user assessments',
    type: [UserAssessmentItemDto],
  })
  assessments: UserAssessmentItemDto[];

  @ApiProperty({
    description: 'Pagination details',
    type: PaginationDetailsDto,
  })
  pagination: PaginationDetailsDto;
}

export class UserAssessmentListApiResponse extends ApiResponse<UserAssessmentListResponseDto> {
  @ApiProperty({
    description: 'User assessment list data',
    type: UserAssessmentListResponseDto,
  })
  declare data?: UserAssessmentListResponseDto;
}
