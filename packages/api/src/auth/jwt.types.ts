// auth/jwt.types.ts
export interface JwtAccessPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

export interface JwtRefreshPayload {
  sub: string;
  typ: 'refresh';
  iat: number;
  exp: number;
}
export interface CurrentUserPayload {
  sub: string;
  email: string;
}
