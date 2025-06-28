const errorMiddleware = (err, req, res, next) => {
  console.error('❌ Error middleware caught:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    statusCode: err.statusCode || 500
  });
  
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error"
  res.status(status).json({ message });
};

module.exports = errorMiddleware;
