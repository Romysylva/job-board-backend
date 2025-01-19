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

// const CommentSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     comment: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//   },
//   { _id: false } // Prevents creating a separate _id for subdocuments
// );

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
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          // required: true,
        },
        rating: { type: Number, required: true, min: 1, max: 5 }, // 1-5 stars
      },
    ],
    applicants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          // required: true,
        },
        status: { type: String, enum: ["pending", "approved", "rejected"] },

        appliedAt: { type: Date, default: Date.now },
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

// const jobSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: [true, "Job title is required"],
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: [true, "Job description is required"],
//     },
//     company: {
//       type: String,
//       required: [true, "Company name is required"],
//     },
//     location: {
//       type: String,
//       required: [true, "Job location is required"],
//     },
//     salary: {
//       type: String, // Can also use Number if salary is numeric
//       required: false,
//     },
//     employmentType: {
//       type: String,
//       enum: ["Full-Time", "Part-Time", "Contract", "Internship", "Temporary"],
//       // required: true,
//     },
//     skills: {
//       type: [String], // Array of skills required for the job
//       default: [],
//     },
//     postedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", // Assuming "User" is the user schema
//       required: true,
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//     updatedAt: {
//       type: Date,
//       default: Date.now,
//     },
//     isFeatured: {
//       type: Boolean,
//       default: false, // Mark jobs as featured
//     },
//     applicationDeadline: {
//       type: Date,
//       required: false,
//     },
//     applicants: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//         appliedAt: {
//           type: Date,
//           default: Date.now,
//         },
//         status: {
//           type: String,
//           enum: ["Applied", "Interviewed", "Rejected", "Hired"],
//           default: "Applied",
//         },
//       },
//     ],
//     comments: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//         comment: {
//           type: String,
//           required: true,
//         },
//         createdAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//     reviews: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//         review: {
//           type: String,
//           required: true,
//         },
//         createdAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//     ratings: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//         rating: {
//           type: Number,
//           required: true,
//           min: 1,
//           max: 5,
//         },
//         createdAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//     likes: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//         likedAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//   },
//   {
//     timestamps: true, // Automatically adds createdAt and updatedAt fields
//   }
// );

// module.exports = mongoose.model("Job", jobSchema);

// module.exports = Job;
