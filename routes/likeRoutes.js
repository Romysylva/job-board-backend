const express = require("express");
const { toggleLike } = require("../controllers/likeController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

module.exports = router;

const {
  addLike,
  getLikes,
  removeLike,
} = require("../controllers/likeController"); // Import the controller methods

// @route   POST /api/likes
// @desc    Add a like for a comment or review
// @access  Private
router.post("/", protect, addLike);

// @route   GET /api/likes/:targetType/:targetId
// @desc    Get all likes for a specific target (comment or review)
// @access  Public
router.get("/:targetType/:targetId", getLikes);

// @route   DELETE /api/likes/:likeId
// @desc    Remove a like for a specific target (comment or review)
// @access  Private (the user who added the like can remove it)
router.delete("/:likeId", protect, removeLike);

module.exports = router;
