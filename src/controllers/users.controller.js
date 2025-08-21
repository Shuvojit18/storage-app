import { readDB, writeDB } from '../db/db.js';

export const updateMe = async (req, res) => {
  const { name } = req.body || {};
  const db = await readDB();
  const u = db.users.find(x=>x.id===req.user.id);
  if (!u) return res.status(404).json({ ok:false, error:'User not found' });
  if (name) u.name = String(name).trim().slice(0,100) || u.name;
  await writeDB(db);
  res.json({ ok:true, user:{ id:u.id, name:u.name, email:u.email, joined:u.joined, avatarUrl:u.avatarUrl } });
};

export const setAvatar = async (req, res) => {
  const db = await readDB();
  const u = db.users.find(x=>x.id===req.user.id);
  if (!u) return res.status(404).json({ ok:false, error:'User not found' });
  const avatarUrl = req.file?.path || (req.file?.filename ? `/uploads/avatars/${req.file.filename}` : '');
  if (!avatarUrl) return res.status(400).json({ ok:false, error:'No file' });
  u.avatarUrl = avatarUrl;
  await writeDB(db);
  res.json({ ok:true, avatarUrl });
};
