const User = require("../models/UserModels");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // console.log("Token:", token); // Debugging token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded Token:", decoded); // Debugging decoded payload

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.roles === "admin") {
    return next();
  }
  res.status(403).json({ message: "Not authorized as admin" });
};

// isAdmin = (req, res, next) => {
//   if (req.user && req.user.roles.includes('admin')) {
//     next();
//   } else {
//     res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
//   }
// };

module.exports = { protect, adminOnly };
