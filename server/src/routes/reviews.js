import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

// Static route '/summary' must be registered before dynamic route '/:id'
router.get('/summary', getReviewSummary);

router.get('/', getAllReviews);
router.post('/', createReview);
router.get('/:id', getReview);

export default router;