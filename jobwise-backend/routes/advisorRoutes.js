// routes/advisorRoutes.js
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { analyzeCareer } from "../controllers/advisorController.js";

const router = express.Router();

router.post("/analyze", verifyToken, analyzeCareer);

export default router;
