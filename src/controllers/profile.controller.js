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

export const getChatUsers = asyncHandler(async (req, res, next) => {
  try {
    const currentUserId = req.userId; // Assuming you have user info in request
    const users = await ProfileService.getChatUsersList(currentUserId);
    res.status(200).json(users);
  } catch (error) {
    logger.error('Controller error getting chat users:', error);
    next(error);
  }
});

// Get a single user's profile with message data
export const getUserProfileWithMessages = asyncHandler(async (req, res, next) => {
  try {
    const currentUserId = req.userId; // Current user
    const { userId: otherUserId } = req.params; // User whose profile we're viewing
    const profile = await ProfileService.getUserProfileWithMessages(currentUserId, otherUserId);
    res.status(200).json(profile);
  } catch (error) {
    logger.error('Controller error getting user profile:', error);
    next(error);
  }
});