import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import {
  cancelReservationHandler,
  collectReservationHandler,
  createReservationHandler,
  getReservationHandler,
  listReservationsHandler
} from './reservations.controller.js';
import { rateLimit } from '../../middleware/rateLimit.js';

export const reservationsRouter = Router();

reservationsRouter.post('/', rateLimit(5, 60 * 1000), asyncHandler(createReservationHandler));
reservationsRouter.get('/:codigo', asyncHandler(getReservationHandler));

reservationsRouter.patch(
  '/:id/cancelar',
  requireAuth(['admin', 'operador']),
  asyncHandler(cancelReservationHandler)
);
reservationsRouter.patch(
  '/:id/retirar',
  requireAuth(['admin', 'operador']),
  asyncHandler(collectReservationHandler)
);

export const reservationsAdminRouter = Router();
reservationsAdminRouter.get('/', requireAuth(['admin', 'operador']), asyncHandler(listReservationsHandler));
