import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  getMe,
  updateUser,
  uploadAvatar
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Profile
router.get("/me", verifyToken, getMe);
router.put("/update-profile", verifyToken, updateUser); // ✅ match Profile.jsx exactly
router.post("/upload-avatar", verifyToken, upload.single("avatar"), uploadAvatar); // ✅ avatar upload

export default router;
