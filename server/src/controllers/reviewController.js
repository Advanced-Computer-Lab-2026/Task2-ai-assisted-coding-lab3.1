import { Review } from '../models/Review.js';

// GET /api/reviews
// TODO: implement per README.md section 2.
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find();
    res.status(200).json({ reviews }); //[cite: 1]
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
// TODO: implement per README.md section 2.
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' }); //[cite: 1]
    }
    res.status(200).json({ review }); //[cite: 1]
  } catch (err) { next(err); }
}

// POST /api/reviews
// TODO: implement per README.md section 2.
export async function createReview(req, res, next) {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json({ review }); //[cite: 1]
  } catch (err) { next(err); }
}

// GET /api/reviews/summary?mealCode=ML101
// TODO: implement per README.md section 3.
export async function getReviewSummary(req, res, next) {
  try {
    const { mealCode } = req.query;

    if (!mealCode) {
      return res.status(400).json({ message: 'mealCode is required' }); //[cite: 1]
    }

    const summary = await Review.aggregate([
      { $match: { mealCode } }, //[cite: 1]
      { 
        $group: { 
          _id: '$mealCode', 
          averageRating: { $avg: '$rating' }, //[cite: 1]
          reviewCount: { $sum: 1 } //[cite: 1]
        } 
      }
    ]);

    if (summary.length === 0) {
      return res.status(200).json({
        mealCode,
        averageRating: 0, //[cite: 1]
        reviewCount: 0 //[cite: 1]
      });
    }

    res.status(200).json({
      mealCode: summary[0]._id,
      averageRating: summary[0].averageRating,
      reviewCount: summary[0].reviewCount
    });
  } catch (err) { next(err); }
}