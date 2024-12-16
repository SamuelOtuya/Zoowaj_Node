import {
  ApplicationError,
  InternalServerError,
} from '../errors/application-error.js';
import logger from '../logger/logger.js';

const errorHandler = (err, req, res, next) => {
  // Log the error with detailed information
  logger.error(
    `Error caught by errorHandler: ${err.message}` //\n` +
    // `Stack Trace: ${err.stack || 'No stack trace available'}`,
  );

  if (err instanceof ApplicationError) {
    // Custom application-level error handling
    return res.status(err.status).json(err.serialize());
  } else {
    // Handle other unanticipated errors
    const internalError = new InternalServerError();
    return res.status(internalError.status).json(internalError.serialize());
  }
};

export default errorHandler;
