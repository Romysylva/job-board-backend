const mongoose = require("mongoose");

// const ReviewSchema = new mongoose.Schema(
//   {
//     content: {
//       type: String,
//       required: true,
//     },
//     rating: {
//       type: Number,
//       min: 1,
//       max: 5,
//       required: true,
//     },
//     company: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Company",
//       required: true,
//     },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

const ReviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
