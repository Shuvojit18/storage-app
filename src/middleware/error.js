export default function errorHandler(err, req, res, _next) {
  console.error(err);
  const isMulter = err && (err.name === 'MulterError' || /multer/i.test(err.message || ''));
  if (isMulter) return res.status(400).json({ ok: false, error: err.message });
  res.status(500).json({ ok: false, error: 'Server error' });
}
