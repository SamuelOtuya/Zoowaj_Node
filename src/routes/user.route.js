import express from 'express';
import { upload } from '../middlewares/file-upload.js';
import {
  registerUser,
  loginUser,
  retrieveAllUsers,
} from '../controllers/user.controller.js';
import {
  getProfileDetails,
  addLike,
  removeLike,
  addFavorite,
  removeFavorite,
  createProfileDetails,
  createProfileImages,
  updateProfilePhoto,
  updateCoverPhotos,
} from '../controllers/profile.controller.js';
import { validateProfileDetails } from '../middlewares/validators/validateProfileDetails.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/all').get(retrieveAllUsers);

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
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 }, // Single profile photo
  ]),
  authMiddleware,
  updateProfilePhoto,
);
router.post(
  '/profile-cover',
  upload.fields([
    { name: 'coverPhotos', maxCount: 6 }, // Up to 6 cover photos
  ]),
  authMiddleware,
  updateCoverPhotos,
);
router.get('/profile/:userId', getProfileDetails);

router.post('/profile/:profileId/like', addLike);
router.delete('/profile/:profileId/like', removeLike);

router.post('/profile/:profileId/favorite', addFavorite);
router.delete('/profile/:profileId/favorite', removeFavorite);

export default router;
