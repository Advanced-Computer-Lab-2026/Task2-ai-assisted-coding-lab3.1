import { Review } from '../models/Review.js';
import Joi from 'joi';

const reviewSchema = Joi.object({
  mealCode: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().max(200),
  reviewedBy: Joi.string().hex().length(24)
});

// GET /api/reviews
// TODO: implement per README.md section 2.
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    res.json({ reviews });
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
// TODO: implement per README.md section 2.
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id).lean();
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ review });
  } catch (err) { next(err); }
}

// POST /api/reviews
// TODO: implement per README.md section 2.
export async function createReview(req, res, next) {
  try {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const review = new Review(req.body);
    await review.save();
    res.status(201).json({ review });
  } catch (err) { next(err); }
}

// GET /api/reviews/summary?mealCode=ML101
// TODO: implement per README.md section 3.
// GET /api/reviews/summary?mealCode=ML101
// Implemented per README_2.md section 3.
export async function getReviewSummary(req, res, next) {
  try {
    const { mealCode } = req.query;

    // 1. Missing query parameter check
    if (!mealCode) {
      return res.status(400).json({ message: 'mealCode is required' }); // Returns 400 with exact error message
    }

    // 2. Compute using aggregate() with $match and $group
    const result = await Review.aggregate([
      { $match: { mealCode: mealCode } },
      { 
        $group: { 
          _id: '$mealCode', 
          averageRating: { $avg: '$rating' }, // Computes average in DB[cite: 2]
          reviewCount: { $sum: 1 } // Computes count in DB[cite: 2]
        } 
      }
    ]);

    // 3. Fallback for no matches
    if (result.length === 0) {
      return res.status(200).json({
        mealCode: mealCode,
        averageRating: 0,
        reviewCount: 0
      }); // Returns requested mealCode with 0 values if nothing matches[cite: 2]
    }

    // 4. Successful flat response format
    res.status(200).json({
      mealCode: result[0]._id,
      averageRating: result[0].averageRating,
      reviewCount: result[0].reviewCount
    }); // Returns exact requested flat object structure[cite: 2]

  } catch (err) { 
    next(err); 
  }
}
