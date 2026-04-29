const express = require("express");
const passport = require("passport");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const { forgotPassword, resetPassword } = require("../controllers/passwordController");
const { authLimiter } = require("../middleware/rateLimiter");

// @route   POST /api/auth/register
// @desc    Register a new user account
// @access  Public (rate-limited)
router.post("/register", authLimiter, register);

// @route   POST /api/auth/login
// @desc    Authenticate user with email/password
// @access  Public (rate-limited)
router.post("/login", authLimiter, passport.authenticate("local", {
  failureRedirect: "/api/auth/login/failed",
}), login);

// @route   GET /api/auth/logout
// @desc    Destroy session and clear cookie
// @access  Private
router.get("/logout", logout);

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth 2.0 flow
// @access  Public
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// @route   GET /api/auth/google/callback
// @desc    Handle Google OAuth callback
// @access  Public
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/login/failed",
    session: true,
  }),
  (req, res) => {
    const frontendUrl = process.env.NODE_ENV === 'production' 
      ? 'https://bloomskin.vercel.app' 
      : (process.env.FRONTEND_URL || "http://localhost:5173");
    res.redirect(frontendUrl);
  }
);

// @route   GET /api/auth/login/failed
// @desc    Auth failure handler
// @access  Public
router.get("/login/failed", (req, res) => {
  res.status(401).json({ error: "Authentication failed. Please check your credentials." });
});

// @route   GET /api/auth/me
// @desc    Get current authenticated user's info
// @access  Private
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ user: req.user });
  }
  res.status(401).json({ error: "Not authenticated." });
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
const { updateProfile } = require("../controllers/authController");
router.put("/profile", updateProfile);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public (rate-limited)
router.post("/forgot-password", authLimiter, forgotPassword);

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password with token
// @access  Public (rate-limited)
router.post("/reset-password/:token", authLimiter, resetPassword);

module.exports = router;
