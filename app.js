const path = require("path");

const events = require("events");
events.EventEmitter.defaultMaxListeners = 20;

const dotenv = require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");

// dotenv.config();

connectDB();

const app = express();

app.use(express.json());

// app.use(
//   cors({
// origin: "http://localhost:3000",
//   })
// );

app.use(
  cors({
    origin: "http://localhost:3000",

    // origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

app.use(cookieParser());

app.use(compression());
app.use(helmet());

// app.use("/uploads", express.static("uploads"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// const normalizedLogoPath = company?.log ? company.logo.replace(/\\/g, "/") : "";
// res.json({ logo: normalizedLogoPath });

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const companyRoutes = require("./routes/companyRoutes");
const commentRoutes = require("./routes/commentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const likeRoutes = require("./routes/likeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const userRoutes = require("./routes/userRoutes");
const featuredJobsRoutes = require("./routes/featurejobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/featured-jobs", featuredJobsRoutes);
app.use("/api/applications", applicationRoutes);

// const corsOptions = {
//   origin: "http://localhost:3000", // Only allow this origin
//   methods: "GET,POST", // Allow only specific HTTP methods
//   credentials: true, // Allow cookies to be sent with requests
// };

// app.use(cors());

app.get("/", (req, res) => {
  res.send("API is running...⭐✳✳✴❇🌟💫");
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sever is running on port ${PORT}🚦🚦🚦🌟✨💫`);
});
