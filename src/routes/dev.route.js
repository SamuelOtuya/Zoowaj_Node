import express from 'express';

import {
  retrieveAggregateData,
  retrieveAllUsers,
  retrieveAllUsersData,
  retrieveAllUsersWithData,
  retrieveCombinedData,
} from '../controllers/user.controller.js';

const router = express.Router();

router.route('/all').get(retrieveAllUsers);
router.route('/data').get(retrieveAllUsersData);
router.route('/get-all').get(retrieveAllUsersWithData);
router.route('/aggregate').get(retrieveAggregateData);
router.route('/combined').get(retrieveCombinedData);

export default router;
