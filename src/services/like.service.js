import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../errors/application-error.js';
import logger from '../logger/logger.js';
import ExtraData from '../models/ProfileDetails.js';
import Like from '../models/Like.js';

class LikeService {
  static addLike = async (profileId, userId) => {
    try {
      const profile = await ExtraData.findById(profileId);

      if (!profile) {
        throw new NotFoundError('Profile not found');
      }

      // Check if user already liked the profile
      const existingLike = await Like.findOne({ profile: profileId, user: userId });

      if (existingLike) {
        return; // Return if already liked
        // throw new BadRequestError('You have already liked this profile');
      }

      // Create a new Like document
      const like = await Like.create({ profile: profileId, user: userId });

      // Add reference to Profile
      profile.likes.push(like._id);
      await profile.save();

      return profile.likes.length;
    } catch (error) {
      logger.error(`Error Liking Profile ${profileId}`, error);
      throw new InternalServerError('An error occurred while liking the profile');
    }
  };

  // Remove Like
  static removeLike = async (profileId, userId) => {
    try {
      const profile = await ExtraData.findById(profileId);

      if (!profile) {
        throw new NotFoundError('Profile not found');
      }

      // Find the Like document
      const like = await Like.findOneAndDelete({ profile: profileId, user: userId });

      if (!like) {
        throw new BadRequestError('You have not liked this profile');
      }

      // Remove reference from Profile
      profile.likes = profile.likes.filter((id) => id.toString() !== like._id.toString());
      await profile.save();

      return profile.likes.length;
    } catch (error) {
      logger.error(`Error Un-Liking Profile ${profileId}`, error);
      throw new InternalServerError('An error occurred while removing like from profile');
    }
  };

  static async getProfilesThatLikedYou(userId) {
    try {
        return await Like.find({ profile: userId }).populate('user'); // Profiles that liked you
    } catch (error) {
        logger.error(`Error fetching profiles that liked ${userId}`, error);
        throw new InternalServerError('An error occurred while fetching likes.');
    }
  }

  static async getProfilesYouLiked(userId) {
      try {
          return await Like.find({ user: userId }).populate('profile'); // Profiles you liked
      } catch (error) {
          logger.error(`Error fetching profiles liked by ${userId}`, error);
          throw new InternalServerError('An error occurred while fetching likes.');
      }
  }

  static getAllLikes = async () => {
    try {
      // Fetch all profiles and their likes
      const profiles = await ExtraData.find().populate('likes'); // Ensure likes are populated

      // Aggregate all likes from all profiles
      const allLikes = profiles.reduce((acc, profile) => {
        return acc.concat(profile.likes); // Merge likes from each profile
      }, []);

      return {
        totalLikes: allLikes.length,
        likes: allLikes, // Return all likes if needed
      };
    } catch (error) {
      logger.error('Error Fetching All Likes', error);
      throw new Error('An error occurred while fetching all likes');
    }
  };
}

export default LikeService;
