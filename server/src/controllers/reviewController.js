import { Review } from '../models/Review.js';

// GET /api/reviews
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find().lean();
    res.status(200).json({ reviews });
  } catch (err) { 
    next(err); 
  }
}

// GET /api/reviews/:id
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id).lean();
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.status(200).json({ review });
  } catch (err) { 
    next(err); 
  }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const { mealCode, rating, comment, reviewedBy } = req.body;
    
    const review = await Review.create({
      mealCode,
      rating,
      comment,
      reviewedBy
    });
    
    res.status(201).json({ review });
  } catch (err) { 
    next(err); 
  }
}

// GET /api/reviews/summary?mealCode=ML101
export async function getReviewSummary(req, res, next) {
  try {
    const { mealCode } = req.query;
    
    if (!mealCode) {
      return res.status(400).json({ message: 'mealCode is required' });
    }

    const stats = await Review.aggregate([
      { $match: { mealCode } },
      { 
        $group: { 
          _id: null, 
          averageRating: { $avg: '$rating' }, 
          reviewCount: { $sum: 1 } 
        } 
      }
    ]);

    if (stats.length === 0) {
      return res.status(200).json({ 
        mealCode, 
        averageRating: 0, 
        reviewCount: 0 
      });
    }

    res.status(200).json({
      mealCode,
      averageRating: stats[0].averageRating,
      reviewCount: stats[0].reviewCount
    });
  } catch (err) { 
    next(err); 
  }
}