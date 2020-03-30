const ErrorResponse = require('../utils/errorResponse');

const handleCastErrorFromDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ErrorResponse(message, 400);
};

const handleDuplicateErrorDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate value: ${value}. Please select another value.`;
  return new ErrorResponse(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid data. Errors: ${errors.join('. ')}`;
  return new ErrorResponse(message, 400);
};

const handleJWTError = () =>
  new ErrorResponse('Invalid token. Please log in again!', 401);

const handleJWTExpiredTokenError = () =>
  new ErrorResponse('Your tonen has expired. Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};
const sendErrorProd = (err, req, res) => {
  // Operational trusted errors send to the client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    // Programming, unknown errors don't want to leak details to the client
  }
  // 1st log error to see details
  console.error(`ERROR 🎇 ${err}`);
  // 2nd send a generic message to the client
  return res.status(500).json({
    status: 'Error',
    message: 'Something went very wrong!'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorFromDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredTokenError();

    sendErrorProd(error, req, res);
  }
};
