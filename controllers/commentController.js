const commentController = require("../models/CommentModels");
const Job = require("../models/JobModels");
const Company = require("../models/CompanyModels");

exports.postComment = async (req, res) => {
  try {
    const { commentText, targetId, targetType } = req.body;

    if (!commentText || !targetId || !targetType) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!["Job", "Company"].includes(targetType)) {
      return res.status(400).json({ message: "invalid target type" });
    }

    const targetModel = targetType === "Job" ? Job : Company;
    const target = await targetModel.findById(targetId);
    if (!target) {
      return res.status(404).json({ message: `${targetType} not found.` });
    }

    const userId = req.user.id;
    // Create the comment
    const newComment = new commentController({
      user: userId,
      commentText,
      targetId,
      targetType,
    });
    await newComment.save();
    // const newComment = await commentController.create({
    //   user: userId,
    //   commentText,
    //   targetId,
    //   targetType,
    // });

    return res.status(201).json({
      success: true,
      comment: newComment,
    });
  } catch (error) {
    console.error("Error posting comment:", error);
    res.status(500).json({
      success: false,
      message: "Error posting comment",
    });
  }
};

// Get Comments
exports.getComments = async (req, res) => {
  try {
    const CommentCount = await commentController.countDocuments();
    const comments = await commentController
      .find({ job: req.params.jobId })
      .populate("user", "commentText username");

    if (comments.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No comments found" });
    }

    res.json({ success: true, tootalComments: CommentCount, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSingleComment = async (req, res) => {
  const { targetId, targetType } = req.query;

  if (!targetId || !targetType) {
    return res
      .status(400)
      .json({ message: "targetId amd targetType are required." });
  }

  try {
    const comments = await commentController
      .find({ targetId, targetType })
      .populate("user", "username profileImage");
    const filteredComments = comments.filter((comment) => comment.user);
    res.status(200).json({ comments: filteredComments });
  } catch (err) {
    console.error("Error fetching comments", err);
    res.status(404).json({
      success: false,
      message: "An error occurred while fetching comments",
    });
  }
};

// Update Comment
exports.updateComment = async (req, res) => {
  try {
    const comment = await commentController.findByIdAndUpdate(
      req.params.commentId,
      req.body,
      { new: true }
    );

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    res.json({ success: true, data: comment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await commentController.findById(req.params.commentId);

    if (!comment || comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this comment",
      });
    }

    await comment.remove();
    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
