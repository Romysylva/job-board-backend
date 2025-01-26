const Rating = require("../models/RatingModels");
const Job = require("../models/JobModels");
const Company = require("../models/CompanyModels");

exports.createRating = async (req, res) => {
  const { user, targetId, rating, targetType } = req.body;

  if (!user || !targetId || !rating || !targetType) {
    return res
      .status(400)
      .json({ message: "userId and targetId are required." });
  }

  try {
    const existingRating = await Rating.findOne({
      user,
      targetId,
      rating,
      targetType: "Company",
    });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
    } else {
      await Rating.create({ user, targetId, targetType: "Company", rating });
    }

    const ratings = await Rating.find({ targetId, targetType: "Company" });
    const totalRatings = ratings.length;
    const averageRating =
      ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

    await Company.findByIdAndUpdate(targetId, {
      "ratingsSummary.averageRating": averageRating,
      "ratingsSummary.totalRatings": totalRatings,
    });

    res
      .status(200)
      .json({ success: true, message: "Rating updated successfully" });
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.Ratings = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    const existingRating = job.ratings.find(
      (r) => r.user.toString() === userId
    );
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      job.ratings.push({ user: userId, rating });
    }

    await job.updateRatingsSummary();

    res.status(200).json({ message: "Rating submitted successfully." });
  } catch (err) {
    console.error("Error submitting rating:", err.message);
    res.status(500).json({ message: "Error submitting rating." });
  }
};

// module.exports = router;

// if (!userId || !targetId || !rating || !targetType) {
//   return res
//     .status(400)
//     .json({ message: "userId and targetId are required." });
// }

// try {
//   const newRating = new Rating({
//     rating,
//     userId,
//     targetId,
//     targetType,
//   });
//   await newRating.save();
//   res.status(201).json({ message: "Rating submitted successfully!" });
// } catch (error) {
//   console.error("Error submitting rating:", error);
//   res.status(500).json({ message: "Error submitting rating." });
// }
