import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();
router.post('/api/reviews', createReview);
router.get('/api/reviews', getAllReviews);
router.get('/api/reviews/summary', getReviewSummary);
router.get('/api/reviews/:id', getReview);

// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.

export default router;
