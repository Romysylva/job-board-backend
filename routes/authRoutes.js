const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  registerCompany,
  companyLogin,
} = require("../controllers/authController");
const { upload } = require("../middlewares/uploadMiddleware");

const router = express.Router();

// router.post("/register", registerUser);

router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login", loginUser);
// router.get("/logout", logoutUser);

// Company Registration Route
router.post("/company/register", upload.single("logo"), registerCompany);

// Company Login Route
router.post("/company/login", companyLogin);

module.exports = router;
