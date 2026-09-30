import mongoose from 'mongoose';

// TODO: define the Review schema per README.md section 1.

const reviewSchema = new mongoose.Schema(
  {
    mealCode:{ type:String , required:true},
    rating:{ type:Number ,min:1,max:5, required:true},
    comment:{ type:String, required: false },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
  },
  { timestamps: true }
);

reviewSchema.index({ mealCode: 1, reviewedBy: 1 }, { unique: true });
// TODO: add the compound uniqueness constraint described in README.md section 1.

export const Review = mongoose.model('Review', reviewSchema);
