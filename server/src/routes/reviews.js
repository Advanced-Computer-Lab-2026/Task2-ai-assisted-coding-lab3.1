import express from 'express';
import * as reviewController from '../controllers/reviewController.js';

const router = express.Router();

// /summary must be before /:id
router.get('/summary', reviewController.getReviewSummary);
router.get('/', reviewController.getAllReviews);
router.post('/', reviewController.createReview);
router.get('/:id', reviewController.getReview);

export default router;
