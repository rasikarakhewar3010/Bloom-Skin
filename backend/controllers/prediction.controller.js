const axios = require('axios');
const FormData = require('form-data');
const History = require('../models/history.model'); // Ensure this path is correct
const https = require('https'); // ✅ <- THIS LINE FIXES THE ERROR

// Your Python/Flask service URL
const PYTHON_API_URL = 'http://127.0.0.1:5000/predict'; 


exports.handlePrediction = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required.' });
  }

  try {
    const imageUrl = req.file.path;
    console.log(`Image uploaded to Cloudinary: ${imageUrl}`);

    // Step 1: Download the image from Cloudinary
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      httpsAgent: new https.Agent({ rejectUnauthorized: false }) // for self-signed certs (optional)
    });

    // Step 2: Create form and send to Python
    const formData = new FormData();
    formData.append('image', imageResponse.data, {
      filename: 'image.jpg',
      contentType: 'image/jpeg',
    });

    console.log('Forwarding image to Python ML service...');
    const predictionResponse = await axios.post(PYTHON_API_URL, formData, {
      headers: { ...formData.getHeaders() },
    });

    const { class: prediction, confidence, info } = predictionResponse.data;

    const newHistoryItem = new History({
      user: req.user.id,
      imageUrl: imageUrl,
      prediction: prediction,
      confidence: confidence,
      info: info,
    });

    await newHistoryItem.save();
    console.log('Prediction saved to user history.');

    res.json(predictionResponse.data);

  } catch (error) {
    console.error('An error occurred during the prediction process:', error.message);
    if (error.response) {
      console.error('Error from Python service:', error.response.data);
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).json({ error: 'Internal server error during prediction.' });
  }
};