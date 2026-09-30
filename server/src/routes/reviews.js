import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

// GET /api/reviews
router.get('/', getAllReviews);

// GET /api/reviews/summary
router.get('/summary', getReviewSummary);

// GET /api/reviews/:id
router.get('/:id', getReview);

// POST /api/reviews
router.post('/', createReview);

export default router;