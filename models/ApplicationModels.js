const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job", // Reference to the Job schema
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User schema
      required: true,
    },
    resumeLink: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Interview", "Accepted", "Rejected"],
      default: "Pending",
    },
    feedback: {
      type: String, // Optional feedback from recruiters
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

ApplicationSchema.pre("save", function (next) {
  if (
    !["pending", "Accepted", "Rejected", "Reviewed", "Interview"].includes(
      this.status
    )
  ) {
    return next(new Error("Invalid status value"));
  }
  next();
});
// Populate job titles and user names when fetching an applicant
ApplicationSchema.virtual("jobDetails", {
  ref: "Job",
  localField: "job",
  foreignField: "_id",
  justOne: true,
});

ApplicationSchema.virtual("userDetails", {
  ref: "User",
  localField: "user",
  foreignField: "_id",
  justOne: true,
});

ApplicationSchema.set("toJSON", { virtuals: true });
ApplicationSchema.set("toObject", { virtuals: true });

// Ensure a user can only apply to a job once

ApplicationSchema.index({ job: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Application", ApplicationSchema);
