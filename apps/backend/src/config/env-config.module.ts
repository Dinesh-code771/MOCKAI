import { EnvConfig } from '@config/env.config';
import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import * as Joi from 'joi';

const envConfig = registerAs(
  'env',
  () =>
    ({
      PORT: parseInt(process.env.PORT, 10),
      APP_VERSION: process.env.APP_VERSION,
      NODE_ENV: process.env.NODE_ENV,
      REDIS_HOST: process.env.REDIS_HOST,
      REDIS_PORT: parseInt(process.env.REDIS_PORT, 10),
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,
      REDIS_TLS_ENABLED:
        process.env.REDIS_TLS_ENABLED.toString().toLowerCase() === 'true',
      POSTGRES_DB: process.env.POSTGRES_DB,
      POSTGRES_USER: process.env.POSTGRES_USER,
      POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
      POSTGRES_HOST: process.env.POSTGRES_HOST,
      POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT, 10),
      DATABASE_URL: process.env.DATABASE_URL,
      DEFAULT_PAGE: parseInt(process.env.DEFAULT_PAGE, 10),
      DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE, 10),
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
      TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
      TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
      JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,
      REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
      JWT_TOKEN_EXPIRY: parseInt(process.env.JWT_TOKEN_EXPIRY),
      REFRESH_TOKEN_EXPIRY: parseInt(process.env.REFRESH_TOKEN_EXPIRY),
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
      AWS_REGION: process.env.AWS_REGION,
      AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      CORS_ORIGINS: process.env.CORS_ORIGINS,
      FRONTEND_URL: process.env.FRONTEND_URL,
      BACKEND_URL: process.env.BACKEND_URL,
      PRIVATE_IMAGE_EXPIRATION: parseInt(process.env.PRIVATE_IMAGE_EXPIRATION),
      FILE_URL_EXPIRY_IN_MILLISECONDS: parseInt(process.env.FILE_URL_EXPIRY_IN_MILLISECONDS),
    }) as EnvConfig,
  );

const validationSchema = Joi.object({
  PORT: Joi.number().port().required(),
  APP_VERSION: Joi.string().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production')
    .required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().port().required(),
  REDIS_PASSWORD: Joi.string().required(),
  REDIS_TLS_ENABLED: Joi.boolean().default(false),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().port().required(),
  DATABASE_URL: Joi.string()
    .required()
    .pattern(/^postgresql:\/\//)
    .messages({
      'string.pattern.base': 'DATABASE_URL must start with "postgresql://"',
      'string.empty': 'DATABASE_URL is required',
    }),
  DEFAULT_PAGE: Joi.number().default(1),
  DEFAULT_PAGE_SIZE: Joi.number().default(10),
  SENDGRID_API_KEY: Joi.string().required(),
  TWILIO_ACCOUNT_SID: Joi.string().required(),
  TWILIO_AUTH_TOKEN: Joi.string().required(),
  TWILIO_PHONE_NUMBER: Joi.string().required(),
  JWT_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_TOKEN_EXPIRY: Joi.number().required(),
  REFRESH_TOKEN_EXPIRY: Joi.number().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  AWS_BUCKET_NAME: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  CORS_ORIGINS: Joi.string().required(),
  FRONTEND_URL: Joi.string().required(),
  BACKEND_URL: Joi.string().required(),
  PRIVATE_IMAGE_EXPIRATION: Joi.number().required(),
  FILE_URL_EXPIRY_IN_MILLISECONDS: Joi.number().required(),
});


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      validationSchema,
    }),
  ],
  exports: [ConfigModule],
})
export class EnvConfigModule {}
