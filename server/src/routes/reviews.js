import express from 'express';

import {
  createReview,
  getAllReviews,
  getReview,
  getReviewSummary,
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', createReview);

router.get('/', getAllReviews);

// IMPORTANT: /summary must be before /:id
router.get('/summary', getReviewSummary);

router.get('/:id', getReview);

export default router;