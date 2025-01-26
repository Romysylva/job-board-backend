const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    description: { type: String },
    location: { type: String },

    jobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    logo: {
      type: String,
      required: true,
      default: "/images/default-company-logo.png",
    },

    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          // required: true,
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
      },
    ],

    ratingsSummary: {
      averageRating: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Company", CompanySchema);
