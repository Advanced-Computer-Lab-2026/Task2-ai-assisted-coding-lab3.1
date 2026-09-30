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
router.get('/summary', getReviewSummary); // must come before /:id
router.get('/:id', getReview);

export default router;