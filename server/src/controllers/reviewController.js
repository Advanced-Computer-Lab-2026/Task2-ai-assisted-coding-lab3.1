import mongoose from 'mongoose';
import Review from '../models/Review.js';

export const createReview = async (req, res, next) => {
  try {
    const { mealCode, rating, comment, reviewedBy } = req.body;
    const review = await Review.create({ mealCode, rating, comment, reviewedBy });
    res.status(201).json({ review });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You already reviewed this meal' });
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
      return res.status(400).json({ message: 'Invalid id' });
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
    if (!mealCode || typeof mealCode !== 'string') {
      return res.status(400).json({ message: 'mealCode is required' });
    }

    const result = await Review.aggregate([
      { $match: { mealCode } },
      { $group: { _id: null, averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } },
    ]);

    if (result.length === 0) {
      return res.status(200).json({ mealCode, averageRating: 0, reviewCount: 0 });
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