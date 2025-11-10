import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const validateBody = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const details = result.error.flatten();
    return next(Object.assign(new Error('Datos inválidos'), { status: 422, details }));
  }
  req.body = result.data;
  return next();
};
