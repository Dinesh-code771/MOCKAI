import { UserInfo } from '@common/types/auth.types';

export class UserRequestType {
  user: UserInfo;
  ip: string;
  userAgent: string;
}
