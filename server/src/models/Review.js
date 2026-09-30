const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    mealCode: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Compound unique index: one review per user per meal
reviewSchema.index({ mealCode: 1, reviewedBy: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);