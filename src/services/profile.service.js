import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../errors/application-error.js';
import logger from '../logger/logger.js';
import ExtraData from '../models/ProfileDetails.js';
import mongoose from 'mongoose';

export default class ProfileService {
  static getById = async (id) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError('Invalid user ID');
      }
      const user = await ExtraData.findById(id);
      if (!user) return null;
      logger.debug(`retrieved ${user.about.username}'s Data`);
      return user;
    } catch (error) {
      logger.error('Error retrieving user Data:', error);
      throw new InternalServerError('Error retrieving user Data');
    }
  };

  static getOne = async (userId) => {
    try {
      const user = await ExtraData.findOne({ userId });
      if (!user) return null;
      logger.debug(`retrieved ${user.about.username}'s Data`);
      return user;
    } catch (error) {
      logger.error('Error retrieving user Data:', error);
      throw new InternalServerError('Error retrieving user Data');
    }
  };

  static getAll = async () => {
    try {
      const profileData = await ExtraData.find();
      logger.debug(`retrieved ${profileData.length} profile data`);
      return profileData;
    } catch (error) {
      logger.error('Error retrieving profile data:', error);
      throw new InternalServerError('Error retrieving profile data');
    }
  };

  static createUserProfileDetails = async (userId, data) => {
    try {
      // Check if a profile with the given userId already exists
      const existingProfile = await ExtraData.findOne({ userId });

      if (existingProfile) {
        logger.error(`Profile already exists for this user ${userId}`);
        throw new BadRequestError('Profile already exists for this user.');
      }

      // Create a new profile object with userId and other data
      const profile = new ExtraData({
        userId, // Use userId directly
        ...data, // Spread the rest of the data into the profile
      });

      // Save the profile to the database
      return await profile.save();
    } catch (error) {
      logger.error(`Error creating user's profile details: ${error.message}`);

      // Check if it's a validation error
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Validation failed: ' + error.message);
      }

      throw new InternalServerError('Account setup unsuccessful, try again');
    }
  };

  static createProfileImages = async (
    userId,
    profilePhotoData,
    coverPhotosData,
  ) => {
    try {
      // Find or create a profile document
      let profile = await ExtraData.findOne({ userId });

      if (!profile) {
        logger.warn('Account not found');
        throw new BadRequestError('Account not found');
      }

      // Update profile with uploaded photos
      profile.profilePhoto = profilePhotoData;
      profile.coverPhotos = coverPhotosData;

      return await profile.save();
    } catch (error) {
      logger.error(error);
      throw new InternalServerError('Could not update Profile Images');
    }
  };
}
