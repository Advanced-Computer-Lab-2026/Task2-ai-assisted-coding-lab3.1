import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

// /summary must come before /:id, otherwise Express matches "/summary"
// as the :id param and getReview runs instead.
router.get('/summary', getReviewSummary);

router.get('/', getAllReviews);
router.post('/', createReview);
router.get('/:id', getReview);

export default router;

