import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.
router.post('/', createReview);
router.get('/', getAllReviews);
router.get('/summary', getReviewSummary); // must come before '/:id'
router.get('/:id', getReview);

export default router;