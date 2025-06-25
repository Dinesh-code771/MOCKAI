import { createParamDecorator, Logger } from '@nestjs/common';

export const UserRequest = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  const userAgent = request.headers['x-forwarded-user-agent'] || request.headers['user-agent'];
  return {
    user: request.user,
    ip: request.ip,
    userAgent: userAgent,
  };
});
