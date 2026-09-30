import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary,
} from '../controllers/reviewController.js';

const router = Router();
router.get('/summary', getReviewSummary);
router.post('/', createReview);
router.get('/', getAllReviews);
router.get('/:id', getReview);

export default router;
