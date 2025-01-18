const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");
const { upload } = require("../middlewares/uploadMiddleware");

const router = express.Router();

// router.post("/register", registerUser);

router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login", loginUser);
// router.get("/logout", logoutUser);

module.exports = router;
