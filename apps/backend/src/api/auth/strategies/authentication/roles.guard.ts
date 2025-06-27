import { ROLES_KEY } from '@auth/decorator/roles.decorator';
import { RoleType } from '@common/enums/auth-type.enum';
import { APP_STRINGS } from '@common/strings';
import { UserInfo } from '@common/types/auth.types';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    if (!Array.isArray(requiredRoles)) {
      throw new BadRequestException(
        APP_STRINGS.api_errors.auth.strategies.authentication.roles.roles_are_not_an_array,
      );
    }

    if (requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserInfo;
    const userRoles = user.roles.map((role) => role.name) as unknown as RoleType[];
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
