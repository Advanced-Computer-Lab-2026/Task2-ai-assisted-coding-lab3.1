import { Review } from '../models/Review.js';
import Joi from 'joi';

const createReviewSchema = Joi.object({
  mealCode: Joi.string().trim().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow(''),
  reviewedBy: Joi.string().hex().length(24)
}).unknown(false);

// GET /api/reviews
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({ reviews });
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json({ review });
  } catch (err) { next(err); }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const { value, error } = createReviewSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const review = await Review.create(value);
    res.status(201).json({ review });
  } catch (err) { next(err); }
}

// GET /api/reviews/summary?mealCode=ML101
export async function getReviewSummary(req, res, next) {
  try {
    const { mealCode } = req.query;
    if (typeof mealCode !== 'string' || !mealCode.trim()) {
      return res.status(400).json({ message: 'mealCode is required' });
    }

    const normalizedMealCode = mealCode.trim();
    const [summary] = await Review.aggregate([
      { $match: { mealCode: normalizedMealCode } },
      {
        $group: {
          _id: '$mealCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      mealCode: normalizedMealCode,
      averageRating: summary?.averageRating ?? 0,
      reviewCount: summary?.reviewCount ?? 0
    });
  } catch (err) { next(err); }
}
