import mongoose from 'mongoose';
import { User } from './User';

// TODO: define the Review schema per README.md section 1.

const reviewSchema = new mongoose.Schema(
  {
    mealcode: {type: String, required: true},
    rating: {type: Int16Array,required: true},
    comment:{type: String},
    reviewedBy:{type: User}
  },
  { timestamps: true }
);

// TODO: add the compound uniqueness constraint described in README.md section 1.
reviewSchema.index({ mealCode: 1, reviewedBy: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
