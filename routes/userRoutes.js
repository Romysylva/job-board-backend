const express = require("express");
const User = require("../models/UserModels");
const {
  // registerUser,
  // loginUser,
  // getUserProfile,
  updateUserProfile,
  deleteUser,
  deleteUserByAdmin,
  getAllUsers,
  changePassword,
  getUserProfile,
  updatePreferences,
  getuserPreferences,
  getActivityStats,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/profile", protect, getUserProfile);
// router.put("/:id", protect, upload.single("profileImage"), updateUserProfile);

router.put("/profile/password", protect, changePassword);
router.get("/:id", protect, getUserProfile);

// router.post("/register", registerUser);

// router.post("/login", loginUser);

router.delete("/:id", protect, deleteUser);

router.delete("/admin/:id", protect, adminOnly, deleteUserByAdmin);
router.get("/", protect, adminOnly, getAllUsers);
router.put("/preferences", protect, updatePreferences);
router.get("/preferences", protect, getuserPreferences);

router.get("/api/admin/stats", protect, adminOnly, getActivityStats);

module.exports = router;
