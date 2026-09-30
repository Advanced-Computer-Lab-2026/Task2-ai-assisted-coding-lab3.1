import Joi from 'joi';
import { Review } from '../models/Review.js';

const createSchema = Joi.object({
  mealCode: Joi.string().trim().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow(''),
  reviewedBy: Joi.string().hex().length(24)
});

// GET /api/reviews
// TODO: implement per README.md section 2.
export async function getAllReviews(req, res, next) {
  try {
    // TODO
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    res.json({ reviews });
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
// TODO: implement per README.md section 2.
export async function getReview(req, res, next) {
  try {
    // TODO
    const review = await Review.findById(req.params.id).lean();
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ review });
  } catch (err) { next(err); }
}

// POST /api/reviews
// TODO: implement per README.md section 2.
export async function createReview(req, res, next) {
  try {
    // TODO
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const review = await Review.create(value);
    res.status(201).json({ review });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Review already exists' });
    next(err);
  }
}

// GET /api/reviews/summary?mealCode=ML101
// TODO: implement per README.md section 3.
export async function getReviewSummary(req, res, next) {
  try {
    // TODO
    const { mealCode } = req.query;
    if (!mealCode) return res.status(400).json({ message: 'mealCode is required' });

    const [stats] = await Review.aggregate([
      { $match: { mealCode } },
      { $group: { _id: null, averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
    ]);
    res.json({
      mealCode,
      averageRating: stats ? stats.averageRating : 0,
      reviewCount: stats ? stats.reviewCount : 0
    });
  } catch (err) { next(err); }
}
