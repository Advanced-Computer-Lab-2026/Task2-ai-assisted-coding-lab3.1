import Joi from 'joi';
import { Review } from '../models/Review.js';

const reviewSchema = Joi.object({
  mealCode: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow('').optional(),
  reviewedBy: Joi.string().optional()
});

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
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ review: review.toObject ? review.toObject() : review });
  } catch (err) { next(err); }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const { value, error } = reviewSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const review = await Review.create(value);
    res.status(201).json({ review: review.toObject ? review.toObject() : review });
  } catch (err) { next(err); }
}

// GET /api/reviews/summary?mealCode=ML101
export async function getReviewSummary(req, res, next) {
  try {
    const mealCode = req.query.mealCode;
    if (!mealCode) return res.status(400).json({ message: 'mealCode is required' });

    const [summary] = await Review.aggregate([
      { $match: { mealCode } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    if (!summary) {
      return res.json({ mealCode, averageRating: 0, reviewCount: 0 });
    }

    return res.json({
      mealCode,
      averageRating: Number(summary.averageRating),
      reviewCount: summary.reviewCount
    });
  } catch (err) { next(err); }
}
