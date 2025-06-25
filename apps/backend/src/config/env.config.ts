import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class EnvConfig {
  @IsNotEmpty()
  @IsNumber()
  PORT: number;

  @IsNotEmpty()
  @IsString()
  APP_VERSION: string;

  @IsNotEmpty()
  @IsString()
  NODE_ENV: string;

  @IsNotEmpty()
  @IsString()
  REDIS_HOST: string;

  @IsNotEmpty()
  @IsNumber()
  REDIS_PORT: number;

  @IsNotEmpty()
  @IsString()
  REDIS_PASSWORD: string;

  @IsNotEmpty()
  @IsBoolean()
  REDIS_TLS_ENABLED: boolean;

  @IsNotEmpty()
  @IsString()
  POSTGRES_DB: string;

  @IsNotEmpty()
  @IsString()
  POSTGRES_USER: string;

  @IsNotEmpty()
  @IsString()
  POSTGRES_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  POSTGRES_HOST: string;

  @IsNotEmpty()
  @IsNumber()
  POSTGRES_PORT: number;

  @IsNotEmpty()
  @IsString()
  DATABASE_URL: string;

  @IsNotEmpty()
  @IsNumber()
  DEFAULT_PAGE: number;

  @IsNotEmpty()
  @IsNumber()
  DEFAULT_PAGE_SIZE: number;

  @IsNotEmpty()
  @IsString()
  SENDGRID_API_KEY: string;

  @IsNotEmpty()
  @IsString()
  TWILIO_ACCOUNT_SID: string;

  @IsNotEmpty()
  @IsString()
  TWILIO_AUTH_TOKEN: string;

  @IsNotEmpty()
  @IsString()
  TWILIO_PHONE_NUMBER: string;

  @IsNotEmpty()
  @IsString()
  JWT_TOKEN_SECRET: string;

  @IsNotEmpty()
  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsNotEmpty()
  @IsNumber()
  JWT_TOKEN_EXPIRY: number;

  @IsNotEmpty()
  @IsNumber()
  REFRESH_TOKEN_EXPIRY: number;

  @IsNotEmpty()
  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsNotEmpty()
  @IsString()
  GOOGLE_CLIENT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  GOOGLE_CALLBACK_URL: string;

  @IsNotEmpty()
  @IsString()
  AWS_REGION: string;

  @IsNotEmpty()
  @IsString()
  AWS_BUCKET_NAME: string;

  @IsNotEmpty()
  @IsString()
  AWS_ACCESS_KEY_ID: string;

  @IsNotEmpty()
  @IsString()
  AWS_SECRET_ACCESS_KEY: string;

  @IsNotEmpty()
  @IsString()
  CORS_ORIGINS: string;

  @IsNotEmpty()
  @IsString()
  FRONTEND_URL: string;

  @IsNotEmpty()
  @IsString()
  BACKEND_URL: string;

  @IsNotEmpty()
  @IsNumber()
  PRIVATE_IMAGE_EXPIRATION: number;

  @IsNotEmpty()
  @IsNumber()
  FILE_URL_EXPIRY_IN_MILLISECONDS: number;
}
