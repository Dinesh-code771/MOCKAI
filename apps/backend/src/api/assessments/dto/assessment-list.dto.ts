import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsUUID, IsInt, Min } from 'class-validator';
import { AssessmentType } from '@assessments/enum/assessment-type.enum';
import { Difficulty } from '@assessments/enum/difficulty.enum';
import { PaginationDetailsDto } from '@common/dto/pagination.dto';
import { ApiResponse } from '@common/dto/api-response';
import { AssessmentStatus } from '@assessments/enum/assessment-status.enum';

export class AssessmentListQueryDto {
  @ApiPropertyOptional({
    description: 'Assessment type filter',
    enum: AssessmentType,
    required: false,
    example: AssessmentType.MCQ,
  })
  @IsOptional()
  @IsEnum(AssessmentType)
  type?: AssessmentType;

  @ApiPropertyOptional({
    description: 'Course ID filter',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  course_id?: string;

  @ApiPropertyOptional({
    description: 'Difficulty level filter',
    enum: Difficulty,
    required: false,
    example: Difficulty.INTERMEDIATE,
  })
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @ApiPropertyOptional({
    description: 'Page number (starting from 1)',
    required: false,
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    required: false,
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  limit?: number;
}

export class UserAssessmentListQueryDto extends AssessmentListQueryDto {
  @ApiPropertyOptional({
    description: 'Assessment status filter',
    enum: AssessmentStatus,
    required: false,
    example: AssessmentStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(AssessmentStatus)
  status?: AssessmentStatus;
}

export class AssessmentResponseDto {
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
    description: 'Course information',
    nullable: true,
  })
  course: {
    id: string;
    name: string;
  } | null;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: Date;
}

export class AssessmentListResponseDto {
  @ApiProperty({
    description: 'List of assessments',
    type: [AssessmentResponseDto],
  })
  assessments: AssessmentResponseDto[];

  @ApiProperty({
    description: 'Pagination details',
    type: PaginationDetailsDto,
  })
  pagination: PaginationDetailsDto;
}

export class AssessmentListApiResponse extends ApiResponse<AssessmentListResponseDto> {
  @ApiProperty({
    description: 'Assessment list data',
    type: AssessmentListResponseDto,
  })
  declare data?: AssessmentListResponseDto;
}
