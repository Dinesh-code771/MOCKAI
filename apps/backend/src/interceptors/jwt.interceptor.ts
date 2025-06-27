import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  // Jwt gaurd will not be invoked if the endpoint is public
  // Adding this interceptor to get User Info for authorized users even if endpoint is public
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization; 

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      try {
        const decoded = jwt.decode(token);

        if (decoded && !request.user) {
          request.user = {
            id: decoded.sub,
            full_name: decoded['name'],
            roles: decoded['roles'], 
            is_disabled: decoded['is_disabled'],
            type: decoded['type'],
          };
        }
      } catch (error) {
        return next.handle(); // Ignore errors and proceed
      }
    }

    return next.handle();
  }
}
