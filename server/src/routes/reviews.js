import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

// Summary MUST come before /:id
router.get('/summary', getReviewSummary);

router.get('/', getAllReviews);
router.get('/:id', getReview);
router.post('/', createReview);

export default router;