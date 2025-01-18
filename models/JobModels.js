const mongoose = require("mongoose");
// const CommentSchema = require("../models/CommentModels");

// const JobShcema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     company: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Company",
//       required: true,
//     },
//     location: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     salary: {
//       type: String,
//       // required: true,
//     },
//     experience: {
//       type: String,
//       // required: true,
//     },
//     skills: {
//       type: [String],
//       // required: true,
//     },
//     contactEmail: {
//       type: String,
//       // required: true,
//     },
//     postedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     jobType: {
//       type: String,
//       enum: ["full-time", "part-time", "contract"],
//       required: true,
//     },
//   },

//   { timestamps: true }
// );

// module.exports = mongoose.model("Job", JobShcema);

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false } // Prevents creating a separate _id for subdocuments
);

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    location: { type: String, required: true },
    description: { type: String, required: true },
    salary: { type: String },
    experience: { type: String },
    skills: [String],
    contactEmail: { type: String, required: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract"],
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs
    comments: [CommentSchema],
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: { type: Number, required: true, min: 1, max: 5 }, // 1-5 stars
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to User model
      },
    ],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
