import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

// /summary must be registered before /:id, otherwise "summary" is treated as an id.
router.get('/summary', getReviewSummary);
router.get('/', getAllReviews);
router.get('/:id', getReview);
router.post('/', createReview);

export default router;
