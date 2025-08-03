// jobwise-backend/routes/userRoutes.js
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  updateUser,
  saveJob,
  getSavedJobs,
  removeSavedJob
} from "../controllers/userController.js";

const router = express.Router();

// ==========================
// Update Profile (name, password, avatar filename)
// ==========================
router.put("/update-profile", verifyToken, updateUser);

// ==========================
// Avatar Upload
// ==========================
router.post(
  "/upload-avatar",
  verifyToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
      }

      const user = req.user;
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Save avatar filename in user model
      user.avatar = req.file.filename;
      await user.save();

      res.json({
        msg: "Profile picture updated successfully!",
        avatar: user.avatar
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
router.post("/save/:jobId", verifyToken, saveJob);
router.get("/saved", verifyToken, getSavedJobs);
router.delete("/saved/:jobId", verifyToken, removeSavedJob);

export default router;
