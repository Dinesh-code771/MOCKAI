// swagger-cookie-jwt.guard.ts
import { RoleType } from '@common/enums/auth-type.enum';
import { CustomJwtService } from '@common/services/jwt.service';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class SwaggerCookieJwtGuard implements CanActivate {
  
  constructor(private readonly jwtService: CustomJwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('Missing admin session');
    }

    try {
      const decoded = await this.jwtService.verifyAccessToken(token);
  
      if (!decoded?.roles?.some((role) => role.name === RoleType.ADMIN)) {
        return false;
      }

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromCookie(request: Request): string | null {
    return (
      request.cookies?.['sid'] ||
      request.headers?.authorization?.split(' ')[1] ||
      null
    );
  }
}
