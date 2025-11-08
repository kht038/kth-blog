// auth/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { CurrentUserPayload } from '../jwt.types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const user = gqlCtx.getContext<{ req: { user?: CurrentUserPayload } }>().req
      .user;
    if (!user) {
      // 타입 가드: Nest AuthGuard가 붙은 resolver에서만 쓰도록 하자
      throw new Error('Current user not found on request');
    }
    return user;
  },
);
