import mongoose from 'mongoose';
import { User } from './User.js';

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

// Compound unique index to prevent multiple reviews of the same meal by the same user
reviewSchema.index({ mealCode: 1, reviewedBy: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
