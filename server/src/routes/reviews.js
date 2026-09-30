import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

// Express evaluates routes sequentially
router.get('/', getAllReviews);
router.post('/', createReview);
router.get('/summary', getReviewSummary); // Must precede /:id
router.get('/:id', getReview);

export default router;