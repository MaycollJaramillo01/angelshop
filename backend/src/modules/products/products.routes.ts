import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { getProductHandler, getProductsHandler } from './products.controller.js';

export const productsRouter = Router();

productsRouter.get('/', asyncHandler(getProductsHandler));
productsRouter.get('/:id', asyncHandler(getProductHandler));
