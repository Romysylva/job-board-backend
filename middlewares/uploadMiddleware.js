// const multer = require("multer");

// const path = require("path");

// // Storage settings
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/profileImages/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// // file filter

// const fileFilter = (req, res, cb) => {
//   const fileType = /jpeg|png|gif|jpg/;
//   const extname = fileType.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = fileType.test(file.mimetype);
//   if (mimetype && extname) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error("Invalid file type, only JPEG, PNG, GIF, and JPG are allowed"),
//       false
//     );
//   }
// };

// const upload = multer({ storage, fileFilter });
// module.exports = { upload };

const multer = require("multer");
const path = require("path");

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/; // Allow only specific file types
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg, and .jpeg format allowed!"));
    }
  },
});

module.exports = { upload }; // Correctly export upload
