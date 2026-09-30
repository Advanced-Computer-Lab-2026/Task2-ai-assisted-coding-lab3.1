import { Review } from "../models/Review.js";

// GET /api/reviews
const mongoose = require("mongoose");
const Review = require("../models/Review");

// TODO: implement per README.md section 2.
const createReview = async (req, res, next) => {
  try {
    const { mealCode, rating, comment, reviewedBy } = req.body;

    const review = await Review.create({
      mealCode,
      rating,
      comment,
      reviewedBy,
    });

    return res.status(201).json({ review });
  } catch (err) {
    if (err.name === "ValidationError" || err.code === 11000) {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};
const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.status(200).json({ reviews });
  } catch (err) {
    next(err);
  }
};

const getReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Review not found" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.status(200).json({ review });
  } catch (err) {
    next(err);
  }
};
const getReviewSummary = async (req, res, next) => {
  try {
    const { mealCode } = req.query;

    if (!mealCode) {
      return res.status(400).json({ message: "mealCode is required" });
    }

    const result = await Review.aggregate([
      { $match: { mealCode: mealCode } },
      {
        $group: {
          _id: "$mealCode",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        mealCode,
        averageRating: 0,
        reviewCount: 0,
      });
    }

    return res.status(200).json({
      mealCode,
      averageRating: result[0].averageRating,
      reviewCount: result[0].reviewCount,
    });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  createReview,
  getAllReviews,
  getReview,
  getReviewSummary,
};
export async function getAllReviews(req, res, next) {
  try {
    // TODO
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/:id
// TODO: implement per README.md section 2.
export async function getReview(req, res, next) {
  try {
    // TODO
  } catch (err) {
    next(err);
  }
}

// POST /api/reviews
// TODO: implement per README.md section 2.
export async function createReview(req, res, next) {
  try {
    // TODO
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/summary?mealCode=ML101
// TODO: implement per README.md section 3.
export async function getReviewSummary(req, res, next) {
  try {
    // TODO
  } catch (err) {
    next(err);
  }
}
