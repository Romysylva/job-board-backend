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
    const { name, email, password, shortDescription, location, about } =
      req.body;

    const logo = req.file ? req.file.path : null;

    if (![name || email || password || shortDescription || location || about]) {
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
      about,
      password: hashedPassword,
      shortDescription,
      location,
      logo,
    });

    const companyObject = { ...newCompany.toObject() };
    delete companyObject.password;

    return res.status(201).json({
      success: true,
      message: "Company registered successfully",
      // company: {
      //   id: newCompany._id,
      //   name: newCompany.name,
      //   email: newCompany.email,
      //   shortDescription: newCompany.shortDescription,
      //   location: newCompany.location,
      // },
      company: companyObject,
    });
  } catch (error) {
    console.error("Error during company registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.companyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (![email || password]) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, company.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
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

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
