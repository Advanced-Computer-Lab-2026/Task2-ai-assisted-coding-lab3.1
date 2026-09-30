import mongoose from 'mongoose';
import { Review } from '../models/Review.js';

// GET /api/reviews
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find();
    res.status(200).json({ reviews });
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
export async function getReview(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ review });
  } catch (err) { next(err); }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const { mealCode, rating, comment, reviewedBy } = req.body;

    if (!mealCode || rating === undefined) {
      return res.status(400).json({ message: 'mealCode and rating are required' });
    }

    const review = await Review.create({ mealCode, rating, comment, reviewedBy });
    res.status(201).json({ review });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
}

// GET /api/reviews/summary?mealCode=ML101
// GET /api/reviews/summary?mealCode=ML101
export async function getReviewSummary(req, res, next) {
  try {
    const { mealCode } = req.query;

    if (!mealCode || typeof mealCode !== 'string') {
      return res.status(400).json({ message: 'mealCode is required' });
    }

    const result = await Review.aggregate([
      { $match: { mealCode } },
      {
        $group: {
          _id: '$mealCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({ mealCode, averageRating: 0, reviewCount: 0 });
    }

    res.status(200).json({
      mealCode,
      averageRating: result[0].averageRating,
      reviewCount: result[0].reviewCount,
    });
  } catch (err) { next(err); }
}