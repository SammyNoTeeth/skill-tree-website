const express = require('express');
const passport = require('passport');

const router = express.Router();

// Kick off Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: true }), (req, res) => {
  // On successful authentication redirect to front‑end root
  res.redirect(process.env.CLIENT_URL || '/');
});

// GitHub OAuth flow
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login', session: true }), (req, res) => {
  res.redirect(process.env.CLIENT_URL || '/');
});

// Return current user session
router.get('/me', (req, res) => {
  if (req.user) {
    return res.json(req.user);
  }
  res.status(401).json({ error: 'Not authenticated' });
});

// Logout endpoint
router.post('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      console.error(err);
    }
    req.session = null;
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;