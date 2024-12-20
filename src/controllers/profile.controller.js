import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/application-error.js';
import asyncHandler from '../utils/asyncHandler.js';
import logger from '../logger/logger.js';
import MediaService from '../services/media.service.js';
import ProfileService from '../services/profile.service.js';

export const createProfileDetails = asyncHandler(async (req, res) => {
  const { body, userId } = req;

  // Call the service to create a user profile
  const profile = await ProfileService.createUserProfileDetails(userId, body);

  // If profile creation fails, this will not happen due to error handling in service
  logger.info(
    `User profile created successfully: ${JSON.stringify(profile, null, 2)}`,
  );

  res.status(StatusCodes.CREATED).json({ profile });
});

export const createProfileImages = asyncHandler(async (req, res) => {
  const { files, userId } = req;

  // Check if files are uploaded
  if (!files || (!files.profilePhoto && !files.coverPhotos)) {
    throw new BadRequestError('No valid files uploaded');
  }

  const profilePhoto = files.profilePhoto?.[0]; // Use optional chaining
  const coverPhotos = files.coverPhotos || [];

  // Upload profile photo
  const profilePhotoData = await MediaService.uploadProfilePhoto(
    profilePhoto.path,
  );

  // Upload cover photos
  const coverPhotosData = await MediaService.uploadCoverPhotos(coverPhotos);

  const profile = await ProfileService.createProfileImages(
    userId,
    profilePhotoData,
    coverPhotosData,
  );

  res.status(StatusCodes.CREATED).json({ profile });
});

export const updateProfilePhoto = asyncHandler(async (req, res) => {
  const { file, userId } = req;

  // Check if files are uploaded
  if (!file.profilePhoto) {
    throw new BadRequestError('No valid file uploaded');
  }

  const profilePhoto = file.profilePhoto?.[0]; // Use optional chaining

  // Upload profile photo
  const profilePhotoData = await MediaService.uploadProfilePhoto(
    profilePhoto.path,
  );

  const profile = await ProfileService.createProfileImages(
    userId,
    profilePhotoData,
  );

  res.status(StatusCodes.CREATED).json({ profile });
});

export const updateCoverPhotos = asyncHandler(async (req, res) => {
  const { files, userId } = req;

  // Check if files are uploaded
  if (!files || !files.coverPhotos) {
    throw new BadRequestError('No valid files uploaded');
  }

  const coverPhotos = files.coverPhotos || [];

  // Upload cover photos
  const coverPhotosData = await MediaService.uploadCoverPhotos(coverPhotos);

  const profile = await ProfileService.createProfileImages(
    userId,
    coverPhotosData,
  );

  res.status(StatusCodes.CREATED).json({ profile });
});

export const getProfileDetails = asyncHandler(async (req, res) => {
  const userId = req.userId;

  // Fetch profile details
  const profile = await ProfileService.getOne(userId);

  // Check if profile exists
  if (!profile) {
    throw new NotFoundError('Profile not found for the given User ID');
  }

  // Send response
  res.status(StatusCodes.OK).json({ profile: profile });
});

export const getUserProfiles = asyncHandler(async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    throw new UnauthorizedError('Authorization Required');
  }

  // Fetch user profiles
  const profiles = await ProfileService.getAll();

  // Send response
  res.status(StatusCodes.OK).json(profiles);
});

export const addLike = asyncHandler(async (req, res) => {
  try {
    // const { profileId } = req.params;
    const { userId, targetId } = req.body; // ID of the user liking the profile

    const profile = await ProfileData.findById(userId);

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    // Check if user already liked the profile
    if (profile.likes.includes(targetId)) {
      throw new BadRequestError('You have already liked this profile');
    }

    profile.likes.push(targetId);
    await profile.save();

    res
      .status(200)
      .json({ msg: 'Profile liked successfully', likes: profile.likes.length });
  } catch (error) {
    console.error(error);
    throw new InternalServerError('An error occurred while liking the profile');
  }
});

export const removeLike = asyncHandler(async (req, res) => {
  try {
    const { userId, targetId } = req.body; // ID of the user adding the profile to favorites

    const profile = await ProfileData.findById(userId);

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    profile.likes = profile.likes.filter((id) => id.toString() !== targetId);
    await profile.save();

    res
      .status(200)
      .json({ msg: 'Like removed successfully', likes: profile.likes.length });
  } catch (error) {
    console.error(error);
    throw new InternalServerError('An error occurred while removing the like');
  }
});

export const addFavorite = asyncHandler(async (req, res) => {
  try {
    const { userId, targetId } = req.body; // ID of the user adding the profile to favorites

    const profile = await ProfileData.findById(userId);

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    // Check if user already {favorite} the profile
    if (profile.favorites.includes(targetId)) {
      throw new BadRequestError('This profile is already in your favorites');
    }

    profile.favorites.push(targetId);
    await profile.save();

    res.status(200).json({
      msg: 'Profile added to favorites',
      favorites: profile.favorites.length,
    });
  } catch (error) {
    console.error(error);
    throw new InternalServerError(
      'An error occurred while adding the profile to favorites',
    );
  }
});

export const removeFavorite = asyncHandler(async (req, res) => {
  try {
    const { userId, targetId } = req.body;

    const profile = await ProfileData.findById(userId);

    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    profile.favorites = profile.favorites.filter(
      (id) => id.toString() !== targetId,
    );
    await profile.save();

    res.status(200).json({
      msg: 'Profile removed from favorites',
      favorites: profile.favorites.length,
    });
  } catch (error) {
    console.error(error);
    throw new InternalServerError(
      'An error occurred while removing the profile from favorites',
    );
  }
});
