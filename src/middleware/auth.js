import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import { readDB } from '../db/db.js';

export default async function auth(req, res, next) {
  const { token } = req.cookies || {};
  if (!token) return res.status(401).json({ ok: false, error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const db = await readDB();
    const user = db.users.find((u) => u.id === payload.uid);
    if (!user) return res.status(401).json({ ok: false, error: 'Unauthorized' });
    req.user = user; next();
  } catch {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
}
