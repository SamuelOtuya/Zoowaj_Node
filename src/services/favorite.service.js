import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
} from '../errors/application-error.js';
import logger from '../logger/logger.js';
import ExtraData from '../models/ProfileDetails.js';
import Favorite from '../models/Favorite.js';

class FavoriteService {
    // Add Favorite
    static addFavorite = async (profileId, userId) => {
        try {
        const profile = await ExtraData.findById(profileId);

        if (!profile) {
            throw new NotFoundError('Profile not found');
        }

        // Check if the user already favorited the profile
        const existingFavorite = await Favorite.findOne({ profile: profileId, user: userId });

        if (existingFavorite) {
            return; // Return if already favorited
            // throw new BadRequestError('This profile is already in your favorites');
        }

        // Create a new Favorite document
        const favorite = await Favorite.create({ profile: profileId, user: userId });

        // Add reference to Profile
        profile.favorites.push(favorite._id);
        await profile.save();

        return profile.favorites.length;
        } catch (error) {
        logger.error(`Error Adding Profile ${profileId} to Favorites`, error);
        throw new InternalServerError('An error occurred while adding the profile to favorites');
        }
    };

    // Remove Favorite
    static removeFavorite = async (profileId, userId) => {
        try {
        const profile = await ExtraData.findById(profileId);

        if (!profile) {
            throw new NotFoundError('Profile not found');
        }

        // Find the Favorite document
        const favorite = await Favorite.findOneAndDelete({ profile: profileId, user: userId });

        if (!favorite) {
            throw new BadRequestError('This profile is not in your favorites');
        }

        // Remove reference from Profile
        profile.favorites = profile.favorites.filter((id) => id.toString() !== favorite._id.toString());
        await profile.save();

        return profile.favorites.length;
        } catch (error) {
        logger.error(`Error Removing Profile ${profileId} from Favorites`, error);
        throw new InternalServerError('An error occurred while removing the profile from favorites');
        }
    };

    static async getProfilesThatFavoritedYou(userId) {
      try {
          return await Favorite.find({ profile: userId }).populate('user'); // Profiles that favorited you
      } catch (error) {
          logger.error(`Error fetching profiles that favorited ${userId}`, error);
          throw new InternalServerError('An error occurred while fetching favorites.');
      }
    }

    static async getProfilesYouFavorited(userId) {
        try {
            return await Favorite.find({ user: userId }).populate('profile'); // Profiles you favorited
        } catch (error) {
            logger.error(`Error fetching profiles favorited by ${userId}`, error);
            throw new InternalServerError('An error occurred while fetching favorites.');
        }
    }

    static getAllFavorites = async () => {
      try {
        // Fetch all profiles and their favorites
        const profiles = await ExtraData.find().populate('favorites'); // Ensure favorites are populated
  
        // Aggregate all favorites from all profiles
        const allFavorites = profiles.reduce((acc, profile) => {
          return acc.concat(profile.favorites); // Merge favorites from each profile
        }, []);
  
        return {
          totalFavorites: allFavorites.length,
          favorites: allFavorites, // Return all favorites if needed
        };
      } catch (error) {
        logger.error('Error Fetching All Favorites', error);
        throw new Error('An error occurred while fetching all favorites');
      }
    };
  }
  
  export default FavoriteService;
  