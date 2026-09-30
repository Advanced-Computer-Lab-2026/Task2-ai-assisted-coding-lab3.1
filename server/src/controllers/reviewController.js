import Review from '../models/Review.js';

// CREATE
export const createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'You already reviewed this meal',
      });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

// READ ALL
export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().populate('reviewedBy', 'name email');
    res.json({ reviews });
  } catch (err) {
    next(err);
  }
};

// READ ONE
export const getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate(
      'reviewedBy',
      'name email'
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ review });
  } catch (err) {
    next(err);
  }
};

// SUMMARY
export const getReviewSummary = async (req, res, next) => {
  const { mealCode } = req.query;

  if (!mealCode) {
    return res.status(400).json({ message: 'mealCode is required' });
  }

  try {
    const result = await Review.aggregate([
      { $match: { mealCode } },
      {
        $group: {
          _id: '$mealCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.json({ mealCode, averageRating: 0, reviewCount: 0 });
    }

    res.json({
      mealCode: result[0]._id,
      averageRating: result[0].averageRating,
      reviewCount: result[0].reviewCount,
    });
  } catch (err) {
    next(err);
  }
};