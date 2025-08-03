// jobwise-backend/middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📂 Created uploads directory:", uploadDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Unique file name: userId_timestamp.ext
    const ext = path.extname(file.originalname);
    cb(null, `${req.user?.id || "guest"}_${Date.now()}${ext}`);
  },
});

// Allowed image types
const allowedTypes = /jpeg|jpg|png|webp/;

// File type filter
const fileFilter = (req, file, cb) => {
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only .jpeg, .jpg, .png, and .webp formats are allowed"));
  }
};

// Multer upload instance
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter,
});

export default upload;
