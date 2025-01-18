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
// router.get("/preferences", protect, async (req, res) => {
//   try {
//     const userPreferences = {
//       notifications: true,
//       darkMode: false,
//       emailUpdates: true,
//     };

//     res.status(200).json({ preferences: userPreferences }); // Ensure this matches the frontend's expectation
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch preferences" });
//   }
// });

module.exports = router;
