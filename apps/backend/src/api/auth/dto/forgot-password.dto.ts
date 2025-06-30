import { REGEX } from '@common/utils/regex.util';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  Matches,
  IsInt,
  IsNotEmpty,
  Max,
  Min,
} from 'class-validator';
import { ApiResponse } from '@common/dto/api-response';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'test@example.com',
    description: 'Email address to send OTP for password reset',
  })
  @IsString()
  @Matches(REGEX.EMAIL)
  email: string;
}

export class VerifyForgotPasswordOtpDto {
  @ApiProperty({
    example: 123456,
    description: 'OTP received via email',
  })
  @IsInt()
  @Min(100000)
  @Max(999999)
  @IsNotEmpty()
  otp: number;
}

export class ResetPasswordDto {
  @ApiProperty({
    example: 'newPassword123!',
    description: 'New password',
  })
  @IsString()
  @Matches(REGEX.PASSWORD)
  new_password: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty({
    example: 'OTP sent successfully to your email',
  })
  message: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'Temporary token for password reset',
  })
  temp_token: string;
}

export class VerifyForgotPasswordOtpResponseDto {
  @ApiProperty({
    example: 'OTP verified successfully',
  })
  message: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'Access token after OTP verification',
  })
  token: string;
}

export class ResetPasswordResponseDto {
  @ApiProperty({
    example: 'Password reset successfully',
  })
  message: string;
}

export class ForgotPasswordApiResponse extends ApiResponse<ForgotPasswordResponseDto> {
  @ApiPropertyOptional({ type: ForgotPasswordResponseDto })
  declare data?: ForgotPasswordResponseDto;
}

export class VerifyForgotPasswordOtpApiResponse extends ApiResponse<VerifyForgotPasswordOtpResponseDto> {
  @ApiPropertyOptional({ type: VerifyForgotPasswordOtpResponseDto })
  declare data?: VerifyForgotPasswordOtpResponseDto;
}

export class ResetPasswordApiResponse extends ApiResponse<ResetPasswordResponseDto> {
  @ApiPropertyOptional({ type: ResetPasswordResponseDto })
  declare data?: ResetPasswordResponseDto;
}
