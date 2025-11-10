import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';

export const signAccessToken = (payload: { sub: number; role: string }) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: ACCESS_TTL });

export const signRefreshToken = (payload: { sub: number; role: string }) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: REFRESH_TTL });

export const verifyRefreshToken = (token: string) => jwt.verify(token, env.jwtSecret) as { sub: number; role: string };
