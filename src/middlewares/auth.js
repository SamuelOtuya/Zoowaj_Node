import { UnauthorizedError } from '../errors/application-error.js';
import logger from '../logger/logger.js';
import AuthService from '../services/auth.service.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new UnauthorizedError('Authorization header is missing or invalid'),
    );
  }

  const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"

  try {
    const decoded = AuthService.decodeToken(token); // Use the decodeToken method
    req.userId = decoded.userId; // Attach userId to req object
    req.email = decoded.email; // Attach email to req object
    logger.debug(`USER ID: ${req.userId}`);
    logger.debug(`USER EMAIL: ${req.email}`);
    next(); // Call next middleware or route handler
  } catch (error) {
    return next(new UnauthorizedError('Invalid or expired token 🚫🚫🚫'));
  }
};

export default authMiddleware;
