const express = require("express");
const passport = require("passport");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");

// Register
router.post("/register", register);

// Local Login
router.post("/login", passport.authenticate("local", {
  failureRedirect: "/api/auth/login/failed",
}), login);

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out" });
  });
});

// @route   GET /api/auth/google
// @desc    Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// @route   GET /api/auth/google/callback
// @desc    Handle Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/login/failed",
    session: true,
  }),
  (req, res) => {
    //  Redirect to frontend on success
    res.redirect(process.env.FRONTEND_URL || "http://localhost:3000");
  }
);


// Auth failure
router.get("/login/failed", (req, res) => {
  res.status(401).json({ message: "Login failed" });
});

// Auth check route
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});


router.get("/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ user: req.user });
  } else {
    return res.status(401).json({ message: "Not authenticated" });
  }
});


module.exports = router;
