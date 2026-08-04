const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Index for faster per-user queries
  },
  imageUrl: {
    type: String,
    required: true,
  },
  prediction: {
    type: String,
    required: true,
    index: true, // Index for aggregation queries
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  info: {
    type: String,
    required: true,
  },

  // --- Enhanced fields for Recommendation Engine ---
  severity: {
    type: String,
    enum: ['low', 'moderate', 'high', 'severe', ''],
    default: '',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

// Compound index for efficient per-user history queries sorted by date
historySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('History', historySchema);