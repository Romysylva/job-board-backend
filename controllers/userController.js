const asyncHandler = require("express-async-handler");
const User = require("../models/UserModels");
const generateToken = require("../utils/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const getAllUsers = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const users = await User.find({}).select("-password"); // Exclude passwords
    res.json({ success: true, totalUsers: userCount, data: users });
  } catch (error) {
    res
      .status(500)
      .json({ success: true, message: "Server error", error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  const { id } = req.params; // User ID to update
  const { username, email, roles, profileImage } = req.body; // Data to update

  try {
    // Fetch the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update the fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (user.roles === "admin") user.roles = roles;
    if (profileImage) user.profileImage = profileImage;

    // Save the updated user
    const updatedUser = await user.save();

    // Send a response excluding the password
    const { password, ...userData } = updatedUser.toObject();
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: userData,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// const multer = require("multer");
// const upload = multer({ dest: "uploads/" }); // Configure storage for images

const getUserProfile = async (req, res) => {
  // const { id } = req.params;

  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      username: user.username,
      email: user.email,
      roles: user.roles,
      profileImage: user.profileImage,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the user.",
    });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete any user (admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User has been deleted successfully by admin",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    // Validate inputs
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Both passwords are required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Verify the current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });
    }

    // Update the password
    user.password = newPassword; // This triggers pre("save") for hashing
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user ID
    const { preferences } = req.body;

    // Validate preferences
    if (!preferences) {
      return res.status(400).json({ message: "Preferences data is required" });
    }

    // Update user preferences
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { preferences },
      { new: true, runValidators: true }
    ).select("preferences");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Preferences updated successfully",
      data: updatedUser.preferences,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getuserPreferences = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("preferences");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ preferences: user.preferences });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch preferences" });
  }
};

const getActivityStats = async (req, res) => {
  try {
    const jobCount = await Job.countDocuments();
    const userCount = await User.countDocuments();
    const applicationsCount = await Job.aggregate([
      { $unwind: "$applicants" },
      { $count: "totalApplications" },
    ]);

    const stats = {
      jobs: jobCount,
      users: userCount,
      applications: applicationsCount[0]?.totalApplications || 0,
    };

    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

module.exports = {
  getActivityStats,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  deleteUserByAdmin,
  getAllUsers,
  changePassword,
  updatePreferences,
  getuserPreferences,
};
