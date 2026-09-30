const mongoose = require("mongoose");

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
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

reviewSchema.index({ mealCode: 1, reviewedBy: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
