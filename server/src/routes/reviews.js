const express = require("express");
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getReview,
  getReviewSummary,
} = require("../controllers/reviewController");

router.post("/", createReview);
router.get("/", getAllReviews);
router.get("/summary", getReviewSummary);
router.get("/:id", getReview);

module.exports = router;
