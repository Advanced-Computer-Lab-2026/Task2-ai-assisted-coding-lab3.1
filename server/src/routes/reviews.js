import express from 'express';
import {
  createReview,
  getAllReviews,
  getReview,
  getReviewSummary,
} from '../controllers/reviewController.js';

const router = express.Router();

// /summary MUST come before /:id
router.get('/summary', getReviewSummary);

router.post('/', createReview);
router.get('/', getAllReviews);
router.get('/:id', getReview);

export default router;