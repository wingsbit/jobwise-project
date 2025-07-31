import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  getProfile,
  updateProfile,
  saveJob,
  getSavedJobs,
  removeSavedJob,
} from "../controllers/userController.js";

const router = express.Router();

// ==========================
// Profile Routes
// ==========================
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// ==========================
// Avatar Upload
// ==========================
router.post(
  "/upload-avatar",
  protect,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
      }

      const user = req.user; // ✅ populated by protect middleware
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Save the uploaded avatar filename
      user.avatar = req.file.filename;
      await user.save();

      // ✅ Return updated user object
      res.json({
        msg: "Profile picture updated!",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// ==========================
// Saved Jobs
// ==========================
router.post("/save/:jobId", protect, saveJob);
router.get("/saved", protect, getSavedJobs);
router.delete("/saved/:jobId", protect, removeSavedJob);

export default router;
