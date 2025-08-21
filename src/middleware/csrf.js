export default function csrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.get('X-CSRF')) return next();
  return res.status(403).json({ ok: false, error: 'Missing CSRF header' });
}
