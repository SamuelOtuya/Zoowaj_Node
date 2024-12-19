import logger from '../logger/logger.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import AuthService from './auth.service.js';
import {
  BadRequestError,
  InternalServerError,
} from '../errors/application-error.js';

export default class UserService {
  static getOne = async (userId) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new BadRequestError('Invalid user ID');
      }
      const user = await User.findOne({ _id: userId });
      if (!user) return null;
      logger.debug(`retrieved ${user.about.username}'s Data`);
      return user;
    } catch (error) {
      logger.error('Error retrieving user Data:', error);
      throw new InternalServerError('Error retrieving user Data');
    }
  };

  // Retrieve all {users}
  static getAll = async () => {
    try {
      const users = await User.find();
      logger.debug(`retrieved ${users.length} users`);
      return users;
    } catch (error) {
      logger.error('Error retrieving users:', error);
      throw new InternalServerError('Error retrieving users');
    }
  };

  // Retrieve a [User] by ID
  static getUserById = async (id) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError('Invalid user ID');
      }
      const user = await User.findById(id); //.select('-password');
      if (!user) return null;
      return user;
    } catch (error) {
      logger.error('Error retrieving user:', error);
      throw new InternalServerError('Error retrieving user');
    }
  };

  // Retrieve a [User] by email
  static getUserByEmail = async (email) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return null;
      return user;
    } catch (error) {
      logger.error('Error retrieving user:', error);
      throw new InternalServerError('Error retrieving user');
    }
  };

  // Create a new [User]
  static createUser = async (email, password) => {
    try {
      //Hash user password
      const hashedPassword = await AuthService.hashPassword(password.trim());

      // Create the user with the hashed password
      const user = new User({ email, password: hashedPassword });
      await user.save();

      logger.debug(`User Successfully created ${user.email}`);
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw new InternalServerError('Unable to create user');
    }
  };

  // Retrieve [User] with hashed password field
  static getUserWithPasswordByEmail = async (email) => {
    try {
      return await User.findOne({ email }).select('+password');
    } catch (error) {
      logger.error('Error retrieving user with password:', error);
      throw new InternalServerError('Fetch Request Failure');
    }
  };

  // Retrieve [User] with hashed password field
  static getUserWithPasswordById = async (id) => {
    try {
      return await User.findById(id).select('+password');
    } catch (error) {
      logger.error('Error retrieving user with password:', error);
      throw new InternalServerError('Fetch Request Failure');
    }
  };

  // Retrieve all {Users} and add Profile Details to the {Users} object
  static getAllWithData = async () => {
    try {
      const usersWithProfile = await User.find().populate('extraData');
      logger.debug(`Retrieved ${usersWithProfile.length} user's profile data`);
      return usersWithProfile;
    } catch (error) {
      logger.error('Error retrieving users with profile data:', error);
      throw new InternalServerError('Error retrieving users with profile data');
    }
  };

  // Retrieve a [User] and add Profile Details to the [User] object
  static getOneWithData = async (userId) => {
    try {
      const user = await User.findOne({ userId }).populate('extraData');
      if (!user) return null;
      logger.debug(`Retrieved ${user.about.username} account with Data`);
      return user;
    } catch (error) {
      logger.error('Error retrieving users with their Data:', error);
      throw new InternalServerError('Error retrieving users with their Data');
    }
  };

  //Retrieve all {Users} and add Profile Details to the [User] object
  static getAllCombinedData = async () => {
    try {
      const usersWithProfile = await User.find().populate('extraData');

      // Combine user and profile details
      const combinedData = usersWithProfile.map((user) => {
        return {
          ...user.toObject(), // Convert Mongoose document to plain object
          profile: user.extraData, // Add profile data under a "profile" key
        };
      });

      logger.debug(
        `Retrieved ${combinedData.length} combined user and profile data`,
      );
      return combinedData;
    } catch (error) {
      logger.error('Error retrieving combined data:', error);
      throw new InternalServerError('Error retrieving combined data');
    }
  };

  //Retrieve all Users and add Profile Details to the [User] object
  static getAggregateData = async () => {
    try {
      const usersWithExtraData = await User.aggregate([
        {
          $lookup: {
            from: 'ExtraData', // The name of your ExtraData collection
            localField: '_id',
            foreignField: 'userId',
            as: 'extraData',
          },
        },
        {
          $unwind: {
            path: '$extraData',
            preserveNullAndEmptyArrays: true, // Optional: keep users without extra data
          },
        },
      ]);
      logger.debug(
        `Retrieved ${usersWithExtraData.length} users with their Data`,
      );
      return usersWithExtraData;
    } catch (error) {
      logger.error('Error retrieving users with their Data:', error);
      throw new InternalServerError('Error retrieving users with their Data');
    }
  };
}
