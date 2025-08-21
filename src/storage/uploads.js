import path from 'path';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { USE_CLOUDINARY, MEDIA_DIR, AVATAR_DIR } from '../config/env.js';
import cloudinary from '../config/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const mediaStorage = USE_CLOUDINARY
  ? new CloudinaryStorage({ cloudinary, params: () => ({ folder: 'media-timeline/media', resource_type: 'auto', public_id: `${Date.now()}_${nanoid(6)}` }) })
  : multer.diskStorage({
      destination: (_, __, cb) => cb(null, MEDIA_DIR),
      filename: (_, file, cb) => cb(null, `${Date.now()}_${nanoid(6)}${path.extname(file.originalname || '').toLowerCase()}`),
    });

const avatarStorage = USE_CLOUDINARY
  ? new CloudinaryStorage({ cloudinary, params: (req) => ({ folder: 'media-timeline/avatars', resource_type: 'image', public_id: `${req.user?.id || 'anon'}_${nanoid(4)}` }) })
  : multer.diskStorage({
      destination: (_, __, cb) => cb(null, AVATAR_DIR),
      filename: (req, file, cb) => cb(null, `${req.user?.id || 'anon'}_${nanoid(4)}${path.extname(file.originalname || '').toLowerCase()}`),
    });

export const mediaUpload = multer({
  storage: mediaStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(/^(image|video)\//.test(file.mimetype) ? null : new Error('Only images/videos allowed')),
});
export const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(/^image\//.test(file.mimetype) ? null : new Error('Only images for avatar')),
});
