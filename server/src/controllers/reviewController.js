import Joi from 'joi';
import  Review  from '../models/Review.js';

const createSchema = Joi.object({
  mealCode: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().optional(),
  reviewedBy: Joi.string().optional()
});

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const review = await Review.create(value);

    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find();

    res.status(200).json({ reviews });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/:id
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ review });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/summary?mealCode=ML101
export async function getReviewSummary(req, res, next) {
  try {
    const { mealCode } = req.query;

    if (!mealCode) {
      return res.status(400).json({
        message: 'mealCode is required'
      });
    }

    const result = await Review.aggregate([
      {
        $match: { mealCode }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        mealCode,
        averageRating: 0,
        reviewCount: 0
      });
    }

    res.status(200).json({
      mealCode,
      averageRating: result[0].averageRating,
      reviewCount: result[0].reviewCount
    });
  } catch (err) {
    next(err);
  }
}