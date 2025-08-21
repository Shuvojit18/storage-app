import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '../..');

export const PORT = parseInt(process.env.PORT || '3000', 10);
export const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
export const COOKIE_SECURE = String(process.env.COOKIE_SECURE || 'false') === 'true';
export const FORCE_HTTPS = String(process.env.FORCE_HTTPS || 'false') === 'true';
export const USE_CLOUDINARY = !!(process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME);

export const DATA_DIR = path.join(ROOT, 'data');
export const UPLOADS_DIR = path.join(ROOT, 'uploads');
export const MEDIA_DIR = path.join(UPLOADS_DIR, 'media');
export const AVATAR_DIR = path.join(UPLOADS_DIR, 'avatars');
export const PUBLIC_DIR = path.join(ROOT, 'public');
export const DB_FILE = path.join(DATA_DIR, 'db.json');
