import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { logger } from '../utils/logger.js';

type HttpError = createError.HttpError;

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(createError(404, 'Recurso no encontrado'));
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const error = err as Partial<HttpError> & { status?: number; message?: string; details?: unknown };
  const status = error.status ?? 500;
  const traceId = res.getHeader('x-trace-id') ?? Math.random().toString(36).slice(2, 8);

  if (status >= 500) {
    logger.error('Unhandled error', { err });
  }

  res.status(status).json({
    error: error.message ?? 'Error interno',
    details: error.details,
    traceId
  });
};
