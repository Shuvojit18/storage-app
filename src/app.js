import express from 'express';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { COOKIE_SECURE, FORCE_HTTPS, PUBLIC_DIR, UPLOADS_DIR, USE_CLOUDINARY } from './config/env.js';
import errorHandler from './middleware/error.js';

const app = express();
if (COOKIE_SECURE || FORCE_HTTPS) app.set('trust proxy', 1);
app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

// HTTPS redirect (Heroku)
if (FORCE_HTTPS) {
  app.use((req, res, next) => {
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') return next();
    res.redirect('https://' + req.headers.host + req.originalUrl);
  });
}

// Static assets (uploads only when using disk storage)
if (!USE_CLOUDINARY) app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d', etag: true }));
app.use(express.static(PUBLIC_DIR, { maxAge: '1h', etag: true }));

// Health
app.get('/health', (_, res) => res.json({ ok: true }));

// API routes
app.use('/api', routes);

// Root -> index.html
app.get('/', (_, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));

// Errors
app.use(errorHandler);

export default app;
