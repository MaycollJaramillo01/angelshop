import { Request, Response } from 'express';
import createError from 'http-errors';
import { z } from 'zod';
import {
  cancelReservation,
  createReservation,
  getReservationByCode,
  listReservations,
  markReservationAsCollected
} from './reservations.service.js';

const reservationSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.number().int().positive(),
        quantity: z.number().int().positive()
      })
    )
    .min(1),
  nombre: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().min(6),
  ventanaHoras: z.union([z.literal(24), z.literal(48), z.literal(72)]),
  recaptchaToken: z.string().optional()
});

export const createReservationHandler = async (req: Request, res: Response) => {
  const parsed = reservationSchema.safeParse(req.body);
  if (!parsed.success) {
    throw createError(422, 'Datos inválidos', {
      details: parsed.error.flatten()
    });
  }
  const { recaptchaToken: _ignored, ...data } = parsed.data;
  const result = await createReservation(data);
  res.status(201).json(result);
};

export const getReservationHandler = async (req: Request, res: Response) => {
  const reservation = await getReservationByCode(req.params.codigo);
  if (!reservation) {
    throw createError(404, 'Reserva no encontrada');
  }
  res.json(reservation);
};

export const cancelReservationHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    throw createError(400, 'Id inválido');
  }
  const reservation = await cancelReservation(id);
  res.json(reservation);
};

export const collectReservationHandler = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    throw createError(400, 'Id inválido');
  }
  const reservation = await markReservationAsCollected(id);
  res.json(reservation);
};

export const listReservationsHandler = async (req: Request, res: Response) => {
  const data = await listReservations({
    estado: req.query.estado?.toString(),
    desde: req.query.desde?.toString(),
    hasta: req.query.hasta?.toString()
  });
  res.json(data);
};
