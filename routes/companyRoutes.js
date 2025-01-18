const express = require("express");

const {
  createCompany,
  getCompanies,
  getCompany,
} = require("../controllers/companyController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Company routes
router.post("/", protect, createCompany);
router.get("/", getCompanies);
router.get("/:id", getCompany);

module.exports = router;
