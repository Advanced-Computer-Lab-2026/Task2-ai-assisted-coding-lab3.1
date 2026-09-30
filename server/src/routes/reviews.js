import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.
// POST /api/reviews
router.post('/', createReview);

// GET /api/reviews
router.get('/', getAllReviews);

// GET /api/reviews/summary?mealCode=ML101
router.get('/summary', getReviewSummary);

// GET /api/reviews/:id
router.get('/:id', getReview);
export default router;
