import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  analyzeCareer,
  getCareerRoadmap,
  saveCareerRoadmap,
} from "../controllers/advisorController.js";

const router = express.Router();

router.post("/analyze", verifyToken, analyzeCareer);
router.get("/roadmap", verifyToken, getCareerRoadmap); // ✅ Fetch saved roadmap
router.post("/roadmap", verifyToken, saveCareerRoadmap); // ✅ Save new roadmap

export default router;
