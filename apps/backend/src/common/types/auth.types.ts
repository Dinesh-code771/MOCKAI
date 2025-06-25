export interface UserInfo {
  id: string;
  full_name?: string;
  user_id?: string;
  device_id?: string;
  otp_id?: string;
  email_or_phone?: string;
  country_code?: string;
  is_disabled?: boolean;
}

export interface ICookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
  maxAge?: number;
  domain?: string;
}
