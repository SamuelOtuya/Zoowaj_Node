import express from 'express';
import { upload } from '../middlewares/file-upload.js';
import {
  registerUser,
  loginUser,
  retrieveAllUsers,
} from '../controllers/user.controller.js';
import {
  postProfileDetails,
  getProfileDetails,
  addLike,
  removeLike,
  addFavorite,
  removeFavorite, 
} from '../controllers/profile.controller.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/all').get(retrieveAllUsers);

router.post(
  '/profile',
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 }, // Single profile photo
    { name: 'coverPhotos', maxCount: 6 },  // Up to 6 cover photos
  ]),
  postProfileDetails
);
router.get("/profile/:userId", getProfileDetails);


router.post("/profile/:profileId/like", addLike);
router.delete("/profile/:profileId/like", removeLike);

router.post("/profile/:profileId/favorite", addFavorite);
router.delete("/profile/:profileId/favorite", removeFavorite);

export default router;
