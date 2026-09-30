import mongoose from 'mongoose';
import { Review } from '../models/Review.js';

// GET /api/reviews
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find().populate('reviewedBy', 'name email');
    res.status(200).json({ reviews });
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
export async function getReview(req, res, next) {
  try {
    const { id } = req.params;

    // Malformed ObjectId → 400 rather than a 500 CastError
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid review id.' });
    }

    const review = await Review.findById(id).populate('reviewedBy', 'name email');

    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    res.status(200).json({ review });
  } catch (err) { next(err); }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const { mealCode, rating, comment, reviewedBy } = req.body;

    const review = await Review.create({ mealCode, rating, comment, reviewedBy });

    res.status(201).json({ review });
  } catch (err) {
    // Duplicate: same user already reviewed this meal
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: 'You have already reviewed this meal.' });
    }
    // Schema validation failure (missing mealCode/rating, rating out of range, etc.)
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
}

// GET /api/reviews/summary?mealCode=ML101
export async function getReviewSummary(req, res, next) {
  try {
    const { mealCode } = req.query;

    if (!mealCode) {
      return res.status(400).json({ message: 'mealCode query param is required.' });
    }

    const result = await Review.aggregate([
      { $match: { mealCode } },
      {
        $group: {
          _id: '$mealCode',
          averageRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = result[0]
      ? {
          mealCode: result[0]._id,
          averageRating: Number(result[0].averageRating.toFixed(2)),
          count: result[0].count,
        }
      : { mealCode, averageRating: 0, count: 0 };

    res.status(200).json({ summary });
  } catch (err) { next(err); }
}