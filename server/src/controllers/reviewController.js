import { Review } from '../models/Review.js';

// GET /api/reviews
// TODO: implement per README.md section 2.
export async function getAllReviews(req, res, next) {
  try {
    // TODO
    const reviews = await Review.find();

    res.status(200).json({ reviews });

  } catch (err) { next(err); }
}

// GET /api/reviews/:id
// TODO: implement per README.md section 2.
export async function getReview(req, res, next) {
  try {
    // TODO
    const review = await Review.findById(req.params.id);
    if (!review) {

      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ review });
  } catch (err) { next(err); }
}

// POST /api/reviews
// TODO: implement per README.md section 2.
export async function createReview(req, res, next) {
  try {
    // TODO
    const { mealCode, rating, comment, reviewedBy } = req.body;
    const newReview = new Review({ mealCode, rating, comment, reviewedBy });
    await newReview.save();
    res.status(201).json({ review: newReview });
  } catch (err) { next(err); }
}

// GET /api/reviews/summary?mealCode=ML101
// TODO: implement per README.md section 3.
export async function getReviewSummary(req, res, next) {
  try {
    // TODO
    const { mealCode } = req.query;

    if (!mealCode) {
      return res.status(400).json({ message: 'mealCode is required' });
    }

    const summary = await Review.aggregate([
      { $match: { mealCode } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (summary.length === 0) {
      return res.status(200).json({ mealCode, averageRating: 0, reviewCount: 0 });
    }
    res.status(200).json({
      mealCode,
      averageRating: summary[0].averageRating,
      reviewCount: summary[0].totalReviews
    });
  } catch (err) { next(err); }
}
