import { Router } from 'express';
import asyncH from '../middleware/asyncHandler.js';
import auth from '../middleware/auth.js';
import csrf from '../middleware/csrf.js';
import { avatarUpload } from '../storage/uploads.js';
import { updateMe, setAvatar } from '../controllers/users.controller.js';

const r = Router();
r.put('/me', auth, csrf, asyncH(updateMe));
r.post('/avatar', auth, csrf, avatarUpload.single('avatar'), asyncH(setAvatar));
export default r;
