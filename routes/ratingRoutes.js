const express = require("express");
const { addOrUpdateRating } = require("../controllers/ratingController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

// Rating routes
router.post("/:jobId/rate", protect, addOrUpdateRating);

module.exports = router;
