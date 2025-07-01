import { Injectable } from '@nestjs/common';
import { UserResponseDto } from './dto/user.dto';

@Injectable()
export class AuthTransform {
  transformToUserResponse(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      roles: user.user_roles.map((userRole) => userRole.roles),
      full_name: user.full_name,
      phone_number: user.phone_number,
      is_disabled: !user.is_active,
    };
  }
}
