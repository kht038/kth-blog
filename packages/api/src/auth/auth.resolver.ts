// auth/auth.resolver.ts
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import type { CurrentUserPayload } from './jwt.types';
import { CurrentUser } from './decorator/current-user.decorator';
import { AuthPayload } from './models/auth.model';
import { UserGq } from 'src/user/models/user.model';

type GqlCtx = { req: Request; res: Response };

@Resolver()
export class AuthResolver {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UserService,
  ) {}

  @Mutation(() => AuthPayload)
  async signIn(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() ctx: GqlCtx,
  ): Promise<AuthPayload> {
    const user = await this.auth.validateUser(email, password);
    const { accessToken } = await this.auth.issueTokensAndPersistRefresh(
      { _id: user._id, email: user.email },
      ctx.res,
    );
    return {
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        lastLoginAt: user.lastLoginAt,
      },
    };
  }

  @Mutation(() => AuthPayload)
  async refreshToken(@Context() ctx: GqlCtx): Promise<AuthPayload> {
    const { accessToken, user } = await this.auth.refresh(ctx.res, ctx.req);
    return {
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: (await this.users.findById(user._id))?.name ?? '',
        lastLoginAt: (await this.users.findById(user._id))?.lastLoginAt,
      },
    };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async logout(
    @CurrentUser() me: CurrentUserPayload,
    @Context() ctx: GqlCtx,
  ): Promise<boolean> {
    return this.auth.logout(me.sub, ctx.res);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserGq)
  async me(@CurrentUser() me: CurrentUserPayload): Promise<UserGq> {
    const u = await this.users.findById(me.sub);
    if (!u) throw new Error('User not found');

    return {
      id: u._id,
      email: u.email,
      name: u.name,
      lastLoginAt: u.lastLoginAt,
    };
  }
}
