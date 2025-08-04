// routes/authRoutes.js
import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/me", verifyToken, getMe);

export default router;
