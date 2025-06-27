import { REGEX } from "@common/utils/regex.util";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";
import { UserResponseDto } from "@auth/dto/user.dto";
import { ApiResponse } from "@common/dto/api-response";

export class LoginDto {
  @ApiProperty({
    example: 'test@example.com',
  })
  @IsString()
  @Matches(REGEX.EMAIL)
  email: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  @Matches(REGEX.PASSWORD)
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ 
    example: true,
  })
  is_temp: boolean;

  @ApiProperty({
    description: 'The user',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  token: string;
}

export class LoginApiResponse extends ApiResponse<LoginResponseDto> {
  @ApiPropertyOptional({ type: LoginResponseDto })
  declare data?: LoginResponseDto;
}
