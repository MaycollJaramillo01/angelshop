import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { listVariantsHandler, updateVariantHandler } from './variants.controller.js';

export const variantsRouter = Router();

variantsRouter.get('/', asyncHandler(listVariantsHandler));
variantsRouter.patch('/:id', requireAuth(['admin', 'operador']), asyncHandler(updateVariantHandler));
