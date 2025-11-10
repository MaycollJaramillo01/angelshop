import { Router } from 'express';
import { rateLimit } from '../../middleware/rateLimit.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { loginHandler, refreshHandler } from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/login', rateLimit(5, 60 * 1000), asyncHandler(loginHandler));
authRouter.post('/refresh', asyncHandler(refreshHandler));
