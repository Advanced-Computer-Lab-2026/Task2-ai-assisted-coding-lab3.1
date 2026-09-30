import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();


// POST /api/reviews
router.post('/', createReview);

// GET /api/reviews
router.get('/', getAllReviews);

// GET /api/reviews/summary?mealCode=ML101
router.get('/summary', getReviewSummary);

// GET /api/reviews/:id
router.get('/:id', getReview);
export default router;
