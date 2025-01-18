// const mongoose = require("mongoose");
const Job = require("../models/JobModels");
const Comment = require("../models/CommentModels");
const Review = require("../models/ReviewModels");

exports.createJob = async (req, res) => {
  const {
    title,
    company,
    description,
    location,
    jobType,
    requirements,
    postedBy,
    salary,
    experience,
    skills,
    contactEmail,
  } = req.body;

  try {
    const job = await Job.create({
      title,
      company,
      description,
      location,
      jobType,
      postedBy,
      requirements,
      salary,
      experience,
      skills,
      contactEmail,
    });

    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobCount = await Job.countDocuments();
    const jobs = await Job.find().populate("company");
    res.status(200).json({ success: true, totalJobs: jobCount, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("comments")
      .populate("reviews");
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });
    res
      .status(200)
      .json({ success: true, message: "job deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const jobId = req.params.jobId;

    const comment = await Comment.create({
      content,
      job: jobId,
      user: req.user.id,
    });

    await Job.findByIdAndUpdate(jobId, { $push: { comments: comment._id } });

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const jobId = req.params.jobId;

    const review = await Review.create({
      rating,
      comment,
      job: jobId,
      user: req.user.id,
    });

    await Job.findByIdAndUpdate(jobId, { $push: { reviews: review._id } });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
