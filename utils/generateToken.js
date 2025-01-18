const jwt = require("jsonwebtoken");

// Function to generate a JWT for a user
const generateToken = (userId, isAdmin = false) => {
  return jwt.sign(
    {
      userId,
      isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    }
  );
};

module.exports = generateToken;
