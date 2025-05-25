const express = require("express");
const passport = require("passport");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");

// Register
router.post("/register", register);

// Login
router.post("/login", passport.authenticate("local"), login);

// Logout
router.get("/logout", logout);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.FRONTEND_URL,
    failureRedirect: "/login/failed",
  })
);

router.get("/login/failed", (req, res) => {
  res.status(401).json({ message: "Login failed" });
});

module.exports = router;
