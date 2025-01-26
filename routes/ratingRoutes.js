const express = require("express");

const { createRating, Ratings } = require("../controllers/ratingController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Rating routes
router.post("/", protect, createRating);

module.exports = router;
