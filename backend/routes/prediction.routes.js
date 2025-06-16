const express = require('express');
const router = express.Router();
const { handlePrediction } = require('../controllers/prediction.controller');
const authMiddleware = require('../middleware/auth.middleware'); // Your authentication middleware
const upload = require('../config/cloudinary.config'); // Your multer-storage-cloudinary config

/**
 * @route   POST /api/predict
 * @desc    Receives an image, authenticates the user, uploads the image to Cloudinary,
 *          gets a prediction from the AI service, saves the result, and returns the prediction.
 * @access  Private
 */
// The middleware chain runs in order:
// 1. authMiddleware: Checks for a valid user token and attaches req.user.
// 2. upload.single('image'): Intercepts the 'image' file, uploads it to Cloudinary, and attaches req.file.
// 3. handlePrediction: The main controller logic is executed.
router.post('/', authMiddleware, upload.single('image'), handlePrediction);

module.exports = router;