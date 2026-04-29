const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// --- Session Serialization ---
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// --- Local Strategy ---
passport.use(new LocalStrategy({ usernameField: "email" },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.trim().toLowerCase() });
      if (!user || !user.password) {
        return done(null, false, { message: "Invalid email or password." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Invalid email or password." });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// --- Google OAuth Strategy ---
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production'
    ? "https://bloom-skin-backend.onrender.com/api/auth/google/callback"
    : (process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback"),
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    if (user) return done(null, user);

    // Check if user exists with same email (link accounts)
    const email = profile.emails?.[0]?.value;
    if (email) {
      user = await User.findOne({ email });
      if (user) {
        // Link Google ID to existing account
        user.googleId = profile.id;
        if (!user.name) user.name = profile.displayName;
        await user.save();
        return done(null, user);
      }
    }

    // Create new user
    const newUser = await User.create({
      googleId: profile.id,
      name: profile.displayName,
      email: email,
    });
    done(null, newUser);
  } catch (err) {
    done(err, null);
  }
}));