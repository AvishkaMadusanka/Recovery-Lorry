export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const status = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
  res.status(status).json({
    message: status === 500 ? 'An unexpected server error occurred.' : error.message,
    ...(process.env.NODE_ENV !== 'production' && { details: error.details })
  });
}
