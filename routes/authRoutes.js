const express = require('express');
const router = express.Router();
const passport = require('passport');

// Start Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/docs'); // or wherever you want users after login
  }
);

module.exports = router;
