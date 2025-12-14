import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../../config/env.js';

const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';

export interface TokenPayload extends JwtPayload {
  sub: string;
  role: string;
}

const isTokenPayload = (
  payload: string | JwtPayload
): payload is TokenPayload =>
  typeof payload === 'object' &&
  payload !== null &&
  'sub' in payload &&
  typeof payload.sub === 'string' &&
  'role' in payload &&
  typeof payload.role === 'string';

export const signAccessToken = (payload: TokenPayload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: ACCESS_TTL });

export const signRefreshToken = (payload: TokenPayload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: REFRESH_TTL });

export const verifyRefreshToken = (token: string): TokenPayload => {
  const payload = jwt.verify(token, env.jwtSecret);
  if (!isTokenPayload(payload)) {
    throw new Error('Invalid refresh token payload');
  }
  return payload;
};

export const verifyAccessToken = (token: string): TokenPayload => {
  const payload = jwt.verify(token, env.jwtSecret);
  if (!isTokenPayload(payload)) {
    throw new Error('Invalid access token payload');
  }
  return payload;
};
