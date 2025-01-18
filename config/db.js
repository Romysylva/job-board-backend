const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;

const connectDB = async () => {
  // console.log("MongoDB URI:", uri);

  try {
    const conn = await mongoose.connect(uri, {});
    console.log(`MongoDB Connected: ${conn.connection.host} 🌟⭐✨💫`);
    return conn;
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
