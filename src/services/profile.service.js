import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../errors/application-error.js';
import logger from '../logger/logger.js';
import ExtraData from '../models/ProfileDetails.js';
import Message from '../models/Message.js';
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

  static async getUsersWithMessages() {
    try {
      const profileData = await ExtraData.find()
        .select('profilePhoto about.username about.first_name about.last_name userId');

      const usersWithMessages = await Promise.all(
        profileData.map(async (profile) => {
          // Get latest message
          const latestMessage = await Message.findOne({
            $or: [
              { userId: profile.userId },
              { recipientId: profile.userId }
            ]
          })
          .sort({ createdAt: -1 })
          .lean();

          // Get unread count
          const unreadCount = await Message.countDocuments({
            recipientId: profile.userId,
            read: false
          });

          return {
            id: profile.userId,
            username: profile.about?.username,
            profilePicture: profile.profilePhoto?.url || null,
            fullName: `${profile.about?.first_name || ''} ${profile.about?.last_name || ''}`.trim(),
            lastMessage: latestMessage?.text || null,
            lastMessageTime: latestMessage?.createdAt || null,
            unreadCount
          };
        })
      );

      logger.debug(`Retrieved ${usersWithMessages.length} users with messages`);
      return usersWithMessages;

    } catch (error) {
      logger.error('Error retrieving users with messages:', error);
      throw new InternalServerError('Error retrieving users with messages');
    }
  }

  static async getUserProfileWithMessages(userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new BadRequestError('Invalid user ID');
      }

      const profile = await ExtraData.findOne({ userId });
      if (!profile) {
        throw new NotFoundError('Profile not found');
      }

      // Get message-related data
      const [latestMessage, unreadCount] = await Promise.all([
        Message.findOne({
          $or: [{ userId }, { recipientId: userId }]
        })
        .sort({ createdAt: -1 })
        .lean(),
        
        Message.countDocuments({
          recipientId: userId,
          read: false
        })
      ]);

      const profileWithMessages = {
        ...profile.toObject(),
        messaging: {
          lastMessage: latestMessage?.text || null,
          lastMessageTime: latestMessage?.createdAt || null,
          unreadCount
        }
      };

      logger.debug(`Retrieved profile with messages for user ${userId}`);
      return profileWithMessages;

    } catch (error) {
      logger.error(`Error retrieving user profile with messages: ${error.message}`);
      throw error instanceof Error ? error : new InternalServerError('Error retrieving user profile');
    }
  }
}
