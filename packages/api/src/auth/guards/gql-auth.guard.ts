// auth/guards/gql-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request, Response } from 'express';

type GqlCtx = { req: Request; res: Response };

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  // GraphQL 컨텍스트에서 Express Request를 안전하게 꺼내 반환
  override getRequest(context: ExecutionContext): Request {
    const gqlCtx = GqlExecutionContext.create(context).getContext<GqlCtx>();
    // req가 없으면 인증 가드 체인 자체가 비정상인 상황
    if (!gqlCtx?.req) {
      throw new Error('Request object not found in GraphQL context');
    }
    return gqlCtx.req;
  }
}
