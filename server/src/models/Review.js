import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    mealCode: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// One review per user per meal. reviewedBy is optional (there is no login), so
// the partial filter keeps anonymous reviews of the same meal from colliding
// on a shared null value.
reviewSchema.index(
  { mealCode: 1, reviewedBy: 1 },
  { unique: true, partialFilterExpression: { reviewedBy: { $exists: true } } }
);

export const Review = mongoose.model('Review', reviewSchema);
