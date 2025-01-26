const Like = require("../models/LikeModels");
const Job = require("../models/JobModels");

// exports.toggleLike = async (req, res) => {
//   const { targetType, targetId } = req.body;
//   try {
//     const existingLike = await Like.findOne({
//       targetType,
//       targetId,
//       user: req.user.id,
//     });

//     if (existingLike) {
//       await existingLike.remove();
//       return res
//         .status(200)
//         .json({ success: true, message: "Unliked successfully" });
//     }
//     const like = await Like.create({ targetType, targetId, user: req.user.id });
//     res.status(201).json({ success: true, like });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.toggleLike = async (req, res) => {
//   const { jobId } = req.params;
//   const userId = req.user.id;

//   try {
//     const job = await Job.findById(jobId);

//     if (!job) {
//       return res.status(404).json({ success: false, message: "Job not found" });
//     }

//     if (job.likes.includes(userId)) {
//       // Unlike the job
//       job.likes = job.likes.filter((id) => id.toString() !== userId);
//     } else {
//       // Like the job
//       job.likes.push(userId);
//     }

//     await job.save();

//     res.json({ success: true, likes: job.likes.length });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// @desc    Like a comment or review
// @route   POST /api/likes
exports.addLike = async (req, res) => {
  const { targetType, targetId } = req.body; // targetType could be 'comment' or 'review'

  try {
    // Ensure the targetType is valid
    if (!["comment", "review"].includes(targetType)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid target type" });
    }

    // Check if the user has already liked this target
    const existingLike = await Like.findOne({
      targetType,
      targetId,
      user: req.user.id, // req.user.id should contain the logged-in user's ID
    });

    if (existingLike) {
      return res.status(400).json({ success: false, message: "Already liked" });
    }

    // Create a new like
    const newLike = await Like.create({
      targetType,
      targetId,
      user: req.user.id,
    });

    res.status(201).json({ success: true, data: newLike });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all likes for a specific target (comment or review)
// @route   GET /api/likes/:targetType/:targetId
exports.getLikes = async (req, res) => {
  const { targetType, targetId } = req.params;

  try {
    // Ensure the targetType is valid
    if (!["comment", "review"].includes(targetType)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid target type" });
    }

    // Fetch all likes for the given target
    const likes = await Like.find({ targetType, targetId }).populate(
      "user",
      "username"
    );

    res.status(200).json({ success: true, data: likes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove a like for a comment or review
// @route   DELETE /api/likes/:likeId
exports.removeLike = async (req, res) => {
  const { likeId } = req.params;

  try {
    // Find the like and check if it's the logged-in user who is trying to remove it
    const like = await Like.findById(likeId);
    if (!like || like.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to remove this like",
      });
    }

    // Remove the like
    await like.remove();

    res
      .status(200)
      .json({ success: true, message: "Like removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add or remove a like for a job
// @route   POST /api/jobs/:jobId/like
exports.likeJob = async (req, res) => {
  try {
    console.log("Request received for liking job:", req.params.jobId);
    console.log("User attempting to like:", req.user.id);

    // Find the job by ID
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check if the user already liked the job
    if (job.likes.includes(req.user.id)) {
      return res
        .status(400)
        .json({ success: false, message: "You have already liked this job" });
    }

    // Add the user's ID to the likes array
    job.likes.push(req.user.id);
    await job.save();

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    console.error("Error in likeJob controller:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// In routes/jobs.js
// const express = require("express");
// const router = express.Router();
// const { likeJob, dislikeJob } = require("../controllers/jobController");

// router.post("/:jobId/like", likeJob);
// router.post("/:jobId/dislike", dislikeJob);

// module.exports = router;

// // In controllers/jobController.js
// exports.likeJob = async (req, res) => {
//   try {
//     const { jobId } = req.params;
//     const userId = req.user.id; // Assuming authentication middleware adds user info to req

//     const job = await Job.findById(jobId);
//     if (!job) return res.status(404).json({ message: "Job not found" });

//     if (!job.likes.includes(userId)) {
//       job.likes.push(userId);
//       await job.save();
//     }

//     res.status(200).json({ likes: job.likes.length });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error liking the job" });
//   }
// };

// exports.dislikeJob = async (req, res) => {
//   try {
//     const { jobId } = req.params;
//     const userId = req.user.id;

//     const job = await Job.findById(jobId);
//     if (!job) return res.status(404).json({ message: "Job not found" });

//     job.likes = job.likes.filter((id) => id.toString() !== userId);
//     await job.save();

//     res.status(200).json({ likes: job.likes.length });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error disliking the job" });
//   }
// };
