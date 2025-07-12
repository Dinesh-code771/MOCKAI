import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsInt,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsNotEmpty,
  Min,
  Max,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
  IsNumber,
} from 'class-validator';
import { AssessmentType } from '@assessments/enum/assessment-type.enum';
import { Difficulty } from '@assessments/enum/difficulty.enum';
import { QuestionType } from '@assessments/enum/question-type.enum';
import { ApiResponse } from '@common/dto/api-response';

@ValidatorConstraint({ name: 'McqValidation', async: false })
export class McqValidationConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as UpsertQuestionDto;

    if (object.question_type === QuestionType.MCQ) {
      // Check if options are provided for MCQ
      if (
        !object.options ||
        !Array.isArray(object.options) ||
        object.options.length < 2
      ) {
        return false;
      }

      // Check if correct_answer is provided for MCQ
      if (!object.correct_answer || typeof object.correct_answer !== 'string') {
        return false;
      }

      // Check if correct_answer is one of the options
      if (!object.options.includes(object.correct_answer)) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const object = args.object as UpsertQuestionDto;

    if (object.question_type === QuestionType.MCQ) {
      if (
        !object.options ||
        !Array.isArray(object.options) ||
        object.options.length < 2
      ) {
        return 'MCQ questions must have at least 2 options';
      }

      if (!object.correct_answer) {
        return 'MCQ questions must have a correct answer';
      }

      if (object.options && !object.options.includes(object.correct_answer)) {
        return 'Correct answer must be one of the provided options';
      }
    }

    return 'Invalid MCQ question configuration';
  }
}

@ValidatorConstraint({ name: 'UniqueOrderSequence', async: false })
export class UniqueOrderSequenceConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const questions = value as UpsertQuestionDto[];

    if (!Array.isArray(questions)) {
      return true; // Let other validators handle this
    }

    const orderSequences = questions.map((q) => q.order_sequence);
    const uniqueOrderSequences = new Set(orderSequences);

    return orderSequences.length === uniqueOrderSequences.size;
  }

  defaultMessage() {
    return 'Question order sequences must be unique';
  }
}

export class UpsertQuestionDto {
  @ApiPropertyOptional({
    description: 'Question ID (for updates, omit for new questions)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    description: 'Question text',
    example: 'What is the purpose of JavaScript closures?',
  })
  @IsString()
  @IsNotEmpty()
  question_text: string;

  @ApiProperty({
    description: 'Question type',
    enum: QuestionType,
    example: QuestionType.MCQ,
  })
  @IsEnum(QuestionType)
  question_type: QuestionType;

  @ApiPropertyOptional({
    description: 'Question options (required for MCQ questions)',
    example: [
      'A closure is a function',
      'A closure is a variable',
      'A closure is an object',
      'A closure is a loop',
    ],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2, { message: 'MCQ questions must have at least 2 options' })
  @ArrayMaxSize(6, { message: 'MCQ questions can have at most 6 options' })
  options?: string[];

  @ApiPropertyOptional({
    description: 'Correct answer (required for MCQ questions)',
    example: 'A closure is a function',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  correct_answer?: string;

  @ApiProperty({
    description: 'Question difficulty level',
    enum: Difficulty,
    example: Difficulty.INTERMEDIATE,
  })
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @ApiProperty({
    description: 'Question order sequence',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  order_sequence: number;

  @Validate(McqValidationConstraint)
  _mcqValidation?: any;
}

export class UpsertAssessmentDto {
  @ApiPropertyOptional({
    description: 'Assessment ID (for updates, omit for new assessments)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({
    description: 'Course ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  course_id?: string;

  @ApiProperty({
    description: 'Assessment name',
    example: 'JavaScript Fundamentals Test',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Assessment type',
    enum: AssessmentType,
    example: AssessmentType.MCQ,
  })
  @IsEnum(AssessmentType)
  type: AssessmentType;

  @ApiProperty({
    description: 'Assessment difficulty level',
    enum: Difficulty,
    example: Difficulty.INTERMEDIATE,
  })
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @ApiPropertyOptional({
    description: 'Duration in minutes',
    example: 60,
    minimum: 1,
    maximum: 480,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(480)
  duration_minutes?: number;

  @ApiPropertyOptional({
    description: 'Assessment description',
    example: 'A comprehensive test covering JavaScript fundamentals',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Maximum score',
    example: '100.00',
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  max_score: number;

  @ApiProperty({
    description: 'Maximum number of questions',
    example: 100,
    minimum: 1,
    maximum: 100,
  })  
  @IsInt()
  @Min(1)
  @Max(100)
  max_questions: number;

  @ApiProperty({
    description: 'Array of questions for the assessment',
    type: [UpsertQuestionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertQuestionDto)
  @ArrayMinSize(1, { message: 'Assessment must have at least 1 question' })
  @ArrayMaxSize(100, { message: 'Assessment can have at most 100 questions' })
  @Validate(UniqueOrderSequenceConstraint)
  questions: UpsertQuestionDto[];
}

export class UpsertQuestionResponseDto {
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

  @ApiPropertyOptional({
    description: 'Question options',
    example: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    type: [String],
  })
  options?: string[];

  @ApiPropertyOptional({
    description: 'Correct answer',
    example: 'Option 1',
  })
  correct_answer?: string;

  @ApiProperty({
    description: 'Question difficulty level',
    enum: Difficulty,
    example: Difficulty.INTERMEDIATE,
  })
  difficulty: Difficulty;

  @ApiProperty({
    description: 'Question order sequence',
    example: 1,
  })
  order_sequence: number;
}

export class UpsertAssessmentResponseDto {
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
    description: 'Assessment difficulty level',
    enum: Difficulty,
    example: Difficulty.INTERMEDIATE,
  })
  difficulty: Difficulty;

  @ApiProperty({
    description: 'Duration in minutes',
    example: 60,
  })
  duration_minutes: number;

  @ApiPropertyOptional({
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
    description: 'Is assessment published',
    example: false,
  })
  is_published: boolean;

  @ApiPropertyOptional({
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

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  updated_at: Date;

  @ApiProperty({
    description: 'Array of questions',
    type: [UpsertQuestionResponseDto],
  })
  questions: UpsertQuestionResponseDto[];
}

export class UpsertAssessmentApiResponse extends ApiResponse<UpsertAssessmentResponseDto> {
  @ApiProperty({
    description: 'Upserted assessment data',
    type: UpsertAssessmentResponseDto,
  })
  declare data?: UpsertAssessmentResponseDto;
}
