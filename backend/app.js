const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const path = require("path"); // Added this line
const skinDetectionRoutes = require('./routes/skinDetection');

dotenv.config();
require("./config/passport");

const app = express();

// ------------------------------
// ✅ Middleware
// ------------------------------
app.use(express.json());
app.use(cookieParser());

// For static files and model outputs
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL, // e.g. http://localhost:3000
  credentials: true,
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "keyboard cat",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Debug session/user in development
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log("Session:", req.session);
    console.log("User:", req.user);
    next();
  });
}

// ------------------------------
// ✅ Routes
// ------------------------------
app.use("/api/auth", require("./routes/auth"));
app.use('/api/skin', skinDetectionRoutes); // Moved this with other routes

// ------------------------------
// ✅ Connect to MongoDB & Start Server
// ------------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Uploads directory: ${path.join(__dirname, 'uploads')}`);
      console.log(`Outputs directory: ${path.join(__dirname, 'outputs')}`);
    });
  })
  .catch((err) => console.error("DB connection error:", err));