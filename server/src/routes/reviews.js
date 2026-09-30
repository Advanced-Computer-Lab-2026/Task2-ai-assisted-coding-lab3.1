import express from 'express';
import {
  createReview,
  getAllReviews,
  getReviewSummary,
  getReview,
} from '../controllers/reviewController.js';

const router = express.Router();

// Summary route must come BEFORE /:id
router.get('/summary', getReviewSummary);

router.post('/', createReview);
router.get('/', getAllReviews);
router.get('/:id', getReview);

export default router;