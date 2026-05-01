const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const path = require("path");
const helmet = require("helmet");
const { apiLimiter } = require("./middleware/rateLimiter");

dotenv.config();
require("./config/passport");

const app = express();

// ------------------------------
// ✅ Security Middleware
// ------------------------------

// Helmet — Sets secure HTTP headers (XSS protection, HSTS, Content-Security-Policy, etc.)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow Cloudinary images to load
}));

const compression = require('compression');
app.use(compression()); // Compress all responses for performance

// Trust the first proxy (required for secure cookies when deployed on Render behind a load balancer)
app.set("trust proxy", 1);

// Body size limits — Prevents payload-based DoS attacks
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(cookieParser());

// Static files for local image fallback
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS — Strict origin control with credentials
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://bloomskin.vercel.app",
  "http://localhost:5173"
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ------------------------------
// ✅ Session Management
// ------------------------------
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
      secure: process.env.NODE_ENV === "production", // Must be true in production (HTTPS)
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 'none' required for cross-domain
      domain: undefined, // Let the browser determine the domain
    },
  })
);

// Passport Authentication
app.use(passport.initialize());
app.use(passport.session());

// Global API rate limiter (applies to all /api routes)
app.use("/api", apiLimiter);

// ------------------------------
// ✅ Routes
// ------------------------------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/predict", require("./routes/prediction.routes"));
app.use("/api/history", require("./routes/history.routes"));
app.use("/api/recommendations", require("./routes/recommendation.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/routine", require("./routes/routine.routes"));

// ------------------------------
// ✅ Health Check (For Keep-Alive Pings)
// ------------------------------
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: Date.now() });
});

// Temporary diagnostic endpoint — check email service configuration
// REMOVE THIS AFTER DEBUGGING
app.get('/health/email-check', async (req, res) => {
  const result = {
    resendApiKeySet: !!process.env.RESEND_API_KEY,
    resendFromEmail: process.env.RESEND_FROM_EMAIL || "NOT SET (will use default onboarding@resend.dev)",
    frontendUrl: process.env.FRONTEND_URL || "NOT SET",
    nodeEnv: process.env.NODE_ENV || "NOT SET",
  };

  // Test Resend API connectivity
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = require("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.domains.list();
      if (error) {
        // "restricted to only send emails" means the key IS valid, just send-only permissions
        if (error.message && error.message.includes("restricted")) {
          result.resendStatus = "CONNECTED (send-only key)";
        } else {
          result.resendStatus = "API_KEY_INVALID";
          result.resendError = error.message || JSON.stringify(error);
        }
      } else {
        result.resendStatus = "CONNECTED (full access)";
        result.domains = data?.data?.map(d => d.name) || [];
      }
    } catch (err) {
      result.resendStatus = "FAILED";
      result.resendError = err.message;
    }
  } else {
    result.resendStatus = "SKIPPED — RESEND_API_KEY not set";
  }

  res.json(result);
});

// ------------------------------
// ✅ Global Error Handler
// ------------------------------
// Must be defined AFTER all routes. Catches any unhandled errors
// and returns a consistent JSON response instead of leaking stack traces.
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again.'
      : err.message || 'Internal Server Error',
  });
});

// ------------------------------
// ✅ MongoDB Connection & Server Start
// ------------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, "0.0.0.0", () => {
      console.log(`✅ Backend Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });