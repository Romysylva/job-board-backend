const express = require("express");

const {
  addComment,
  deleteComment,
  getComments,
} = require("../controllers/commentController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Comment routes
router.post("/:jobId/comment", protect, addComment);
// router.post("/", protect, addComment);
router.get("/:jobId", getComments);
router.delete("/:id", protect, deleteComment);

module.exports = router;
