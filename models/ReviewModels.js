const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    reviewText: {
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

module.exports = mongoose.model("Review", ReviewSchema);

// const ReviewSchema = new mongoose.Schema(
//   {
//     rating: { type: Number, required: true, min: 1, max: 5 },
//     comment: { type: String },
//     job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Review", ReviewSchema);
