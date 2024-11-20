import express from 'express';
import {
  registerUser,
  loginUser,
  retrieveAllUsers,
} from '../controllers/user-ctrl.js';
import postExtraData from '../controllers/profiledetails-ctrl.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/extra-data').post(postExtraData);
router.route('/all').get(retrieveAllUsers);

export default router;
