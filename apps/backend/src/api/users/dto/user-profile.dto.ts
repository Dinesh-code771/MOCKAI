import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiResponse } from '@common/dto/api-response';
import { CourseDto } from '@static-data/dto/course.dto';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { Gender } from '@users/enum/gender.enum';

export class UserProfileDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID',
  })
  id: string;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'User full name',
  })
  full_name?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email',
  })
  email: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
  })
  avatar?: string;

  @ApiPropertyOptional({
    example: '+919876543210',
    description: 'User phone number',
  })
  phone_number?: string;

  @ApiPropertyOptional({
    example: '+91',
    description: 'Country code',
  })
  country_code?: string;

  @ApiPropertyOptional({
    example: Gender.MALE,
    enum: Gender,
    description: 'User gender',
  })
  gender?: Gender;

  @ApiPropertyOptional({
    example: '1990-01-01',
    description: 'Date of birth',
  })
  date_of_birth?: string;

  @ApiProperty({
    example: true,
    description: 'Whether email is verified',
  })
  is_email_verified: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether phone is verified',
  })
  is_phone_verified: boolean;

  @ApiPropertyOptional({
    type: [CourseDto],
    description: 'User enrolled courses',
  })
  enrolled_courses?: CourseDto[];

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Account creation date',
  })
  created_at: string;
}

export class UserProfileResponseDto {
  @ApiProperty({
    type: UserProfileDto,
    description: 'User profile data',
  })
  profile: UserProfileDto;
}

export class UserProfileApiResponse extends ApiResponse<UserProfileResponseDto> {
  @ApiPropertyOptional({ type: UserProfileResponseDto })
  declare data?: UserProfileResponseDto;
}

export class UpdateUserProfileDto {
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'User full name',
  })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiPropertyOptional({
    example: Gender.MALE,
    enum: Gender,
    description: 'User gender',
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    example: '1990-01-01',
    description: 'Date of birth (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    description: 'Array of course IDs to enroll in',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  enrolled_courses?: string[];
}
