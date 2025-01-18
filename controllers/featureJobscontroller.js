// const express = require("express");
// const router = express.Router();
const FeaturedJob = require("../models/FeaturedJobModels");

// @desc Create a featured job
// router.post("/",
// });

exports.createFeaturedJob = async (req, res) => {
  try {
    const job = new FeaturedJob(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create job", error: err.message });
  }
};
// @desc Get all featured jobs
// router.get("/",
// });

exports.getFeaturedjobs = async (req, res) => {
  try {
    const featureJobs = await FeaturedJob.countDocuments();
    const jobs = await FeaturedJob.find();
    res.status(200).json({ featureJobs, jobs });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch jobs", error: err.message });
  }
};
// @desc Get a single featured job by ID
// router.get("/:id",
// });

exports.getFeaturedjob = async (req, res) => {
  try {
    const job = await FeaturedJob.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch job", error: err.message });
  }
};
// @desc Update a featured job by ID

exports.updateFeatureJob = async (req, res) => {
  try {
    const job = await FeaturedJob.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update job", error: err.message });
  }
};
// router.put("/:id", );

// @desc Delete a featured job by ID

exports.deleteFeaturedJob = async (req, res) => {
  try {
    const job = await FeaturedJob.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete job", error: err.message });
  }
};
// router.delete("/:id");
