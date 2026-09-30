import { Review } from '../models/Review.js';

export const createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);

    res.status(201).json({ review });
  } catch (err) {
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
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: 'Review not found',
      });
    }

    res.status(200).json({ review });
  } catch (err) {
    next(err);
  }
};

export const getReviewSummary = async (req, res, next) => {
  try {
    const { mealCode } = req.query;

    if (!mealCode) {
      return res.status(400).json({
        message: 'mealCode is required',
      });
    }

    const result = await Review.aggregate([
      {
        $match: { mealCode: mealCode },
      },
      {
        $group: {
          _id: '$mealCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        mealCode,
        averageRating: 0,
        reviewCount: 0,
      });
    }

    res.status(200).json({
      mealCode,
      averageRating: result[0].averageRating,
      reviewCount: result[0].reviewCount,
    });
  } catch (err) {
    next(err);
  }
};