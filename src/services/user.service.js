import logger from '../logger/logger.js';
import User from '../models/User.js';
import ExtraData from '../models/ProfileDetails.js';
import mongoose from 'mongoose';
import AuthService from './auth.service.js';
import {
  BadRequestError,
  InternalServerError,
} from '../errors/application-error.js';
import CloudinaryService from './cloudinary.service.js';

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
      //Hash user password
      const hashedPassword = await AuthService.hashPassword(password.trim());

      // Create the user with the hashed password
      const user = new User({ email, password: hashedPassword });
      await user.save();

      logger.info(`User Successfully created ${user.email}`);
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw new InternalServerError('Unable to create user');
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

  static createUserProfileDetails = async (userId, data) => {
    try {
      // Check if a profile with the given userId already exists
      const existingProfile = await ExtraData.findOne({ userId });

      if (existingProfile) {
        logger.error(`Profile already exists for this user ${userId}`)
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

  static uploadProfilePhoto = async (profilePhotoPath) => {
    try {
      const { url, public_id } = await CloudinaryService.upload(
        profilePhotoPath,
        'profile_photos',
      );

      return {
        url,
        public_id,
      };
    } catch (error) {
      logger.error('Profile photo upload failed:', error);
      throw new InternalServerError('Profile photo upload failed');
    }
  };

  static uploadCoverPhotos = async (coverPhotos) => {
    if (!Array.isArray(coverPhotos) || coverPhotos.length === 0) {
      throw new BadRequestError('No cover photos provided for upload.');
    }

    const coverPhotosArray = [];
    const uploadErrors = [];

    for (const photo of coverPhotos) {
      try {
        // Assuming 'photo' contains the necessary data (e.g., file path or buffer)
        const { url, public_id } = await CloudinaryService.upload(
          photo.path,
          'cover_photos',
        );
        coverPhotosArray.push({
          url,
          public_id,
        });
      } catch (error) {
        logger.error('Cover photo upload failed:', error);
        uploadErrors.push({ photo, error: error.message }); // Collect errors related to specific photos
      }
    }

    if (uploadErrors.length > 0) {
      logger.warn(
        `Some cover photos failed to upload: ${JSON.stringify(uploadErrors)}`,
      );
      throw new InternalServerError('Some cover photos failed to upload.');
    }

    return coverPhotosArray; // Return successfully uploaded photos
  };
}
