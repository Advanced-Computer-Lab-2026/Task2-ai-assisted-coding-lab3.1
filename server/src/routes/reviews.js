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
// Must be declared before '/:id', otherwise "summary" is treated as an id.
router.get('/summary', getReviewSummary);
router.get('/:id', getReview);

export default router;