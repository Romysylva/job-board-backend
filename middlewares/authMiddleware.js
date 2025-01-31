const jwt = require("jsonwebtoken");
const Company = require("../models/CompanyModels");
const User = require("../models/UserModels");

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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

const authenticateCompany = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const company = await Company.findById(decoded.id);

    if (!company) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.company = company; // Attach company data to the request
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access Denied: Insufficient Permissions",
      });
    }
    next();
  };
};

module.exports = { protect, adminOnly, authenticateCompany, authorizeRoles };

// isAdmin = (req, res, next) => {
//   if (req.user && req.user.roles.includes('admin')) {
//     next();
//   } else {
//     res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
//   }
// };
