import { Review } from '../models/Review.js';

// GET /api/reviews
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find();
    res.json({ reviews });
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ review });
  } catch (err) { next(err); }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ review });
  } catch (err) { next(err); }
}

// GET /api/reviews/summary?mealCode=ML101
export async function getReviewSummary(req, res, next) {
  try {
    const { mealCode } = req.query;
    if (!mealCode) return res.status(400).json({ message: 'Meal code is required' });

    const reviews = await Review.find({ mealCode });
    const summary = {
      totalReviews: reviews.length,
      averageRating: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0,
    };
    res.json({ summary });
  } catch (err) { next(err); }
}