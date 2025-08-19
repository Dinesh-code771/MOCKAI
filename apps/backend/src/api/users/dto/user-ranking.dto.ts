import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiResponse } from '@common/dto/api-response';

export class UserRankingDto {
  @ApiProperty({
    description: 'Analytics record ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  user_id: string;

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
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  avatar?: string | null;

  @ApiPropertyOptional({
    description: 'Average score percentage',
    example: 85.5,
    type: 'number',
    nullable: true,
  })
  average_score?: number | null;

  @ApiPropertyOptional({
    description: 'Last test taken timestamp',
    example: '2024-01-15T10:30:00Z',
    nullable: true,
  })
  test_taken_at?: Date | null;

  @ApiPropertyOptional({
    description: 'User rank based on average score',
    example: 15,
    type: 'integer',
    nullable: true,
  })
  rank?: number | null;

  @ApiPropertyOptional({
    description: 'Number of assessments given',
    example: 5,
    type: 'integer',
    nullable: true,
  })
  given_assessments?: number | null;

  @ApiPropertyOptional({
    description: 'Number of upcoming assessments',
    example: 2,
    type: 'integer',
    nullable: true,
  })
  upcoming_assessments?: number | null;
}

export class CommunityAnalyticsDto {
  @ApiProperty({
    description: 'Total number of users with scores',
    example: 150,
    type: 'integer',
  })
  total_users: number;

  @ApiPropertyOptional({
    description: 'Community average score',
    example: 72.5,
    type: 'number',
    nullable: true,
  })
  community_average_score?: number | null;
}

export class UserRankingResponseDto {
  @ApiProperty({
    description: 'User ranking data',
    type: [UserRankingDto],
  })
  rankings: UserRankingDto[];

  @ApiProperty({
    description: 'Community analytics data',
    type: CommunityAnalyticsDto,
  })
  communityAnalytics: CommunityAnalyticsDto;
}

export class UserRankingApiResponse extends ApiResponse<UserRankingResponseDto> {
  @ApiProperty({
    description: 'User ranking response data',
    type: UserRankingResponseDto,
  })
  declare data?: UserRankingResponseDto;
}

export class UserAnalyticsDto {
  @ApiPropertyOptional({
    description: 'Last test taken timestamp',
    example: '2024-01-15T10:30:00Z',
    nullable: true,
  })
  test_taken_at?: Date | null;

  @ApiPropertyOptional({
    description: 'Average score percentage',
    example: 85.5,
    type: 'number',
    nullable: true,
  })
  average_score?: number | null;

  @ApiPropertyOptional({
    description: 'User rank based on average score',
    example: 15,
    type: 'integer',
    nullable: true,
  })
  rank?: number | null;

  @ApiPropertyOptional({
    description: 'Number of assessments given',
    example: 5,
    type: 'integer',
    nullable: true,
  })
  given_assessments?: number | null;

  @ApiPropertyOptional({
    description: 'Number of upcoming assessments',
    example: 2,
    type: 'integer',
    nullable: true,
  })
  upcoming_assessments?: number | null;
}

export class UserAnalyticsResponseDto {
  @ApiProperty({
    description: 'User analytics data',
    type: UserAnalyticsDto,
  })
  analytics: UserAnalyticsDto;
}

export class UserAnalyticsApiResponse extends ApiResponse<UserAnalyticsResponseDto> {
  @ApiProperty({
    description: 'User analytics response data',
    type: UserAnalyticsResponseDto,
  })
  declare data?: UserAnalyticsResponseDto;
}

export class AdminDashboardAnalyticResponse {
  @ApiProperty({
    description: 'Total number of users',
    example: 42,
    type: Number,
  })
  totalUsers: number;

  @ApiProperty({
    description: 'Average score across all users (formatted as string)',
    example: '78.5',
    type: String,
  })
  averageScore: string;

  @ApiProperty({
    description: 'Total number of assessments taken',
    example: 100,
    type: Number,
  })
  totalAssessments: number;

  @ApiProperty({
    description: 'Total number of questions across all assessments',
    example: 500,
    type: Number,
  })
  totalQuestions: number;
}

export class AdminDashboardAnalyticsApiResponse extends ApiResponse<AdminDashboardAnalyticResponse> {
  @ApiProperty({
    description: 'Admin dashboard analytics response data',
    type: AdminDashboardAnalyticResponse,
  })
  declare data?: AdminDashboardAnalyticResponse;
}
