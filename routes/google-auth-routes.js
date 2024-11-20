import express from 'express';
import passport from '../passport.js';

const router = express.Router();

// Redirect to Google's OAuth page
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

// Handle callback from Google
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // Generate a JWT token for the user
    const token = req.user.createJWT();

    res.status(200).json({ token, user: req.user });
  },
);

export default router;
