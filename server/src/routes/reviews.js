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
router.get('/summary', getReviewSummary); // must come BEFORE '/:id'
router.get('/:id', getReview);

export default router;