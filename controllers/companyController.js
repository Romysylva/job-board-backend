const Company = require("../models/CompanyModels");
const Job = require("../models/JobModels");
const mongoose = require("mongoose");

exports.createCompany = async (req, res) => {
  const { name, shirtDescription, location, about } = req.body;
  try {
    const company = await Company.create({
      name,
      shirtDescription,
      location,
      createdBy: req.user.id,
    });
    res.status(201).json({ success: true, data: company });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// let company = Company.findOne(params.company._id);
// const normalizedLogoPath = company.logo.replace(/\\/g, "/");
// res.json({ logo: normalizedLogoPath });

exports.getCompany = async (req, res) => {
  const companyId = req.company?.id || req.params.id;
  // req.params.id
  console.log(companyId);

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    return res.status(400).json({ message: "Invalid Company ID format" });
  }

  try {
    const company = await Company.findById(companyId).populate(
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

// GET /api/companies/:companyId
exports.getCompanyDetails = async (req, res) => {
  const companyId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    return res.status(400).json({ message: "Invalid Company ID format" });
  }

  try {
    const company = await Company.findById(companyId).populate(
      "jobs",
      "title description location salary"
    );
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    console.error("Error fetching company details:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.params.id }).select(
      "title location salary"
    );
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
