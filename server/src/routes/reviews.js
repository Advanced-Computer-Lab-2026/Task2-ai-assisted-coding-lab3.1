import { Router } from "express";
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary,
} from "../controllers/reviewController.js";
const express = require("express");
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getReview,
  getReviewSummary,
} = require("../controllers/reviewController");

// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.
router.post("/", createReview);
router.get("/", getAllReviews);

// Note: /summary must come before /:id
router.get("/summary", getReviewSummary);
router.get("/:id", getReview);
module.exports = router;
export default router;
