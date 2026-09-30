import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

router.get('/summary', getReviewSummary); // must come before '/:id'
router.get('/', getAllReviews);
router.post('/', createReview);
router.get('/:id', getReview);

export default router;