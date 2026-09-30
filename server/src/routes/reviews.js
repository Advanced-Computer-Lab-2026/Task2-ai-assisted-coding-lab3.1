import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.

// The summary route MUST come before /:id to prevent Express from treating "summary" as an id parameter.
router.get('/summary', getReviewSummary);

router.post('/', createReview);
router.get('/', getAllReviews);
router.get('/:id', getReview);

export default router;