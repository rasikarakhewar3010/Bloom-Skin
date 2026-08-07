const axios = require('axios');
const FormData = require('form-data');
const History = require('../models/history.model');

// Use environment variable for ML service URL with fallback
const PYTHON_API_URL = process.env.ML_SERVICE_URL
  ? `${process.env.ML_SERVICE_URL}/predict`
  : 'http://127.0.0.1:5000/predict';

/**
 * Compute severity level from confidence score.
 * Higher confidence in a skin condition = higher severity.
 */
const computeSeverity = (confidence, prediction) => {
  if (prediction === 'Clear Skin' || prediction === 'Invalid Image') {
    return '';
  }
  if (confidence >= 0.95) return 'severe';
  if (confidence >= 0.90) return 'high';
  if (confidence >= 0.80) return 'moderate';
  return 'low';
};

/**
 * Generate tags based on the prediction class.
 */
const generateTags = (prediction) => {
  const tagMap = {
    'Blackheads': ['comedonal', 'non-inflammatory', 'mild'],
    'Whiteheads': ['comedonal', 'non-inflammatory', 'mild'],
    'Papules': ['inflammatory', 'moderate'],
    'Pustules': ['inflammatory', 'bacterial', 'moderate'],
    'Cyst': ['inflammatory', 'severe', 'deep-tissue'],
    'Clear Skin': ['healthy'],
    'Invalid Image': ['invalid'],
  };
  return tagMap[prediction] || [];
};

// @desc    Handle image prediction: Upload → Cloudinary → Flask ML → Save to History
// @route   POST /api/predict
exports.handlePrediction = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required.' });
  }

  try {
    let finalImageUrl = req.file.path;
    let imageBuffer;
    const fs = require('fs');

    if (finalImageUrl.startsWith('http')) {
      // It's a Cloudinary URL

      const imageResponse = await axios.get(finalImageUrl, {
        responseType: 'arraybuffer',
      });
      imageBuffer = imageResponse.data;
    } else {
      // It's a local file path

      imageBuffer = fs.readFileSync(finalImageUrl);
      // Convert local path to a URL that the frontend can access
      // In production behind a proxy (like Render), req.get('host') handles the correct domain
      const baseUrl = req.protocol + '://' + req.get('host');
      finalImageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    // Step 2: Create form and send to Python ML service
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: req.file.originalname || 'image.jpg',
      contentType: req.file.mimetype || 'image/jpeg',
    });


    const predictionResponse = await axios.post(PYTHON_API_URL, formData, {
      headers: { ...formData.getHeaders() },
      timeout: 100000, // 100 second timeout to accommodate Render cold starts
    });

    const { class: prediction, confidence, info } = predictionResponse.data;

    // Step 3: Save to history with enhanced fields
    const newHistoryItem = new History({
      user: req.user.id,
      imageUrl: finalImageUrl,
      prediction: prediction,
      confidence: confidence,
      info: info,
      severity: computeSeverity(confidence, prediction),
      tags: generateTags(prediction),
    });

    await newHistoryItem.save();


    // Return prediction result along with enhanced data
    res.json({
      ...predictionResponse.data,
      severity: newHistoryItem.severity,
      tags: newHistoryItem.tags,
    });

  } catch (error) {

    if (error.response) {

      return res.status(error.response.status).json(error.response.data);
    }
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'AI analysis service is currently unavailable. Please try again later.' });
    }
    res.status(500).json({ error: 'Internal server error during prediction.' });
  }
};