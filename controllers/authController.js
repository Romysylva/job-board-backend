const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModels");
const { upload } = require("../middlewares/uploadMiddleware");

// exports.registerUser = async (req, res) => {
//   const { username, email, password, roles } = req.body;

//   try {
//     const user = await User.create({ username, email, password, roles });

//     const userObject = { ...user.toObject() };
//     delete userObject.password;
//     res.status(201).json({
//       success: true,
//       data: userObject,
//     });
//   } catch (err) {
//     return res.status(400).json({ success: false, message: err.message });
//   }
// };

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
      profileImage, // Store profile image path in the database
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
      { expiresIn: "1d" }
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
