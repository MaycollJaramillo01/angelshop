import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import { pool } from '../../db/pool.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from './jwt.js';

interface User {
  id: number;
  nombre: string;
  email: string;
  hash_password: string;
  rol: 'admin' | 'operador';
  activo: boolean;
}

export const authenticate = async (email: string, password: string) => {
  const { rows } = await pool.query<User>(
    'SELECT * FROM usuarios WHERE email=$1',
    [email]
  );
  const user = rows[0];
  if (!user || !user.activo) {
    throw createError(401, 'Credenciales inválidas');
  }
  const valid = await bcrypt.compare(password, user.hash_password);
  if (!valid) {
    throw createError(401, 'Credenciales inválidas');
  }
  const payload = { sub: user.id.toString(), role: user.rol };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }
  };
};

export const refresh = async (token: string) => {
  try {
    const payload = verifyRefreshToken(token);
    return {
      accessToken: signAccessToken({ sub: payload.sub, role: payload.role })
    };
  } catch (error) {
    throw createError(401, 'Refresh token inválido');
  }
};
