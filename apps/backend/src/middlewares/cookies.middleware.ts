import { RouteNames } from '@common/route-names';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CookieAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies?.['sid']; 

    if (accessToken && !req.headers['authorization']) {
      req.headers['authorization'] = `Bearer ${accessToken}`;
    }
    next();
  }
}
