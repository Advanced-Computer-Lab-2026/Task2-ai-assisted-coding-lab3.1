import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary,
} from '../controllers/reviewController.js';

const router = Router();

// /summary MUST come before /:id, otherwise Express treats "summary" as an id
router.get('/summary', getReviewSummary);

router.get('/', getAllReviews);
router.post('/', createReview);
router.get('/:id', getReview);

export default router;