// jobwise-backend/routes/authRoutes.js
import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  getMe
} from "../controllers/authController.js";
import { updateUser } from "../controllers/userController.js"; // ✅ Correct name
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Profile
router.get("/me", verifyToken, getMe);
router.put("/update-profile", verifyToken, updateUser); // ✅ Correct name

// Avatar upload
router.post(
  "/upload-avatar",
  verifyToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
      }

      // Return filename to frontend for saving in updateUser
      res.json({ filename: req.file.filename });
    } catch (error) {
      console.error("Avatar upload error:", error);
      res.status(500).json({ msg: "Server error uploading avatar" });
    }
  }
);

export default router;
