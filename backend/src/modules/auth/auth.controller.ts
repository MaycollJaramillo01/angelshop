import { Request, Response } from 'express';
import createError from 'http-errors';
import { authenticate, refresh } from './auth.service.js';

export const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw createError(422, 'Email y password requeridos');
  }
  const result = await authenticate(email, password);
  res.json(result);
};

export const refreshHandler = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw createError(422, 'refreshToken requerido');
  }
  const result = await refresh(refreshToken);
  res.json(result);
};
