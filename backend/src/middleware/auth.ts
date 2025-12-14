import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../modules/auth/jwt.js';

export const requireAuth =
  (roles: string[] = []) =>
  (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    const [, token] = header.split(' ');
    try {
      const payload = verifyAccessToken(token);
      if (roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }
      res.locals.user = payload;
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };
