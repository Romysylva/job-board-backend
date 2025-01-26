const express = require("express");

const {
  postReview,
  addReview,
  getReviews,
  deleteReview,
  getAllReviews,
} = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

// Review routes
router.post("/", protect, postReview);
// router.post("/", protect, addReview);
router.get("/", protect, getReviews);
router.get("/all", protect, getAllReviews);
router.delete("/:id", protect, deleteReview);

module.exports = router;
