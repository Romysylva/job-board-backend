const express = require("express");
const FeaturedJob = require("../models/FeaturedJobModels");

const {
  createFeaturedJob,
  getFeaturedjobs,
  getFeaturedjob,
  updateFeatureJob,
  deleteFeaturedJob,
} = require("../controllers/featureJobscontroller");

const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// @route   POST /api/featured-jobs
router.post("/", protect, adminOnly, createFeaturedJob);
router.get("/", getFeaturedjobs);
router.get("/:id", protect, getFeaturedjob);
router.put("/:id", protect, adminOnly, updateFeatureJob);
router.delete("/:id", protect, adminOnly, deleteFeaturedJob);

module.exports = router;
