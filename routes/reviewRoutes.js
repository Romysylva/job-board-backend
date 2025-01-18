const express = require("express");

const {
  addReview,
  getReviews,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

// Review routes
router.post("/", protect, addReview);
router.get("/:companyId", getReviews);
router.delete("/:id", protect, deleteReview);

module.exports = router;
