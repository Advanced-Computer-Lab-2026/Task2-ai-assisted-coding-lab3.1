import { Router } from 'express';

import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

router.post('/', createReview);
router.get('/', getAllReviews);

// Must be before /:id
router.get('/summary', getReviewSummary);

router.get('/:id', getReview);

export default router;