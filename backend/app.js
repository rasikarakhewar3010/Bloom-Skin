const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");

dotenv.config();
require("./config/passport");

const app = express();

// ------------------------------
// ✅ Middleware
// ------------------------------
app.use(express.json());
app.use(cookieParser());

// ✅ CORS: allow frontend to send cookies
app.use(cors({
  origin: process.env.FRONTEND_URL, // e.g. http://localhost:5173
  credentials: true,
}));

// ✅ Express Session with Mongo Store
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === "production", // true in prod only
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// ✅ Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Debug Session (optional for dev)
app.use((req, res, next) => {
  console.log("Session:", req.session);
  console.log("User:", req.user);
  next();
});

// ------------------------------
// ✅ Routes
// ------------------------------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/predict", require("./routes/prediction.routes"));
app.use("/api/history", require("./routes/history.routes"));

// ------------------------------
// ✅ MongoDB & Start Server
// ------------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("❌ DB connection error:", err));
