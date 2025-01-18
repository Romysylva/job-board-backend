const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    roles: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profileImage: { type: String, default: "" },
    preferences: {
      theme: { type: String, default: "light" }, // "light" or "dark"
      notifications: { type: Boolean, default: true },
      language: { type: String, default: "en" },
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  // Check if password is modified and valid
  if (!this.isModified("password") || typeof this.password !== "string") {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // Hash the new password
    next();
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
