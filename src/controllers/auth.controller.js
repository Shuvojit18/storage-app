import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readDB, writeDB } from '../db/db.js';
import { JWT_SECRET } from '../config/env.js';
import { randomUUID } from 'node:crypto';

function setAuthCookie(res, token) {
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: true, maxAge: 7*24*60*60*1000, path:'/' });
}

export const signup = async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) return res.status(400).json({ ok:false, error:'Email & password required' });
  if (password.length < 6) return res.status(400).json({ ok:false, error:'Password too short' });
  const db = await readDB();
  if (db.users.some(u=>u.email===email)) return res.status(409).json({ ok:false, error:'Email already exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = { id: randomUUID(), name: name || 'User', email, pass: hash, joined: new Date().toISOString(), avatarUrl: '' };
  db.users.push(user); await writeDB(db);
  const token = jwt.sign({ uid: user.id }, JWT_SECRET, { expiresIn: '7d' });
  setAuthCookie(res, token);
  res.json({ ok:true, user: { id:user.id, name:user.name, email:user.email, joined:user.joined, avatarUrl:user.avatarUrl } });
};

export const login = async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) return res.status(400).json({ ok:false, error:'Email & password required' });
  const db = await readDB();
  const user = db.users.find(u=>u.email===email);
  if (!user) return res.status(401).json({ ok:false, error:'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.pass);
  if (!ok) return res.status(401).json({ ok:false, error:'Invalid credentials' });
  const token = jwt.sign({ uid: user.id }, JWT_SECRET, { expiresIn: '7d' });
  setAuthCookie(res, token);
  res.json({ ok:true, user: { id:user.id, name:user.name, email:user.email, joined:user.joined, avatarUrl:user.avatarUrl } });
};

export const me = async (req, res) => {
  const { id, name, email, joined, avatarUrl } = req.user;
  res.json({ ok:true, user:{ id, name, email, joined, avatarUrl } });
};

export const logout = (req, res) => { res.clearCookie('token', { path:'/' }); res.json({ ok:true }); };
