const mongoose = require("mongoose");

// const CommentSchema = new mongoose.Schema(
//   // {
//   //   content: {
//   //     type: String,
//   //     required: true,
//   //   },
//   //   job: {
//   //     type: mongoose.Schema.Types.ObjectId,
//   //     ref: "Job",
//   //     required: true,
//   //   },
//   //   user: {
//   //     type: mongoose.Schema.Types.ObjectId,
//   //     ref: "User",
//   //     required: true,
//   //   },
//   // },
//   // { timestamps: true }
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     comment: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//   },
//   { _id: false }
// );
const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
