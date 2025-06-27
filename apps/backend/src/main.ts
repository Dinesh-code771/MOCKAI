process.env.TZ = 'UTC';

import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { RouteNames } from '@common/route-names';
import { LoggerService } from '@logger/logger.service';
import {
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { Response } from 'express';
import { AppModule } from './app.module';
import { ErrorHandlerService } from '@common/services/error-handler.service';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '@config/env.config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const environment = process.env.NODE_ENV || 'development';
  const isProd = environment === 'production';
  const isDev = environment === 'development';
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    snapshot: false, // true - Enable Debugging
    bufferLogs: false, // true - Enable Debugging
    rawBody: true, // true - Enable raw body, Required at webhook body processing
  });

  const logger = await app.resolve(LoggerService);
  app.useLogger(logger);

  // Apply Helmet Middleware for setting security-related HTTP headers
  app.use(helmet());

  const configService = app.get(ConfigService<EnvConfig>);
  const corsOrigins =
    configService.get<string>('CORS_ORIGINS')?.split(',') || [];

  // Enable CORS with specific settings
  app.enableCors({
    origin: corsOrigins,
    credentials: true, // Include credentials in CORS requests
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Content-Type, Accept, Authorization, x-landing-app-id, x-forwarded-for, x-client-ip, x-real-ip, x-device-id, x-device, referer, user-agent, x-forwarded-host, x-forwarded-user-agent, referrer, x-forwarded-referer, x-forwarded-origin, origin, host',
  });

  // Limit Request Size to 20MB
  // Conditional body parsing middleware
  app.use((req, res, next) => {
    bodyParser.json({ limit: '20mb' })(req, res, next);
  });
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('mockAI')
    .setDescription(
      'The Node based REST API documentation for mockAI',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // ❌ remove unwanted route manually from swagger document
  delete document.paths['/v1/metrics'];
  SwaggerModule.setup(RouteNames.API_DOCS, app, document);

  // Use global filters and pipes
  const errorHandler = app.get(ErrorHandlerService);
  app.useGlobalFilters(new HttpExceptionFilter(errorHandler));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically remove non-whitelisted properties
      forbidNonWhitelisted: true, // Return an error for non-whitelisted properties
      transform: true, // Transform plain input objects to class instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Default Route - Show Friendly Info Page
  const expressApp = app.getHttpAdapter().getInstance() as any;
  expressApp.get(['/', '/v1'], (_, res: Response) => {
    try {
      res.status(200).json({
        app: 'mockAI API Services',
        environment,
        isProd,
        message: isProd
          ? 'You are hitting a wrong URL. Please check the official API documentation.'
          : 'Welcome to the backend service. Use the options below to explore further.',
      });
    } catch (error) { 
      res.status(500).send('Internal server error');
    }
  });
  if (!isProd) {
    expressApp.get('/robots.txt', (_, res) =>
      res.type('text/plain').send('User-agent: *\nDisallow: /'),
    );
  }

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  const appUrl = await app.getUrl();
  Logger.log(`App is running on ${appUrl}`, 'mockAI');
}

bootstrap();
