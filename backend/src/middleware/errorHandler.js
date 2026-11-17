export function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Route not found' });
}

export function errorHandler(err, req, res, next) {
  if (err?.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: Object.values(err.errors || {}).map(item => item.message).join('. ') || 'Please check the submitted fields', code: 'VALIDATION_ERROR' });
  }
  if (err?.code === 11000) {
    return res.status(409).json({ success: false, message: 'A record with these details already exists' });
  }
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    success: false,
    message: status >= 500 ? 'An unexpected server error occurred' : err.message,
    code: err.code || 'SERVER_ERROR'
  });
}
