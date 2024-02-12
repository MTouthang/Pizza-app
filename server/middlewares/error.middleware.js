const errorMiddleware = (err, _req, res, _next) => {
  err.statusCode = err.statuscode || 500;
  err.message = err.message || 'something went wrong';

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
};

export default errorMiddleware;
