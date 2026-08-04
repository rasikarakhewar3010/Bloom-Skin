const History = require('../models/history.model');
const { google } = require('googleapis');

/**
 * Send an email using the Gmail API (OAuth2).
 * This is the same approach used by passwordController.js and works on Render free tier.
 */
const sendEmailViaGmailAPI = async (toEmail, subject, htmlContent) => {
  if (!process.env.GOOGLE_REFRESH_TOKEN || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Email service is not configured. Missing Google OAuth credentials.');
  }

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;

  const messageParts = [
    `From: Bloom Skin <${process.env.EMAIL_USER}>`,
    `To: ${toEmail}`,
    `Subject: ${utf8Subject}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    "",
    htmlContent,
  ];

  const message = messageParts.join('\n');
  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });
};

// @desc    Get user's prediction history
// @route   GET /api/history
exports.getHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user.id, deletedAt: null }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {

    res.status(500).json({ error: 'Failed to load history.' });
  }
};

// @desc    Soft-delete all of a user's history
// @route   DELETE /api/history
exports.deleteHistory = async (req, res) => {
  try {
    await History.updateMany(
      { user: req.user.id, deletedAt: null },
      { $set: { deletedAt: new Date() } }
    );
    res.json({ message: 'History cleared successfully.' });
  } catch (err) {

    res.status(500).json({ error: 'Failed to clear history.' });
  }
};

// @desc    Export history to user's email
// @route   POST /api/history/export
exports.exportHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user.id, deletedAt: null }).sort({ createdAt: -1 });

    if (history.length === 0) {
      return res.status(404).json({ error: 'No history found to export.' });
    }

    // Format history into a nice HTML string for the email
    let htmlContent = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fff5f7; border-radius: 16px;">
        <h2 style="color: #ec4899; margin-bottom: 16px;">Your Bloom Skin Prediction History</h2>
    `;
    history.forEach(item => {
      htmlContent += `
        <div style="border: 1px solid #fce7f3; padding: 16px; margin-bottom: 12px; border-radius: 12px; background: white;">
          <p style="margin: 4px 0;"><strong>Date:</strong> ${new Date(item.createdAt).toLocaleString()}</p>
          <p style="margin: 4px 0;"><strong>Prediction:</strong> ${item.prediction} (${(item.confidence * 100).toFixed(2)}%)</p>
          ${item.severity ? `<p style="margin: 4px 0;"><strong>Severity:</strong> ${item.severity}</p>` : ''}
          <p style="margin: 4px 0;"><strong>Info:</strong> ${item.info}</p>
          <img src="${item.imageUrl}" alt="Prediction Image" style="max-width: 150px; border-radius: 8px; margin-top: 8px;"/>
        </div>
      `;
    });
    htmlContent += `
        <hr style="border: none; border-top: 1px solid #fce7f3; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">Bloom Skin &mdash; Your skin's best companion</p>
      </div>
    `;

    await sendEmailViaGmailAPI(
      req.user.email,
      'Your Skin Analysis History Report',
      htmlContent
    );

    res.json({ message: 'History has been sent to your email.' });

  } catch (err) {
    console.error("Export history error:", err.message || err);
    res.status(500).json({ error: 'Failed to export history. Please try again.' });
  }
};