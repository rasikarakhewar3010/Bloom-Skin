const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// --- Email transporter ---
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// @desc    Send password reset link to user's email
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    // Pre-flight: ensure email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Forgot password error: EMAIL_USER or EMAIL_PASS environment variables are not set.");
      return res.status(500).json({ error: "Email service is not configured. Please contact support." });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return res.json({
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // If user signed up with Google only (no password), tell them
    if (user.googleId && !user.password) {
      return res.json({
        message: "This account uses Google Sign-In. Please log in with Google instead.",
      });
    }

    // Generate a secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save token and expiry (1 hour) to user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Build reset URL (frontend page) — use production URL as fallback
    const frontendUrl = process.env.FRONTEND_URL && process.env.FRONTEND_URL !== "http://localhost:5173"
      ? process.env.FRONTEND_URL
      : "https://bloomskin.vercel.app";
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    // Send email with connection verification
    const transporter = createTransporter();
    
    // Verify SMTP connection before sending (helps catch auth errors early)
    try {
      await transporter.verify();
    } catch (verifyErr) {
      console.error("SMTP connection verification failed:", verifyErr.message);
      // Clean up the token since we can't send the email
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(500).json({ error: "Email service is temporarily unavailable. Please try again later." });
    }

    await transporter.sendMail({
      from: `"Bloom Skin" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Bloom Skin Password",
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #fff5f7; border-radius: 16px;">
          <h2 style="color: #ec4899; margin-bottom: 8px;">Bloom Skin</h2>
          <p style="color: #374151; font-size: 15px;">Hi <strong>${user.name || "there"}</strong>,</p>
          <p style="color: #374151; font-size: 15px;">
            We received a request to reset your password. Click the button below to create a new one:
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; background: linear-gradient(to right, #ec4899, #a855f7); color: #fff; 
                      padding: 12px 32px; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 15px;">
              Reset Password
            </a>
          </div>
          <p style="color: #6b7280; font-size: 13px;">
            This link expires in <strong>1 hour</strong>. If you didn't request this, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #fce7f3; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">Bloom Skin &mdash; Your skin's best companion</p>
        </div>
      `,
    });

    res.json({
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err.message || err);
    console.error("Full error details:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(500).json({ error: "Failed to process password reset request. Please try again." });
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "New password is required." });
    }

    if (password.length < 6 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      return res.status(400).json({
        error: "Password must be at least 6 characters with at least one letter and one number.",
      });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: "Password reset link is invalid or has expired. Please request a new one.",
      });
    }

    // Update password
    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Auto-login after password reset
    req.login(user, (err) => {
      if (err) {
        return res.json({ message: "Password reset successfully. Please log in with your new password." });
      }
      res.json({
        message: "Password reset successfully. You are now logged in.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password. Please try again." });
  }
};
