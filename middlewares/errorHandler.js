import logger from '../logger/logger.js';
import { ApiError, NotFoundError } from '../errors/errors.js';

const errorHandler = (err, req, res, next) => {
  // Default status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const name = err.name || 'Error';
  const timestamp = err.timestamp || new Date().toISOString(); // Fallback if the error doesn't have a timestamp

  // Log the error details
  if (err instanceof ApiError) {
    logger.error(
      `API Error - Status: ${statusCode}, Name: ${name}, Message: ${message}, Stack: ${err.stack}`,
    );
  } else {
    logger.error(
      `Unhandled Error - Status: ${statusCode}, Name: ${name}, Message: ${message}, Stack: ${err.stack}`,
    );
  }

  // Send the error response with all fields
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    name,
    message,
    timestamp,
  });
};

const handle404Error = (req, res, next) => {
  // Handle undefined routes
  const error = new NotFoundError('Resource not found');
  next(error);
};

export { errorHandler, handle404Error };
