import mongoose from 'mongoose';
import { Review } from '../models/Review.js';

// GET /api/reviews
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    res.json({ reviews });
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
export async function getReview(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }
    const review = await Review.findById(req.params.id).lean();
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ review });
  } catch (err) { next(err); }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const { mealCode, rating, comment, reviewedBy } = req.body;
    const review = await Review.create({ mealCode, rating, comment, reviewedBy });
    res.status(201).json({ review });
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This user has already reviewed this meal' });
    }
    next(err);
  }
}

// GET /api/reviews/summary?mealCode=ML101
export async function getReviewSummary(req, res, next) {
  try {
    const { mealCode } = req.query;
    if (!mealCode) return res.status(400).json({ message: 'mealCode is required' });

    const [summary] = await Review.aggregate([
      { $match: { mealCode: String(mealCode) } },
      { $group: { _id: '$mealCode', averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
    ]);

    res.json({
      mealCode,
      averageRating: summary ? summary.averageRating : 0,
      reviewCount: summary ? summary.reviewCount : 0
    });
  } catch (err) { next(err); }
}
