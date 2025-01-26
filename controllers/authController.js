const Company = require("../models/CompanyModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModels");
const { upload } = require("../middlewares/uploadMiddleware");

exports.registerUser = async (req, res) => {
  const { username, email, password, roles } = req.body;

  // Check if a file is uploaded
  const profileImage = req.file ? req.file.path : null;

  try {
    // Create user with profile image
    const user = await User.create({
      username,
      email,
      password,
      roles,
      profileImage,
    });

    const userObject = { ...user.toObject() };
    delete userObject.password;

    res.status(201).json({
      success: true,
      data: userObject,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: "90d" }
    );

    // const isPasswordMatch = await user.matchPassword(password);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.roles,
        },
      });
  } catch (err) {
    cnosole.log(err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};
exports.logoutUser = (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), // Expire immediately
    })
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully",
    });
};

// Company Registration Handler
exports.registerCompany = async (req, res) => {
  try {
    const { name, email, password, description, location } = req.body;

    // Validate request body
    if (![name || email || password || description || location]) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: "Company already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new company
    const newCompany = await Company.create({
      name,
      email,
      password: hashedPassword,
      description,
      location,
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company: {
        id: newCompany._id,
        name: newCompany.name,
        email: newCompany.email,
        description: newCompany.description,
        location: newCompany.location,
      },
    });
  } catch (error) {
    console.error("Error during company registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.companyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (![email || password]) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find the company by email
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Compare provided password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, company.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // Token is valid for 1 day
    });

    return res.status(200).json({
      message: "Login successful",
      token, // Return the token
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
