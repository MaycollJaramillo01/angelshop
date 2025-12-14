import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import createError from 'http-errors';
import { productsRouter } from './modules/products/products.routes.js';
import { variantsRouter } from './modules/variants/variants.routes.js';
import {
  reservationsAdminRouter,
  reservationsRouter
} from './modules/reservations/reservations.routes.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import { rateLimit } from './middleware/rateLimit.js';
import { pool } from './db/pool.js';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (/^http:\/\/localhost:\d+$/.test(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Origen no permitido'));
      },
      credentials: true
    })
  );
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/', async (_req, res, next) => {
    try {
      const { rows } = await pool.query<{ version: string }>(
        'SELECT version() AS version'
      );
      res.json({ status: 'ok', database: rows[0]?.version ?? 'unknown' });
    } catch (error) {
      next(
        createError(503, 'Base de datos no disponible', {
          details: error instanceof Error ? error.message : error
        })
      );
    }
  });

  const api = express.Router();
  api.use('/productos', productsRouter);
  api.use('/variantes', variantsRouter);
  api.use('/reservas', reservationsRouter);
  api.use('/auth', authRouter);
  api.use('/admin/reservas', reservationsAdminRouter);

  app.use('/v1', api);

  app.post('/mock/recaptcha', rateLimit(20, 60 * 1000), (_req, res) => {
    res.json({ success: true });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
