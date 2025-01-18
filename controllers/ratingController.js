const Rating = require("../models/RatingModels");

// @desc    Add or update a rating for a job or company
// @route   POST /api/ratings
// exports.addOrUpdateRating = async (req, res) => {
//   const { targetType, targetId, rating } = req.body;

//   try {
//     const existingRating = await Rating.findOne({
//       targetType,
//       targetId,
//       user: req.user.id,
//     });
//     if (existingRating) {
//       existingRating.rating = rating;
//       await existingRating.save();
//       return res.status(200).json({ success: true, data: existingRating });
//     }

//     const newRating = await Rating.create({
//       targetType,
//       targetId,
//       user: req.user.id,
//       rating,
//     });
//     res.status(201).json({ success: true, data: newRating });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.addOrUpdateRating = async (req, res) => {
//   const { jobId } = req.params;
//   const { rating } = req.body;

//   if (rating < 1 || rating > 5) {
//     return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
//   }

//   try {
//     const job = await Job.findById(jobId);

//     if (!job) {
//       return res.status(404).json({ success: false, message: "Job not found" });
//     }

//     const existingRating = job.ratings.find((r) => r.user.toString() === req.user.id);

//     if (existingRating) {
//       // Update the rating
//       existingRating.rating = rating;
//     } else {
//       // Add a new rating
//       job.ratings.push({ user: req.user.id, rating });
//     }

//     await job.save();

//     // Calculate the average rating
//     const avgRating =
//       job.ratings.reduce((sum, r) => sum + r.rating, 0) / job.ratings.length;

//     res.json({ success: true, averageRating: avgRating, ratings: job.ratings });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

exports.addOrUpdateRating = async (req, res) => {
  const { targetType, targetId, rating } = req.body;

  // Validate the inputs
  if (!targetType || !targetId || !rating) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  // Validate rating is a number within a certain range (e.g., 1 to 5)
  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ success: false, message: "Rating must be between 1 and 5" });
  }

  try {
    // Check if rating already exists
    const existingRating = await Rating.findOne({
      targetType,
      targetId,
      user: req.user.id,
    });

    if (existingRating) {
      // If rating exists, update it
      existingRating.rating = rating;
      await existingRating.save();
      return res.status(200).json({ success: true, data: existingRating });
    }

    // If no rating exists, create a new one
    const newRating = await Rating.create({
      targetType,
      targetId,
      user: req.user.id,
      rating,
    });

    res.status(201).json({ success: true, data: newRating });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
