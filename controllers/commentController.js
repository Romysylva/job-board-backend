const commentController = require("../models/CommentModels");

// exports.addComment = async (req, res) => {
//   const { content, job } = req.body;

//   try {
//     const comment = await commentController.create({
//       content,
//       job,
//       user: req.user.id,
//     });
//     if (!comment)
//       return res
//         .status(404)
//         .json({ success: false, message: "Comment not found" });
//     res.status(201).json({ success: true, data: comment });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// exports.getComments = async (req, res) => {
//   try {
//     const comment = await commentController
//       .find({ job: req.params.jobId })
//       .populate("user", "name");
//     if (!comment)
//       return res
//         .status(404)
//         .json({ success: false, message: "Comment not found" });
//     res.json({ success: true, data: comment });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.updateComment = async (req, res) => {
//   try {
//     const comment = await commentController.findByIdAndUpdate(
//       req.params.commentId,
//       req.body,
//       { new: true }
//     );
//     if (!comment)
//       return res
//         .status(404)
//         .json({ success: false, message: "Comment not found" });
//     res.json({ success: true, data: comment });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// exports.deleteComment = async (req, res) => {
//   try {
//     const comment = await commentController.findById(req.params.id);
//     if (!comment || comment.user.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized to delete this comment",
//       });
//     }
//     await comment.remove();
//     res
//       .status(200)
//       .json({ success: true, message: "Comment deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// Add Comment
exports.addComment = async (req, res) => {
  const { content, job } = req.body;
  if (!content || !job) {
    return res
      .status(400)
      .json({ success: false, message: "Content and job are required" });
  }

  try {
    const comment = await commentController.create({
      content,
      job,
      user: req.user.id,
    });

    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get Comments
exports.getComments = async (req, res) => {
  try {
    const comments = await commentController
      .find({ job: req.params.jobId })
      .populate("user", "name");

    if (comments.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No comments found" });
    }

    res.json({ success: true, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
