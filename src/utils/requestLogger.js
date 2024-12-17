// middlewares/requestLogger.js
import logger from '../logger/logger.js';
import formatTimestamp from './timeFormat.js';

const requestLogger = (req, res, next) => {
  const { method, url, body, query, params } = req;
  const timestamp = new Date().toISOString();

  // Log request details
  logger.debug(
    `Request - Method: ${method}, URL: ${url}, Timestamp: ${formatTimestamp(timestamp)}`,
  );
  logger.debug(`Request Body: ${JSON.stringify(body, null, 2)}`);
  logger.debug(`Request Query: ${JSON.stringify(query, null, 2)}`);
  logger.debug(`Request Params: ${JSON.stringify(params, null, 2)}`);

  // Intercept the response
  const originalSend = res.send;

  res.send = function (body) {
    // Log the response body
    logger.debug(`Response for ${method} ${url} - Status: ${res.statusCode}`);
    logger.debug(
      `Response Body: ${typeof body === 'object' ? JSON.stringify(body) : body}`,
    );

    // Call the original send function
    return originalSend.call(this, body);
  };

  next(); // Proceed to the next middleware or route handler
};

export default requestLogger;
