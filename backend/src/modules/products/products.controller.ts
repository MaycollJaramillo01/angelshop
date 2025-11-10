import { Request, Response } from 'express';
import createError from 'http-errors';
import { getProductById, listProducts } from './products.service.js';

export const getProductsHandler = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page ?? 1), 1);
  const pageSize = Math.max(Number(req.query.pageSize ?? 12), 1);
  const data = await listProducts(page, pageSize);
  res.json(data);
};

export const getProductHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = await getProductById(id);
  if (!product) {
    throw createError(404, 'Producto no encontrado');
  }
  res.json(product);
};
