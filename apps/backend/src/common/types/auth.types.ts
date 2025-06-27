import { RoleDto } from "@auth/dto/roles.dto";

export interface UserInfo {
  id: string;
  full_name?: string;
  email?: string;
  is_disabled?: boolean;
  roles: RoleDto[];
  type?: string;
}

export interface ICookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
  maxAge?: number;
  domain?: string;
}
