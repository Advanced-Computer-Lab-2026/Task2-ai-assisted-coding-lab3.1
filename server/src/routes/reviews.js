const express = require('express');

const {
  createReview,
  getAllReviews,
  getReview,
  getReviewSummary
} = require('../controllers/reviewController');

const router = express.Router();

router.post('/', createReview);
router.get('/', getAllReviews);
router.get('/summary', getReviewSummary);
router.get('/:id', getReview);

module.exports = router;