import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/application-error.js';
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

export const addLike = asyncHandler(async (req, res) => {
  const { profileId } = req.params;
  const { userId } = req.body; // ID of the user liking the profile

  const likes = await ProfileService.addLike(profileId, userId);

  res.status(200).json({ msg: 'Profile liked successfully', likes: likes });
});

export const removeLike = asyncHandler(async (req, res) => {
  const { profileId } = req.params;
  const { userId } = req.body; // ID of the user adding the profile to favorites

  const likes = await ProfileService.removeLike(profileId, userId);

  res.status(200).json({ msg: 'Like removed successfully', likes: likes });
});

export const addFavorite = asyncHandler(async (req, res) => {
  const { profileId } = req.params;
  const { userId } = req.body; // ID of the user adding the profile to favorites

  const favorites = await ProfileService.addFavorite(profileId, userId);

  res.status(200).json({
    msg: 'Profile added to favorites',
    favorites: favorites,
  });
});

export const removeFavorite = asyncHandler(async (req, res) => {
  const { profileId } = req.params;
  const { userId } = req.body;

  const favorites = await ProfileService.removeFavorite(profileId, userId);

  res.status(200).json({
    msg: 'Profile removed from favorites',
    favorites: favorites,
  });
});
