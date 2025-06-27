import { LoggerService } from '@logger/logger.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly SENSITIVE_KEYS = ['password'];

  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const { method, url, httpVersion, headers, query, body } = request;
    const remoteAddr = request.ip;
    const userAgent =
      request.headers['x-forwarded-user-agent'] ||
      request.headers['user-agent'] ||
      'unknown';
    const referrer = headers['referer'] || headers['referrer'] || 'No Referer';
    const startTime = new Date().toISOString();
    const startTimestamp = Date.now();

    return next.handle().pipe(
      tap(() => {
        const endTimestamp = Date.now();
        const endTime = new Date().toISOString();
        const responseTime = endTimestamp - startTimestamp;
        const { statusCode } = response;

        // Log a single combined message with all request and response details
        this.logger.http(
          `HTTP Log - Start Time: ${startTime}, End Time: ${endTime}, Total Duration: ${responseTime}ms\n` +
            `Remote Address: ${remoteAddr}, Method: ${method}, URL: ${url}, HTTP Version: ${httpVersion}\n` +
            `User-Agent: ${userAgent}, Referrer: ${referrer}\n` +
            `Request Body: ${JSON.stringify(this.deepSanitize(body))}\n` +
            `Query Params: ${JSON.stringify(query)}\n`
        );
      }),
    );
  }

  private deepSanitize(obj: any) {
    const sensitiveKeys = [
      'password',
      'secret',
      'token',
      'accesstoken',
      'refreshtoken',
    ];
    if (Array.isArray(obj)) {
      return obj.map((item) => this.deepSanitize(item));
    }

    if (obj !== null && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
          if (sensitiveKeys.includes(key.toLowerCase())) {
            return [key, '[REDACTED]'];
          }
          return [key, this.deepSanitize(value)];
        }),
      );
    }

    return obj;
  }
}
