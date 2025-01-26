const mongoose = require("mongoose");
const Job = require("../models/JobModels");
const Comment = require("../models/CommentModels");
const Review = require("../models/ReviewModels");
const Company = require("../models/CompanyModels");

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
    comments,
    reviews,
    ratings,
    likes,
    applicants,
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
      comments,
      reviews,
      ratings,
      likes,
      applicants,
    });

    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getJobs = async (req, res) => {
  // const companyId = req.user.companyId;
  // const companyId = req.company?.id;
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
    console.log("somethig went wrong");
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

exports.JobDetails = async (req, res) => {
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid Job ID format" });
  }

  try {
    const job = await Job.findById(req.params.id)
      .populate("postedBy", "name email")
      .populate({
        path: "applicants",
        populate: { path: "user", select: "username profileImage" },
      })
      .populate("company", "name logo")
      .populate("comments", "commentText")
      .populate("reviews.userId", "reviewText username rating")
      .populate("ratingsSummary", "username email")
      .populate("likes", "name email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error("Error fetching job details:", error.message || error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

exports.likeJob = async (req, res) => {
  const { jobId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Add the user to the likes array if not already liked
    if (!job.likes.some((like) => like.user.toString() === userId)) {
      job.likes.push({ user: userId });
      await job.save();
    }

    res.json({ likes: job.likes.length });
  } catch (err) {
    console.error("Error in likeJob controller:", err);
    res
      .status(500)
      .json({ message: "Error liking the job.", error: err.message });
  }
};

exports.CompanyCreateJob = async (req, res) => {
  try {
    const { title, description, salary, location, jobType } = req.body;

    // Ensure the company is authenticated and authorized
    const companyId = req.company?.id; // Assuming company data is attached by authentication middleware
    if (!companyId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Validate request data
    if (!title || !description || !salary || !location || !jobType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Create the new job
    const newJob = new Job({
      title,
      description,
      salary,
      location,
      jobType,
      company: companyId, // Link the job to the authenticated company
    });

    // Save the job to the database
    const savedJob = await newJob.save();

    // Add the job to the company's job list
    company.jobs.push(savedJob._id);
    await company.save();

    const populatedJobs = await Job.findById(savedJob._id).populate(
      "company",
      "name",
      "description"
    );

    return res.status(201).json({
      message: "Job created successfully",
      job: populatedJobs,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
