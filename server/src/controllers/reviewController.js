import Joi from 'joi';
import mongoose from 'mongoose';
import { Review } from '../models/Review.js';

const objectId = Joi.string().hex().length(24);

const createSchema = Joi.object({
  mealCode: Joi.string().trim().min(1).required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow(''),
  reviewedBy: objectId
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ review });
  } catch (err) { next(err); }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    // stripUnknown: only the four schema fields reach the database, so clients
    // can't set _id, createdAt, etc.
    const { value, error } = createSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const review = await Review.create(value);
    res.status(201).json({ review });
  } catch (err) {
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
    // The typeof check rejects ?mealCode[$ne]=x, which Express parses into an
    // object that aggregate() would otherwise hand to MongoDB as an operator.
    if (!mealCode || typeof mealCode !== 'string') {
      return res.status(400).json({ message: 'mealCode is required' });
    }

    const [result] = await Review.aggregate([
      { $match: { mealCode } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    res.json({
      mealCode,
      averageRating: result ? result.averageRating : 0,
      reviewCount: result ? result.reviewCount : 0
    });
  } catch (err) { next(err); }
}
