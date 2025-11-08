// auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';
import { UserService } from '../user/user.service';
import { JwtAccessPayload, JwtRefreshPayload } from './jwt.types';
import { getSignedCookie } from 'src/utils/get-signed-cookie';

function sha256Hex(input: string): string {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly users: UserService,
  ) {}

  private signAccess(user: { _id: string; email: string }): string {
    const payload: Omit<JwtAccessPayload, 'iat' | 'exp'> = {
      sub: user._id,
      email: user.email,
    };
    return this.jwt.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET!,
      expiresIn: '15m',
    });
  }

  private signRefresh(user: { _id: string }): string {
    const payload: Omit<JwtRefreshPayload, 'iat' | 'exp'> = {
      sub: user._id,
      typ: 'refresh',
    };
    return this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET!,
      expiresIn: '7d',
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmailWithPassword(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return user; // UserLeanWithSecrets
  }

  async issueTokensAndPersistRefresh(
    user: { _id: string; email: string },
    res: import('express').Response,
  ): Promise<{ accessToken: string; user: { _id: string; email: string } }> {
    const accessToken = this.signAccess(user);
    const refreshToken = this.signRefresh(user);
    const refreshSha = sha256Hex(refreshToken);

    await this.users.setRefreshTokenSha256(user._id, refreshSha);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      signed: true,
      maxAge: 7 * 24 * 3600 * 1000,
      path: '/graphql',
    });

    return { accessToken, user };
  }

  async refresh(
    res: import('express').Response,
    req: import('express').Request,
  ): Promise<{ accessToken: string; user: { _id: string; email: string } }> {
    const token = getSignedCookie(req, 'refresh_token');
    if (!token) throw new UnauthorizedException('No refresh token');

    // payload 타입 보장
    const payload = this.jwt.verify<JwtRefreshPayload>(token, {
      secret: process.env.JWT_REFRESH_SECRET!,
    });
    if (payload.typ !== 'refresh')
      throw new ForbiddenException('Bad token type');

    const user = await this.users.findById(payload.sub);
    if (!user || !user.refreshTokenSha256)
      throw new UnauthorizedException('Invalid refresh');

    const incomingSha = sha256Hex(token);
    if (incomingSha !== user.refreshTokenSha256)
      throw new UnauthorizedException('Invalid refresh');

    return this.issueTokensAndPersistRefresh(
      { _id: user._id, email: user.email },
      res,
    );
  }

  async logout(
    userId: string,
    res: import('express').Response,
  ): Promise<boolean> {
    await this.users.setRefreshTokenSha256(userId, null);
    res.clearCookie('refresh_token', { path: '/graphql' });
    return true;
  }
}
