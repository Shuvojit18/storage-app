import { Router } from 'express';
import auth from '../middleware/auth.js';
import csrf from '../middleware/csrf.js';
import asyncH from '../middleware/asyncHandler.js';
import { mediaUpload } from '../storage/uploads.js';
import * as media from '../controllers/media.controller.js';

const r = Router();
r.get('/', auth, asyncH(media.list));
r.post('/upload', auth, csrf, mediaUpload.array('files', 20), asyncH(media.upload));
r.put('/:id', auth, csrf, asyncH(media.update));
r.delete('/:id', auth, csrf, asyncH(media.remove));
export default r;
