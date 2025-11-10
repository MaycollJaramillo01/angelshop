import { NextFunction, Request, Response } from 'express';

const buckets = new Map<string, { tokens: number; lastRefill: number }>();

const refillTokens = (bucket: { tokens: number; lastRefill: number }, limit: number, windowMs: number) => {
  const now = Date.now();
  const elapsed = now - bucket.lastRefill;
  if (elapsed >= windowMs) {
    bucket.tokens = limit;
    bucket.lastRefill = now;
  }
};

export const rateLimit = (limit: number, windowMs: number) => (req: Request, res: Response, next: NextFunction) => {
  const key = `${req.ip}:${req.path}`;
  const bucket = buckets.get(key) ?? { tokens: limit, lastRefill: Date.now() };
  refillTokens(bucket, limit, windowMs);

  if (bucket.tokens <= 0) {
    res.setHeader('Retry-After', Math.ceil(windowMs / 1000).toString());
    return res.status(429).json({ error: 'Demasiadas solicitudes' });
  }

  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return next();
};
