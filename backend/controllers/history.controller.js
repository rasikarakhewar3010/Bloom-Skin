const History = require('../models/history.model');
const nodemailer = require('nodemailer');

// @desc    Get user's prediction history
// @route   GET /api/history
exports.getHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete all of a user's history
// @route   DELETE /api/history
exports.deleteHistory = async (req, res) => {
  try {
    await History.deleteMany({ user: req.user.id });
    res.json({ msg: 'History cleared successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Export history to user's email
// @route   POST /api/history/export
exports.exportHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user.id }).sort({ createdAt: -1 });

    if (history.length === 0) {
      return res.status(404).json({ msg: 'No history found to export.' });
    }

    // Format history into a nice HTML string for the email
    let htmlContent = `<h1>Your Bloom Skin Prediction History</h1>`;
    history.forEach(item => {
      htmlContent += `
        <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
          <p><strong>Date:</strong> ${new Date(item.createdAt).toLocaleString()}</p>
          <p><strong>Prediction:</strong> ${item.prediction} (${(item.confidence * 100).toFixed(2)}%)</p>
          <p><strong>Info:</strong> ${item.info}</p>
          <img src="${item.imageUrl}" alt="Prediction Image" style="max-width: 150px;"/>
        </div>
      `;
    });

    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Bloom Skin App" <${process.env.EMAIL_USER}>`,
      to: req.user.email, // Assuming user email is on req.user
      subject: 'Your Skin Analysis History Report',
      html: htmlContent,
    });

    res.json({ msg: 'History has been sent to your email.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};