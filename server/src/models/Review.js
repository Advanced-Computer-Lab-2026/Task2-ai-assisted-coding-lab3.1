import mongoose from 'mongoose';

// TODO: define the Review schema per README.md section 1.

const reviewSchema = new mongoose.Schema(
  {
    /*
    mealCode	String	required (e.g. "ML101")
rating	Number	required, min: 1, max: 5
comment	String	optional
reviewedBy	ObjectId ref User	optional */

mealCode:{type:String, required:true},
rating:{type:Number, required:true, min:1, max:5},
comment:{type:String},
reviewedBy:{type: mongoose.Schema.Types.ObjectId, ref:'User'}



  },
  { timestamps: true }
);

// TODO: add the compound uniqueness constraint described in README.md section 1.

/*Keep { timestamps: true } and add a compound unique index on { mealCode: 1, reviewedBy: 1 }.

*/

reviewSchema.index({ mealCode: 1, reviewedBy: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
