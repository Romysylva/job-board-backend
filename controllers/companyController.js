const Company = require("../models/CompanyModels");

// @desc    Create a new company
// @route   POST /api/companies
exports.createCompany = async (req, res) => {
  const { name, description, location } = req.body;
  try {
    const company = await Company.create({
      name,
      description,
      location,
      createdBy: req.user.id,
    });
    res.status(201).json({ success: true, data: company });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all companies
// @route   GET /api/companies
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single company
// @route   GET /api/companies/:id
exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate(
      "jobs",
      "title location salary"
    );
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
