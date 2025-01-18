const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resume: { type: String, required: true }, // e.g., URL to resume file
    coverLetter: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

applicationSchema.pre("save", function (next) {
  if (!["pending", "approved", "rejected"].includes(this.status)) {
    return next(new Error("Invalid status value"));
  }
  next();
});

// Ensure a user can only apply to a job once

applicationSchema.index({ job: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
