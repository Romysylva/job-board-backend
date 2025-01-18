const Review = require("../models/ReviewModels");

exports.addReview = async (req, res) => {
  const { company, rating, content } = req.body;

  try {
    const review = await Review.create({
      company,
      user: req.user.id,
      rating,
      content,
    });
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ company: req.params.companyId })
      .populate("user", "name")
      .sort({ date: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review || review.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized or not found" });
    }
    await review.remove();
    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
