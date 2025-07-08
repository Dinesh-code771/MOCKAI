import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsBoolean,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { PaginationDetailsDto } from '@common/dto/pagination.dto';
import { ApiResponse } from '@common/dto/api-response';

export class AddUsersDto {
  @ApiProperty({
    description: 'Array of email addresses to add as users',
    example: ['user1@example.com', 'user2@example.com'],
    type: [String],
  })
  @IsArray()
  @IsEmail({}, { each: true })
  emails: string[];
}

export enum UserStatus {
  DISABLED = 'disabled',
  ENABLED = 'enabled',
}

export class UserListQueryDto {
  @ApiPropertyOptional({
    description: 'Search term for filtering users by name or email',
    required: false,
    example: 'john',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by user status',
    required: false,
    example: UserStatus.ENABLED,
    enum: UserStatus,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({
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

  @ApiPropertyOptional({
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

export class UserListItemDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiPropertyOptional({
    description: 'User full name',
    example: 'John Doe',
    nullable: true,
  })
  full_name?: string | null;

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '9876543210',
    nullable: true,
  })
  phone_number?: string | null;

  @ApiPropertyOptional({
    description: 'Country code',
    example: '+91',
    nullable: true,
  })
  country_code?: string | null;

  @ApiProperty({
    description: 'Whether user account is active',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Whether email is verified',
    example: true,
  })
  is_email_verified: boolean;

  @ApiProperty({
    description: 'Whether phone is verified',
    example: false,
  })
  is_phone_verified: boolean;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'User roles',
    type: [String],
    example: ['student'],
  })
  roles: string[];

  @ApiProperty({
    description: 'Number of enrolled courses',
    example: 3,
  })
  enrolled_courses_count: number;
}

export class UserListResponseDto {
  @ApiProperty({
    description: 'List of users',
    type: [UserListItemDto],
  })
  users: UserListItemDto[];

  @ApiProperty({
    description: 'Pagination details',
    type: PaginationDetailsDto,
  })
  pagination: PaginationDetailsDto;
}

export class UserListApiResponse extends ApiResponse<UserListResponseDto> {
  @ApiProperty({
    description: 'User list response data',
    type: UserListResponseDto,
  })
  declare data?: UserListResponseDto;
}

export class DisableUserDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4')
  user_id: string;

  @ApiProperty({
    description: 'Whether to disable the user',
    example: true,
  })
  @IsBoolean()
  is_active: boolean;
}

export class UserIdDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4')
  user_id: string;
}