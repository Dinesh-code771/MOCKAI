import { RolesGuard } from '@auth/strategies/authentication/roles.guard';
import { RoleType } from '@common/enums/auth-type.enum';
import { SetMetadata, UseGuards } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: RoleType[]) => {
  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    SetMetadata(ROLES_KEY, roles)(target, key, descriptor);
    UseGuards(RolesGuard)(target, key, descriptor);
  };
};
