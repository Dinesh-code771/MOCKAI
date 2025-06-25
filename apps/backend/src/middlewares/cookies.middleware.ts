import { RouteNames } from '@common/route-names';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CookieAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let isDevToolRequest =
      req.baseUrl.includes(RouteNames.DEV_TOOLS) ||
      req.baseUrl.includes(RouteNames.QUEUES_UI);

    const accessToken = req.cookies?.['sid'];
    const refreshToken = req.cookies?.['refresh_token'];

    if (accessToken && !req.headers['authorization']) {
      req.headers['authorization'] = `Bearer ${accessToken}`;
    } else if (refreshToken && !req.headers['authorization']) {
      req.headers['authorization'] = `Bearer ${refreshToken}`;
    }
    next();
  }
}
