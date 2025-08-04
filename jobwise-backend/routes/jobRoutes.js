import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import {
  createJob,
  getJobs,
  getJobById,
  deleteJob,
  getMyJobs,
  updateJob,
  saveJob,
  getSavedJobs,
  removeSavedJob
} from "../controllers/jobController.js";

const router = express.Router();

// Recruiter create job
router.post("/", verifyToken, checkRole(["recruiter"]), createJob);

// Public - Get all jobs
router.get("/", getJobs);

// Authenticated - Save a job
router.post("/save/:id", verifyToken, saveJob);

// Authenticated - Get saved jobs
router.get("/saved", verifyToken, getSavedJobs);

// Authenticated - Remove a saved job
router.delete("/saved/:id", verifyToken, removeSavedJob);

// Public - Get single job
router.get("/:id", getJobById);

// Recruiter delete job
router.delete("/:id", verifyToken, checkRole(["recruiter"]), deleteJob);

// Recruiter my jobs
router.get("/mine", verifyToken, checkRole(["recruiter"]), getMyJobs);

// Recruiter update job
router.put("/:id", verifyToken, checkRole(["recruiter"]), updateJob);

export default router;
