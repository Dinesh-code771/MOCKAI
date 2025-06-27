import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { RoleDto } from "./roles.dto";
import { ApiResponse } from "@common/dto/api-response";

export class UserResponseDto {
  @ApiProperty({ example: '9a1b488b-3171-4aa0-a695-312a3d6c7052' })
  id: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  full_name?: string;

  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @ApiPropertyOptional({ example: '9999999999' })
  phone_number?: string; 

  @ApiProperty({ type: [RoleDto] })
  roles: RoleDto[];

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the user account is disabled',
  })
  is_disabled?: boolean;
}

export class UserResponseApiResponse extends ApiResponse<UserResponseDto> {
  @ApiPropertyOptional({ type: UserResponseDto })
  declare data?: UserResponseDto;
}