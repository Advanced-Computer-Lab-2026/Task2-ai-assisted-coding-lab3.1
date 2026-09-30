import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

router.get('/summary', getReviewSummary); // MUST come before '/:id'
router.get('/', getAllReviews);
router.get('/:id', getReview);
router.post('/', createReview);

export default router;