import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

  // TODO: wire up the three routes in README.md section 2 and the summary route in section 3.
  router.route('/').get(getAllReviews).post(createReview);
    router.route('/summary').get(getReviewSummary);
  router.route('/:id').get(getReview);


export default router;
