import bcrypt from 'bcrypt'; // Use bcrypt if switching to native bindings
import jwt from 'jsonwebtoken';
import UserService from './user.service.js';
import { InternalServerError } from '../errors/errors.js';
import logger from '../logger/logger.js';

export default class AuthService {
  // Hash the password
  static hashPassword = async (password) => {
    const sanitizedPassword = password.trim();
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
    logger.debug(`Salt Rounds: ${saltRounds}`);
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(sanitizedPassword, salt);
  };

  // Compare passwords
  static comparePasswords = async (password, hash) => {
    const sanitizedPassword = password.trim();
    return await bcrypt.compare(sanitizedPassword, hash);
  };

  // Generate token
  static generateToken = (user) => {
    const payload = { userId: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });
    return token;
  };

  // Get auth User from Token
  static getUserFromToken = async (token) => {
    const payload = await jwt.verify(token, process.env.SECRET);
    const userId = payload.userId;
    return await UserService.getUserById(userId);
  }

  // Validate user credentials
  static validateUserCredentials = async (email, password) => {
    try {
      const user = await UserService.getUserWithPasswordByEmail(email);
      if (user && user.password) {
        const isPasswordValid = await this.comparePasswords(
          password,
          user.password.trim(),
        );
        if (isPasswordValid) {
          return user;
        }
      }
      return null;
    } catch (error) {
      logger.error('Error validating user credentials:', error);
      throw new InternalServerError(
        'Failed to validate user credentials. Please try again.',
      );
    }
  };
}
