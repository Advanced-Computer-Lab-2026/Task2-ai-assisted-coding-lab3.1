import Joi from 'joi';
import { Review } from '../models/Review.js';

const createSchema = Joi.object({
  mealCode: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().optional(),
  reviewedBy: Joi.string().optional(),
});

function publicReview(r) {
  return {
    id: r._id.toString(),
    mealCode: r.mealCode,
    rating: r.rating,
    comment: r.comment,
    reviewedBy: r.reviewedBy,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

// GET /api/reviews
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find().lean();
    res.json({ reviews: reviews.map(publicReview) });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/:id
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id).lean();
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ review: publicReview(review) });
  } catch (err) {
    next(err);
  }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const review = await Review.create(value);
    res.status(201).json({ review: publicReview(review) });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/summary?mealCode=ML101
export async function getReviewSummary(req, res, next) {
  try {
    const { mealCode } = req.query;
    if (!mealCode) return res.status(400).json({ message: 'mealCode is required' });

    const summary = await Review.aggregate([
      { $match: { mealCode } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    if (summary.length === 0) {
      return res.json({
        mealCode,
        averageRating: 0,
        reviewCount: 0,
      });
    }

    res.json({
      mealCode,
      averageRating: summary[0].averageRating,
      reviewCount: summary[0].reviewCount,
    });
  } catch (err) {
    next(err);
  }
}
