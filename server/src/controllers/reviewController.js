import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { Review} from '../models/Review.js';

// GET /api/reviews
const CreateSchema = Joi.object({
  mealcode: Joi.string().required(),
  rating : Joi.number().min(1).max(5).required(),
  comment: Joi.string(),
  reviewedBy: Joi.string()
})

const updateSchema = Joi.object({
  rating : Joi.number().min(1).max(5),
  comment: Joi.string()
})

function publicReview(r) {
  return {
    _id: r._id,
    mealCode: r.mealCode,
    rating: r.rating,
    comment: r.comment,
    reviewedBy: r.reviewedBy,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

// TODO: implement per README.md section 2.
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find().sort({createdAt:-1}).lean();
    res.josn({reviews: reviews.map(publicReview)});
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
// TODO: implement per README.md section 2.
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);
    if(!review) return res.status(404).json({message: 'review not found'});
    res.json({review: publicReview(review)})
  } catch (err) { next(err); }
}

// POST /api/reviews
// TODO: implement per README.md section 2.
export async function createReview(req, res, next) {
  try {
    const {value, error} = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    
        const existing = await Review.findOne({mealCode, reviewedBy});
        if(existing) return res.status(409).json({message: 'review already exists'});

        const review = await Review.create({mealCode, rating, comment, reviewedBy});
        res.status(201).json({review: publicReview(review)});
  } catch (err) { next(err); }
}

// GET /api/reviews/summary?mealCode=ML101
// TODO: implement per README.md section 3.
export async function getReviewSummary(req, res, next) {
  try {
    const mealcode = req.query;
    if(!mealcode) return res.status(404).json({message: 'mealcode is required'})
      
      const [result] = await Review.aggregate([
      { $match: { mealCode } },
      { $group: { _id: '$mealCode', averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } },
    ]);

     res.json({mealCode,
      averageRating: result ? result.averageRating : 0,
      reviewCount: result ? result.reviewCount : 0,
    });
    } 
catch (err) { next(err); }
}
