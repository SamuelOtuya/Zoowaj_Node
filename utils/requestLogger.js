// middlewares/requestLogger.js
import logger from '../logger/logger.js';

const requestLogger = (req, res, next) => {
  const { method, url } = req;
  const timestamp = new Date().toISOString();

  logger.info(`Method: ${method}, URL: ${url}, Timestamp: ${timestamp}`);

  next(); // Proceed to the next middleware or route handler
};

export default requestLogger;
