const express = require("express");

const {
  getJob,
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  addReview,
  addComment,
  JobDetails,
} = require("../controllers/jobController");
const { likeJob } = require("../controllers/likeController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// Job routes
router.post("/", protect, adminOnly, createJob);
router.get("/", protect, getJobs);
// router.get("/:id", protect, getJob);
router.put("/:id", protect, adminOnly, updateJob);
router.delete("/:id", protect, adminOnly, deleteJob);
router.post("/:jobId/like", protect, likeJob);
router.post("/:jobId/comment", protect, addComment);
router.post("/:jobId/review", protect, addReview);
router.get("/:id", protect, JobDetails);

module.exports = router;
