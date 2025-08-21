import { Router } from 'express';
import limiter from '../middleware/rateLimit.js';
import authRoutes from './auth.routes.js';
import usersRoutes from './users.routes.js';
import mediaRoutes from './media.routes.js';

const r = Router();
r.use(limiter);
r.use('/auth', authRoutes);
r.use('/users', usersRoutes);
r.use('/media', mediaRoutes);
export default r;
