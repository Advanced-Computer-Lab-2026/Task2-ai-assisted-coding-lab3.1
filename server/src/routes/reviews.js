import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.
router.post('/', createReview); //[cite: 1]
router.get('/', getAllReviews); //[cite: 1]

// The summary route MUST be defined before the /:id route
router.get('/summary', getReviewSummary); //[cite: 1]

router.get('/:id', getReview); //[cite: 1]

export default router;