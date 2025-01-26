const Review = require("../models/ReviewModels");
const Job = require("../models/JobModels");
const Company = require("../models/CompanyModels");

exports.postReview = async (req, res) => {
  const { targetId, targetType, rating, reviewText } = req.body;

  try {
    // Validate target type
    if (!["Job", "Company"].includes(targetType)) {
      return res.status(400).json({ message: "Invalid target type" });
    }

    // Check if target exists
    const targetModel = targetType === "Job" ? Job : Company;
    const target = await targetModel.findById(targetId);
    if (!target) {
      return res.status(404).json({ message: `${targetType} not found` });
    }

    const userId = req.user.id;
    // Create and save the review
    const newReview = new Review({
      targetId,
      targetType,
      rating,
      reviewText,
      user: userId,
    });
    await newReview.save();

    res
      .status(201)
      .json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Error posting review:", error);
    res.status(500).json({ message: "Error posting review" });
  }
};

// Fetch all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found." });
    }
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews.", error });
  }
};

exports.getReviews = async (req, res) => {
  const { targetId, targetType } = req.query;

  // Validate input
  if (!targetId || !targetType) {
    return res
      .status(400)
      .json({ message: "targetId and targetType are required." });
  }

  try {
    const reviews = await Review.find({ targetId, targetType }).populate(
      "user",
      "username profileImage"
    );

    const filteredReviews = reviews.filter((review) => review.user);
    // console.log(filteredReviews);

    // if (!filteredReviews.length) {
    //   return res.status(404).json({ message: "No reviews found." });
    // }

    res.status(200).json({ reviews: filteredReviews });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res
      .status(500)
      .json({ message: "An error occurred while fetching reviews." });
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

// exports.getAllReviewsWithPagination = async (req, res) => {
//   const { page = 1, limit = 10 } = req.query; // Defaults: page=1, limit=10
//   try {
//     const reviews = await Review.find()
//       .skip((page - 1) * limit)
//       .limit(Number(limit));
//     const total = await Review.countDocuments();
//     res.status(200).json({
//       reviews,
//       total,
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch reviews.", error });
//   }
// };

// Filter Reviews: Add query parameters for filtering by targetType, rating,
// exports.getFilteredReviews = async (req, res) => {
//   const { targetType, rating } = req.query;
//   const query = {};
//   if (targetType) query.targetType = targetType;
//   if (rating) query.rating = Number(rating);

//   try {
//     const reviews = await Review.find(query);
//     res.status(200).json({ reviews });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch reviews.", error });
//   }
// };
