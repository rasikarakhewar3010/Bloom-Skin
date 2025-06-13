const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const predictRoutes = require('./routes/predict');
dotenv.config();
require("./config/passport");

const app = express();

// ------------------------------
// ✅ Middleware
// ------------------------------
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_URL, // e.g. http://localhost:3000
  credentials: true,
}));

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
app.use((req, res, next) => {
  console.log("Session:", req.session);
  console.log("User:", req.user);
  next();
});

// ------------------------------
// ✅ Routes
// ------------------------------
app.use("/api/auth", require("./routes/auth"));
app.use('/api/predict', predictRoutes);


// ------------------------------
// ✅ Connect to MongoDB & Start Server
// ------------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(" DB connection error:", err));