import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import {
  applyForJob,
  getMyApplications,
  getApplicantsForJob,
} from "../controllers/applicationController.js";

const router = express.Router();

// Seeker routes
router.post("/", verifyToken, checkRole(["seeker"]), applyForJob);
router.get("/mine", verifyToken, checkRole(["seeker"]), getMyApplications);

// Recruiter route - view applicants for a specific job
router.get("/job/:id", verifyToken, checkRole(["recruiter"]), getApplicantsForJob);

export default router;
