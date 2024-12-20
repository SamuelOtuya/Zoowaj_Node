import asyncHandler from '../utils/asyncHandler.js';
import LikeService from '../services/like.service.js';
import FavoriteService from '../services/favorite.service.js';

// Like Operations
export const addLike = asyncHandler(async (req, res) => {
    const { userId, profileId } = req.body; // ID of the user liking the profile

    const likes = await LikeService.addLike(profileId, userId);

    res.status(200).json({ msg: 'Profile liked successfully', likes: likes });
});
  
export const removeLike = asyncHandler(async (req, res) => {
    const { userId, profileId } = req.body; // ID of the user adding the profile to favorites

    const likes = await LikeService.removeLike(profileId, userId);

    res.status(200).json({ msg: 'Like removed successfully', likes: likes });
});

export const getAllLikes = asyncHandler(async (req, res) => {
    const { totalLikes, likes } = await LikeService.getAllLikes();
    
    res.status(200).json({
        msg: 'All likes retrieved successfully',
        totalLikes,
        likes,
    });
});

// Favorite Operations
export const addFavorite = asyncHandler(async (req, res) => {
    const { userId, profileId } = req.body; // ID of the user adding the profile to favorites

    const favorites = await FavoriteService.addFavorite(profileId, userId);

    res.status(200).json({
        msg: 'Profile added to favorites',
        favorites: favorites,
    });
});

export const removeFavorite = asyncHandler(async (req, res) => {
    const { userId, profileId } = req.body;

    const favorites = await FavoriteService.removeFavorite(profileId, userId);

    res.status(200).json({
        msg: 'Profile removed from favorites',
        favorites: favorites,
    });
});

export const getAllFavorites = asyncHandler(async (req, res) => {
    const { totalFavorites, favorites } = await FavoriteService.getAllFavorites();

    res.status(200).json({
        msg: 'All favorites retrieved successfully',
        totalFavorites,
        favorites,
    });
});