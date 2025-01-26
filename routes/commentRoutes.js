const express = require("express");

const {
  addComment,
  deleteComment,
  getComments,
  postComment,
  getSingleComment,
} = require("../controllers/commentController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Comment routes
// router.post("/:jobId/comment", protect, addComment);
router.post("/", protect, postComment);
// router.post("/", addComment);
router.get("/all", protect, getComments);
router.get("/", protect, getSingleComment);
router.delete("/:id", protect, deleteComment);

module.exports = router;
