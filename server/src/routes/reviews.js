import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

router.get('/', getAllReviews);
// Must be registered before '/:id', otherwise "summary" is matched as an id.
router.get('/summary', getReviewSummary);
router.get('/:id', getReview);
router.post('/', createReview);

export default router;
