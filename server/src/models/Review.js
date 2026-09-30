import mongoose from 'mongoose';

// Review schema
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
      required: false,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },

  { timestamps: true }
);

// One review per user for each meal
reviewSchema.index(
  { mealCode: 1, reviewedBy: 1 },
  { unique: true }
);

export const Review = mongoose.model('Review', reviewSchema);