const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Log in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error] ${err.statusCode} - ${err.message}`, err.stack);
  }

  // Wrong Mongoose Object ID Error
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    return res.status(404).json({
      success: false,
      message,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered: ${field}. Please use another value.`;
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // Wrong JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = 'JSON Web Token is invalid. Try again.';
    return res.status(401).json({
      success: false,
      message,
    });
  }

  // JWT EXPIRED error
  if (err.name === 'TokenExpiredError') {
    const message = 'JSON Web Token has expired. Try again.';
    return res.status(401).json({
      success: false,
      message,
    });
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
