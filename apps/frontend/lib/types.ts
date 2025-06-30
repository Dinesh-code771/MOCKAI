// Temporary type definitions until SDK is built
export interface LoginDto {
  email: string;
  password: string;
}

export interface OtpDto {
  otp: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  name?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginApiResponse {
  accessToken: string;
  user: UserResponseDto;
  message?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}
