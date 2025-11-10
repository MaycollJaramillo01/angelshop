import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

interface TokenPayload {
  sub: number;
  role: string;
}

export const requireAuth = (roles: string[] = []) => (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  const [, token] = header.split(' ');
  try {
    const payload = jwt.verify(token, env.jwtSecret) as TokenPayload;
    if (roles.length && !roles.includes(payload.role)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    res.locals.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
