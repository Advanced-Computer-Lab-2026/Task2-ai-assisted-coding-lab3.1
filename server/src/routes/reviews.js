import { Router } from 'express';

import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

// Summary must come before /:id
router.get('/summary', getReviewSummary);

// Get all reviews
router.get('/', getAllReviews);

// Get one review
router.get('/:id', getReview);

// Create a review
router.post('/', createReview);

export default router;