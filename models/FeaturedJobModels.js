const mongoose = require("mongoose");

const FeaturedJobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  postedDate: { type: Date, required: true },
  company: {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    description: { type: String, required: true },
    website: { type: String, required: true },
  },
  description: { type: String, required: true },
  responsibilities: [{ type: String, required: true }],
  requirements: [{ type: String, required: true }],
  perks: [{ type: String, required: true }],
  deadline: { type: Date, required: true },
});

const FeaturedJob = mongoose.model("FeaturedJob", FeaturedJobSchema);

module.exports = FeaturedJob;
