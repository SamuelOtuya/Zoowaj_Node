import express from 'express';
import { upload } from '../middlewares/file-upload.js';
import {
  registerUser,
  loginUser,
  retrieveAllUsersWithData,
} from '../controllers/user.controller.js';

import {
  getProfileDetails,
  createProfileDetails,
  createProfileImages,
  updateProfilePhoto,
  updateCoverPhotos,
  getUserProfiles,
  getChatUsers,
  getUserProfileWithMessages
} from '../controllers/profile.controller.js';

import {
  addLike,
  removeLike,
  getAllLikes,
  addFavorite,
  removeFavorite,
  getAllFavorites,
  getLikes,
  getFavorites
} from '../controllers/likes_favorites.controller.js';

import { validateProfileDetails } from '../middlewares/validators/validateProfileDetails.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// router.get('/verify-token', authMiddleware, verifyToken);

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/get').get(retrieveAllUsersWithData);

router.get('/chats', authMiddleware, getChatUsers);
router.get('/profile-with-messages/:userId', authMiddleware, getUserProfileWithMessages);

router.post(
  '/profile',
  validateProfileDetails,
  authMiddleware,
  createProfileDetails,
);

router.post(
  '/profile-images',
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 }, // Single profile photo
    { name: 'coverPhotos', maxCount: 6 }, // Up to 6 cover photos
  ]),
  authMiddleware,
  createProfileImages,
);

router.post(
  '/profile-photo',
  upload.single('profilePhoto'),
  authMiddleware,
  updateProfilePhoto,
);

router.post(
  '/profile-covers',
  upload.fields([{ name: 'coverPhotos' }]),
  authMiddleware,
  updateCoverPhotos,
);

router.get('/profile', authMiddleware, getProfileDetails);
router.get('/profiles', authMiddleware, getUserProfiles);

router.post('/profile/like', addLike);
router.get('/likes', getLikes);
router.get('/profile/likes/all', getAllLikes);
router.delete('/profile/like/remove', removeLike);

router.post('/profile/favorite', addFavorite);
router.get('/favorites', getFavorites);
router.get('/profile/favorites/all', getAllFavorites);
router.delete('/profile/favorite/remove', removeFavorite);

export default router;
