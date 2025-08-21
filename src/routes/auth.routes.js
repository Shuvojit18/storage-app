import { Router } from 'express';
import asyncH from '../middleware/asyncHandler.js';
import csrf from '../middleware/csrf.js';
import { signup, login, me, logout } from '../controllers/auth.controller.js';
import auth from '../middleware/auth.js';

const r = Router();
r.post('/signup', csrf, asyncH(signup));
r.post('/login', csrf, asyncH(login));
r.post('/logout', csrf, logout);
r.get('/me', auth, me);
export default r;
