const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const { protect, adminOnly } = require("../middlewares/authMiddleware"); // Middleware to protect routes

// Routes for applications
router.post("/apply", protect, applicationController.applyToJob);
router.get("/job/:jobId", protect, applicationController.getApplicationsForJob);
router.get("/user", protect, applicationController.getApplicationsForUser);
router.put(
  "/:applicationId",
  protect,
  applicationController.updateApplicationStatus
);
router.delete(
  "/:applicationId",
  protect,
  applicationController.deleteApplication
);

router.get(
  "/all",
  protect,
  adminOnly,
  applicationController.getAllApplications
);

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  applicationController.updateApStatus
);

module.exports = router;
