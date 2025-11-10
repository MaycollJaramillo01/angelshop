import { Request, Response } from 'express';
import createError from 'http-errors';
import { listVariantsByProduct, updateVariant } from './variants.service.js';

export const listVariantsHandler = async (req: Request, res: Response) => {
  const productId = Number(req.query.productoId ?? req.query.productId);
  if (!productId) {
    throw createError(400, 'productoId requerido');
  }
  const data = await listVariantsByProduct(productId);
  res.json(data);
};

export const updateVariantHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { stock_disponible, stock_reservado } = req.body;
  if (typeof stock_disponible !== 'number' || typeof stock_reservado !== 'number') {
    throw createError(422, 'Datos inválidos');
  }
  const variant = await updateVariant(id, { stock_disponible, stock_reservado });
  res.json(variant);
};
