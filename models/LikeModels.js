const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      required: true,
      enum: ["comment", "review"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Like", LikeSchema);
