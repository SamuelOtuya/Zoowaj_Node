import express from 'express';
import {
  registerUser,
  loginUser,
  retrieveAllUsers,
} from '../controllers/user-ctrl.js';
import postExtraData from '../controllers/profiledetails-ctrl.js';
import { upload } from '../middlewares/file-upload.js';

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
  postExtraData
);


export default router;
