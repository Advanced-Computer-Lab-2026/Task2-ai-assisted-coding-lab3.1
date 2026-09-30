import mongoose from 'mongoose';
const express = require('express');
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getReview,
  getReviewSummary,
} = require('../controllers/reviewController');

router.post('/', createReview);
router.get('/', getAllReviews);
router.get('/summary', getReviewSummary);
router.get('/:id', getReview);

module.exports = router;
// TODO: define the Review schema per README.md section 1.

const reviewSchema = new mongoose.Schema(
  {
   mealCode: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// TODO: add the compound uniqueness constraint described in README.md section 1.
reviewSchema.index({ mealCode: 1, reviewedBy: 1 }, { unique: true });
export const Review = mongoose.model('Review', reviewSchema);
