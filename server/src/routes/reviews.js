import express from 'express';
import * as reviewCtrl from '../controllers/reviewController.js';

const router = express.Router();

router.get('/summary', reviewCtrl.getReviewSummary);
router.get('/', reviewCtrl.getAllReviews);
router.post('/', reviewCtrl.createReview);
router.get('/:id', reviewCtrl.getReview);

export default router;
