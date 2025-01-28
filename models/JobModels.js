const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    location: { type: String, required: true },
    description: { type: String, required: true },
    salary: { type: String },
    experience: { type: String },
    skills: [String],
    contactEmail: { type: String },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      required: true,
    },

    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
      },
    ],

    ratingsSummary: {
      averageRating: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 },
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
    // likes: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //   },
    // ],
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

// Populate company name and applicant names when fetching a job
JobSchema.virtual("companyDetails", {
  ref: "Company",
  localField: "company",
  foreignField: "_id",
  justOne: true,
});

JobSchema.virtual("applicantDetails", {
  ref: "Applicant",
  localField: "applicants",
  foreignField: "_id",
});

JobSchema.set("toJSON", { virtuals: true });
JobSchema.set("toObject", { virtuals: true });

// Create a unique index to enforce one rating per user per job
JobSchema.index({ "ratings.user": 1, _id: 1 }, { unique: true });

JobSchema.methods.updateRatingsSummary = async function () {
  const totalRatings = this.ratings.length;
  const sumOfRatings = this.ratings.reduce(
    (sum, rating) => sum + rating.rating,
    0
  );
  this.ratingsSummary.averageRating = totalRatings
    ? sumOfRatings / totalRatings
    : 0;
  this.ratingsSummary.totalRatings = totalRatings;
  await this.save();
};

module.exports = mongoose.model("Job", JobSchema);
