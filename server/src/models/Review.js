import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    mealCode: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// one review per user per meal; anonymous reviews are excluded from the index
reviewSchema.index(
  { mealCode: 1, reviewedBy: 1 },
  { unique: true, partialFilterExpression: { reviewedBy: { $type: 'objectId' } } }
);

export const Review = mongoose.model('Review', reviewSchema);
export default Review;