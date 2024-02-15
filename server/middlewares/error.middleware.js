const errorMiddleware = (err, _req, res, _next) => {
  err.statusCode = err.statuscode || 500;
  err.message = err.message || "something went wrong";

  // for the invalid id
  if (err.code === 11000) {
    res.status(400).json({
      success: false,
      message: "duplicate key error",
      stack: err.stack
    });
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack
  });
};

export default errorMiddleware;
