import mongoose from 'mongoose';
import Review from '../models/Review.js';

export const createReview = async (req, res, next) => {
  try {
    const { mealCode, rating, comment, reviewedBy } = req.body;
    const review = await Review.create({ mealCode, rating, comment, reviewedBy });
    res.status(201).json({ review });
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: 'This user has already reviewed this meal' });
    }
    next(err);
  }
};

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    res.status(200).json({ reviews });
  } catch (err) {
    next(err);
  }
};

export const getReview = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ review });
  } catch (err) {
    next(err);
  }
};

export const getReviewSummary = async (req, res, next) => {
  try {
    const { mealCode } = req.query;
    if (typeof mealCode !== 'string' || !mealCode.trim()) {
      return res.status(400).json({ message: 'mealCode is required' });
    }

    const [result] = await Review.aggregate([
      { $match: { mealCode } },
      {
        $group: {
          _id: '$mealCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      mealCode,
      averageRating: result ? result.averageRating : 0,
      reviewCount: result ? result.reviewCount : 0,
    });
  } catch (err) {
    next(err);
  }
};