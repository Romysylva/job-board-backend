const express = require("express");
const Job = require("../models/JobModels");

const {
  getJob,
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  addReview,
  addComment,
  JobDetails,
  likeJob,
  CompanyCreateJob,
  getApplicants,
} = require("../controllers/jobController");

const { Ratings } = require("../controllers/ratingController");
// const { likeJob } = require("../controllers/likeController");

const {
  protect,
  adminOnly,
  authenticateCompany,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Job routes
// router.post("/", protect, adminOnly, createJob);
router.post(
  "/",
  authorizeRoles("admin", "manager"),
  authenticateCompany,
  CompanyCreateJob
);
router.get("/", protect, getJobs);
// router.get("/:id", protect, getJob);
router.put("/:id", protect, authorizeRoles("admin", "manager"), updateJob);
router.delete("/:id", protect, authorizeRoles("admin", "manager"), deleteJob);
// router.post("/:jobId/like", protect, likeJob);
router.post("/:jobId/comment", protect, addComment);
router.post("/:jobId/review", protect, addReview);
router.post("/:id/rate", protect, Ratings);
router.post("/:jobId/likes", likeJob);
router.get("/:id", protect, JobDetails);
router.get("/:jobId/applicants", getApplicants);
// router.get("/:companyId", getCompanyDetails);

router.post("/api/jobs/:jobId/dislike", async (req, res) => {
  const { userId } = req.body; // Get user ID from request body
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  job.likes = job.likes.filter((id) => id !== userId);
  await job.save();

  res.json({ likes: job.likes.length });
});

router.post("/api/jobs/:jobId/like", async (req, res) => {
  const { userId } = req.body; // Get user ID from request body
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job.likes.includes(userId)) {
    job.likes.push(userId);
    await job.save();
  }

  res.json({ likes: job.likes.length });
});

module.exports = router;
