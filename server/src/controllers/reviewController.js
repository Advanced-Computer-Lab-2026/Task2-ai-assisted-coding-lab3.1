import { Review } from "../models/Review.js";

export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    res.json({ reviews });
  } catch (err) {
    next(err);
  }
}

export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ review });
  } catch (err) {
    next(err);
  }
}

export async function createReview(req, res, next) {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
}

export async function getReviewSummary(req, res, next) {
  try {
    const { mealCode } = req.query;

    if (!mealCode) {
      return res.status(400).json({ message: "mealCode is required" });
    }

    const [summary] = await Review.aggregate([
      { $match: { mealCode } },
      {
        $group: {
          _id: "$mealCode",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    if (!summary) {
      return res.json({ mealCode, averageRating: 0, reviewCount: 0 });
    }

    res.json({
      mealCode,
      averageRating: summary.averageRating,
      reviewCount: summary.reviewCount,
    });
  } catch (err) {
    next(err);
  }
}
