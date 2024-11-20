import logger from '../logger/logger.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import AuthService from './auth.service.js';
import { BadRequestError, InternalServerError } from '../errors/errors.js';

export default class UserService {
  // Retrieve all users
  static getAll = async () => {
    try {
      const users = await User.find();
      logger.info(`retrieved ${users.length} users`);
      return users;
    } catch (error) {
      logger.error('Error retrieving users:', error);
      throw new InternalServerError('Error retrieving users');
    }
  };

  // Retrieve a user by ID
  static getUserById = async (id) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID');
      }
      const user = await User.findById(id); //.select('-password');
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      logger.error('Error retrieving user:', error);
      throw new InternalServerError('Error retrieving user');
    }
  };

  // Retrieve a user by email
  static getUserByEmail = async (email) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      logger.error('Error retrieving user:', error);
      throw new InternalServerError('Error retrieving user');
    }
  };

  // Create a new user
  static createUser = async (email, password) => {
    try {
      // Check if the email already exists
      const existingUser = await this.getUserByEmail(email);
      if (existingUser) {
        throw new BadRequestError('Email already exists');
      }

      //Hash user password
      const hashedPassword = await AuthService.hashPassword(password);

      // Create the user with the hashed password
      const user = new User({ email, password: hashedPassword });
      await user.save();

      logger.info(`User Successfully created ${user.email}`);
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw new InternalServerError('Error creating user');
    }
  };

  static getUserWithPasswordByEmail = async (email) => {
    try {
      return await User.findOne({ email }).select('+password');
    } catch (error) {
      logger.error('Error retrieving user with password:', error);
      throw new InternalServerError('Fetch Request Failure');
    }
  };

  static getUserWithPasswordById = async (id) => {
    try {
      return await User.findById(id).select('+password');
    } catch (error) {
      logger.error('Error retrieving user with password:', error);
      throw new InternalServerError('Fetch Request Failure');
    }
  };
}
