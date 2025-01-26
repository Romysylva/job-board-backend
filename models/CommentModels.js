const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    commentText: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "targetType", // Dynamic reference
      required: true,
    },
    targetType: {
      type: String,
      enum: ["Job", "Company"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
