import path from 'path';
import fs from 'fs-extra';
import cloudinary from '../config/cloudinary.js';
import { USE_CLOUDINARY, MEDIA_DIR } from '../config/env.js';
import { readDB, writeDB } from '../db/db.js';
import { randomUUID } from 'node:crypto';

const safeInt = (v, d, min=1, max=1e6) => Math.min(max, Math.max(min, Number.parseInt(v||d,10) || d));

export const list = async (req, res) => {
  const order = (req.query.order === 'asc') ? 'asc' : 'desc';
  const type  = ['image','video'].includes(req.query.type) ? req.query.type : 'all';
  const q     = String(req.query.q || '').toLowerCase();
  const page  = safeInt(req.query.page, 1);
  const limit = safeInt(req.query.limit, 20, 1, 100);

  const db = await readDB();
  let items = db.media.filter(m=>m.userId===req.user.id);
  if (type==='image') items = items.filter(m=>m.mimetype.startsWith('image/'));
  if (type==='video') items = items.filter(m=>m.mimetype.startsWith('video/'));
  if (q) items = items.filter(m=>(((m.originalName||'')+' '+(m.tags||[]).join(' ')).toLowerCase().includes(q)));
  items.sort((a,b)=> order==='asc' ? (new Date(a.createdAt)-new Date(b.createdAt)) : (new Date(b.createdAt)-new Date(a.createdAt)));

  const total = items.length;
  const start = (page-1)*limit;
  res.json({ ok:true, page, limit, total, items: items.slice(start, start+limit) });
};

export const upload = async (req, res) => {
  const files = req.files || [];
  if (!files.length) return res.status(400).json({ ok:false, error:'No files' });
  const db = await readDB();
  const now = Date.now();
  const newItems = files.map((f, i) => ({
    id: randomUUID(),
    userId: req.user.id,
    filename: f.filename,
    originalName: f.originalname,
    mimetype: f.mimetype,
    size: f.size,
    url: USE_CLOUDINARY ? (f.path || f.secure_url) : `/uploads/media/${f.filename}`,
    cloudinaryId: USE_CLOUDINARY ? (f.filename || f.public_id || null) : undefined,
    createdAt: new Date(now+i).toISOString(),
    tags: [],
  }));
  db.media.push(...newItems); await writeDB(db);
  res.json({ ok:true, count:newItems.length, items:newItems });
};

export const update = async (req, res) => {
  const { id } = req.params; const { tags } = req.body || {};
  const db = await readDB();
  const it = db.media.find(m=>m.id===id && m.userId===req.user.id);
  if (!it) return res.status(404).json({ ok:false, error:'Not found' });
  if (Array.isArray(tags)) it.tags = tags.map(t=>String(t).slice(0,24)).slice(0,20);
  await writeDB(db);
  res.json({ ok:true, item: it });
};

export const remove = async (req, res) => {
  const { id } = req.params; const db = await readDB();
  const idx = db.media.findIndex(m=>m.id===id && m.userId===req.user.id);
  if (idx===-1) return res.status(404).json({ ok:false, error:'Not found' });
  const [rm] = db.media.splice(idx,1); await writeDB(db);
  try {
    if (USE_CLOUDINARY && rm.cloudinaryId) {
      const rt = rm.mimetype?.startsWith('video/') ? 'video' : 'image';
      await cloudinary.uploader.destroy(rm.cloudinaryId, { resource_type: rt });
    } else if (rm.filename) {
      await fs.remove(path.join(MEDIA_DIR, rm.filename));
    }
  } catch {}
  res.json({ ok:true });
};
