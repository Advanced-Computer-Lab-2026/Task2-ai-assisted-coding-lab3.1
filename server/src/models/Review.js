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

// One review per meal per user. The index only applies to reviews that have a
// reviewedBy, so anonymous reviews (no reviewedBy) of the same meal don't collide.
reviewSchema.index(
  { mealCode: 1, reviewedBy: 1 },
  { unique: true, partialFilterExpression: { reviewedBy: { $type: 'objectId' } } }
);

export const Review = mongoose.model('Review', reviewSchema);