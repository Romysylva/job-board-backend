const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    shortDescription: { type: String },
    location: { type: String, required: true },
    about: { type: String, required: true },

    jobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    logo: {
      type: String,
      required: true,
      default:
        "https://media.istockphoto.com/id/2183945464/photo/cross-shape-or-letter-x.jpg?s=2048x2048&w=is&k=20&c=upUf4e1bwT1xNSK7p1nKsppVSWtkCRJ6pHhaoFQb82w=",
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
