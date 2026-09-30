import Joi from 'joi';
import { Review } from '../models/Review.js';

//const objectId = Joi.string().hex().length(24);

const createSchema = Joi.object({
   mealCode: Joi.string().min(2).max(60).required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow('').optional(),
  reviewedBy: Joi.string().hex().length(24).optional()
});

function publicReview(u) {
 
  return { id: u._id.toString(), mealCode: u.mealCode, rating: u.rating, reviewedBy: u.reviewedBy };
  //return { id: u._id.toString(), title: u.title, description: u.description, category: u.category, status: u.status, location: u.location, reportedBy: u.reportedBy };
}



// GET /api/reviews
// TODO: implement per README.md section 2.
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .lean();
    res.json({ reviews: reviews.map(publicReview) });
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
// TODO: implement per README.md section 2.
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);
      if (!review) return res.status(404).json({ message: 'Review not found' });
      res.json({ review: publicReview(review) });
  } catch (err) { next(err); }
}

// POST /api/reviews
// TODO: implement per README.md section 2.
export async function createReview(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.message });

      const review = await Review.create(value);
      res.status(201).json({ review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You already reviewed this meal' });
    }{ next(err); }}
}

// GET /api/reviews/summary?mealCode=ML101
// TODO: implement per README.md section 3.
export async function getReviewSummary(req, res, next) {
  try {
    const { mealCode } = req.query;
    if (!mealCode || typeof mealCode !== 'string') {
      return res.status(400).json({ message: 'mealCode is required' });
    }

    const [result] = await Review.aggregate([
      { $match: { mealCode } },
      { $group: { _id: '$mealCode', averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } },
    ]);

    res.json({
      mealCode,
      averageRating: result ? result.averageRating : 0,
      reviewCount: result ? result.reviewCount : 0,
    });
  } catch (err) { next(err); }
}
