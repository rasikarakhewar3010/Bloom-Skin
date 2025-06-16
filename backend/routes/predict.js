// backend/routes/predict.js

const express = require('express');
const axios = require('axios');
const router = express.Router();
const multer = require('multer');
const FormData = require('form-data'); // <-- Import FormData

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const ML_SERVICE_URL = 'http://localhost:5000/predict'; // Python service endpoint

// Use upload.single('image') as middleware. 'image' MUST match the key in your frontend.
router.post('/', upload.single('image'), async (req, res) => {
  // Check if a file was actually uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'No image file received.' });
  }

  try {
    console.log('Forwarding file to ML service...');
    
    // 1. Create a NEW FormData object
    const form = new FormData();
    
    // 2. Append the file buffer from multer.
    // The key 'image' MUST match what your Python server expects (request.files['image'])
    form.append('image', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // 3. Make the axios request, passing the form and ITS HEADERS
    //    This is the most critical part! form.getHeaders() provides the
    //    correct Content-Type with the boundary string.
    const response = await axios.post(
      ML_SERVICE_URL,
      form,
      { headers: form.getHeaders() } // <-- THE FIX IS HERE
    );

    console.log('Received response from ML service.');
    // Send the final result back to the frontend
    res.json(response.data);

  } catch (error) {
    // More descriptive error logging
    console.error('Error proxying to ML service:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: "An error occurred with the prediction service." });
  }
});




module.exports = router;