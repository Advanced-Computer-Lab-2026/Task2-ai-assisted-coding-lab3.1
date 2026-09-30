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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Review not found' });
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
    if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Review already exists for this meal and user' });
    }
    next(err);
  }
}

// GET /api/reviews/summary?mealCode=ML101
export async function getReviewSummary(req, res, next) {
  try {
    const { mealCode } = req.query;
    if (typeof mealCode !== 'string' || mealCode.trim() === '') {
      return res.status(400).json({ message: 'mealCode is required' });
    }

    const [result] = await Review.aggregate([
      { $match: { mealCode } },
      { $group: { _id: '$mealCode', averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
    ]);

    if (!result) return res.json({ mealCode, averageRating: 0, reviewCount: 0 });
    res.json({ mealCode, averageRating: result.averageRating, reviewCount: result.reviewCount });
  } catch (err) { next(err); }
}
