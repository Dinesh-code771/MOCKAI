import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional } from 'class-validator';
import { ApiResponse } from '@common/dto/api-response';
import { AssessmentStatus } from '@assessments/enum/assessment-status.enum';
import { AssessmentType } from '@assessments/enum/assessment-type.enum';
import { Difficulty } from '@assessments/enum/difficulty.enum';
import { QuestionType } from '@assessments/enum/question-type.enum';

export class StartAssessmentBodyDto {
  @ApiPropertyOptional({
    description:
      'Assessment ID (required when userAssessmentId is not provided)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  assessmentId?: string;
}

export class CourseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'JavaScript Fundamentals' })
  name: string;
}

export class AssessmentDetailsDto {
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
}

export class UserAnswerDto {
  @ApiProperty({
    description: 'User answer ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User answer',
    example: 'A closure is a function',
  })
  answer: string;

  @ApiProperty({
    description: 'Is the answer correct',
    example: true,
  })
  is_correct: boolean;

  @ApiProperty({
    description: 'Points earned',
    example: 4,
  })
  points_earned: number;
}

export class QuestionDto {
  @ApiProperty({
    description: 'Question ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Question text',
    example: 'What is the purpose of JavaScript closures?',
  })
  question_text: string;

  @ApiProperty({
    description: 'Question type',
    enum: QuestionType,
    example: QuestionType.MCQ,
  })
  question_type: QuestionType;

  @ApiProperty({
    description: 'Question options (for MCQ questions)',
    example: [
      'A closure is a function',
      'A closure is a variable',
      'A closure is an object',
      'A closure is a loop',
    ],
    nullable: true,
  })
  options: string[] | null;

  @ApiProperty({
    description: 'Difficulty level',
    enum: Difficulty,
    example: Difficulty.INTERMEDIATE,
  })
  difficulty: Difficulty;

  @ApiProperty({
    description: 'Question order sequence',
    example: 1,
  })
  order_sequence: number;

  @ApiPropertyOptional({
    description: 'User answers',
    type: UserAnswerDto,
    nullable: true,
  })
  user_answers?: UserAnswerDto;
}

export class QuestionWithAnswersDto extends QuestionDto {
  @ApiPropertyOptional({
    description: 'Correct answer',
    example: 'A closure is a function',
  })
  correct_answer: string;
}

export class UserAssessmentResponseDto {
  @ApiProperty({
    description: 'User Assessment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  user_id: string;

  @ApiProperty({
    description: 'Assessment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  assessment_id: string;

  @ApiProperty({
    description: 'Scheduled time',
    example: '2024-01-15T10:30:00Z',
  })
  scheduled_at: string;

  @ApiPropertyOptional({
    example: '2024-01-15T10:35:00Z',
    description: 'Started time',
  })
  started_at?: string;

  @ApiProperty({
    description: 'Assessment status',
    enum: AssessmentStatus,
    example: AssessmentStatus.IN_PROGRESS,
  })
  status: AssessmentStatus;

  @ApiProperty({
    description: 'Assessment details',
    type: AssessmentDetailsDto,
  })
  assessment: AssessmentDetailsDto;

  @ApiProperty({
    description: 'Questions in the assessment',
    type: [QuestionDto],
  })
  questions: QuestionDto[];

  @ApiPropertyOptional({
    example: 3600,
    description: 'Remaining time in seconds',
  })
  remaining_time_seconds?: number;
}

export class CompleteAssessmentResponseDto {
  @ApiProperty({
    description: 'User Assessment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  user_id: string;

  @ApiProperty({
    description: 'Assessment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  assessment_id: string;

  @ApiProperty({
    description: 'Scheduled time',
    example: '2024-01-15T10:30:00Z',
  })
  scheduled_at: string;

  @ApiPropertyOptional({
    example: '2024-01-15T10:35:00Z',
    description: 'Started time',
  })
  started_at?: string;

  @ApiProperty({
    description: 'Assessment status',
    enum: AssessmentStatus,
    example: AssessmentStatus.IN_PROGRESS,
  })
  status: AssessmentStatus;

  @ApiProperty({
    description: 'Total score',
    example: 100,
  })
  total_score: number;

  @ApiProperty({
    description: 'Percentage score',
    example: 100,
  })
  percentage_score: number;

  @ApiProperty({
    description: 'Assessment details',
    type: AssessmentDetailsDto,
  })
  assessment: AssessmentDetailsDto;

  @ApiProperty({
    description: 'Questions in the assessment',
    type: [QuestionWithAnswersDto],
  })
  questions: QuestionWithAnswersDto[];
}

export class StartAssessmentApiResponse extends ApiResponse<UserAssessmentResponseDto> {
  @ApiPropertyOptional({ type: UserAssessmentResponseDto })
  declare data?: UserAssessmentResponseDto;
}

export class UserAnswerResponseDto extends ApiResponse<UserAnswerDto> {
  @ApiPropertyOptional({ type: UserAnswerDto })
  declare data?: UserAnswerDto;
}

export class CompleteAssessmentApiResponse extends ApiResponse<CompleteAssessmentResponseDto> {
  @ApiPropertyOptional({ type: CompleteAssessmentResponseDto })
  declare data?: CompleteAssessmentResponseDto;
}
