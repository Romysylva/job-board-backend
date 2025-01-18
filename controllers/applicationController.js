const mongoose = require("mongoose");
const Application = require("../models/ApplicationModels");
const Job = require("../models/JobModels");
const User = require("../models/UserModels");

// Create an application
exports.createApplication = async (req, res) => {
  const { resume, coverLetter } = req.body;
  const userId = req.user.id;
  const jobId = req.body.job;

  try {
    // Check if job exists
    const job = await Job.findById(jobId);
    // console.log("Received job ID:", jobId);
    // console.log("Received user ID:", req.user.id);
    // console.log("job object", job);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      user: userId,
      resume: resume,
      coverLetter,
    });

    res
      .status(201)
      .json({ success: true, message: "Application submitted", application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("user", "username email")
      .populate("job", "title company");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all applications for a job
exports.getApplicationsForJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    const applications = await Application.find({ job: jobId }).populate(
      "user",
      "username email"
    );
    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all applications for a user
exports.getApplicationsForUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const applications = await Application.find({ user: userId }).populate(
      "job",
      "title company"
    );
    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an application status
exports.updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  try {
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Application updated", application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update application status

exports.updateApStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }

    console.log("Received ID:", id); // Log the received ID for debugging

    // Find the application by ID and populate job and user details
    const application = await Application.findById(
      new mongoose.Types.ObjectId(id)
    )
      .populate("job")
      .populate("user");

    console.log("Application Retrieved:", application); // Log the application after fetching

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    // Update the application status
    application.status = status;
    await application.save();

    res.json({
      success: true,
      message: "Status updated successfully",
      application,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// exports.updateApStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   try {
//     // Validate ID format
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid ID format" });
//     }

//     console.log("Received ID:", id);

//     const application = await Application.findById(id)
//       .populate("job")
//       .populate("user");
//     if (!application) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Application not found" });
//     }

//     application.status = status;
//     await application.save();

//     res.json({
//       success: true,
//       message: "Status updated successfully",
//       application,
//     });
//   } catch (error) {
//     console.error("Error updating status:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// Delete an application
exports.deleteApplication = async (req, res) => {
  const { applicationId } = req.params;

  try {
    const application = await Application.findByIdAndDelete(applicationId);

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    res.status(200).json({ success: true, message: "Application deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
