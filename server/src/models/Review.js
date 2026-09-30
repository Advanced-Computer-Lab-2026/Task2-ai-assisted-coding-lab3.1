import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    mealCode: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    comment: {
      type: String
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// A user can review a specific meal only once
reviewSchema.index(
  { mealCode: 1, reviewedBy: 1 },
  { unique: true }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;