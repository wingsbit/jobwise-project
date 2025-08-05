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
  removeSavedJob,
  applyToJob,
  getJobApplicants,
  getMyApplications,
  updateApplicantStatus
} from "../controllers/jobController.js";

const router = express.Router();

// Recruiter routes
router.get("/my-jobs", verifyToken, checkRole(["recruiter"]), getMyJobs);
router.get("/:id/applicants", verifyToken, checkRole(["recruiter"]), getJobApplicants);
router.put("/:jobId/applicants/:applicantId/status", verifyToken, checkRole(["recruiter"]), updateApplicantStatus);

// Seeker routes
router.post("/apply/:id", verifyToken, checkRole(["seeker", "jobseeker"]), applyToJob);
router.get("/my-applications", verifyToken, checkRole(["seeker", "jobseeker"]), getMyApplications);
router.post("/save/:id", verifyToken, saveJob);
router.get("/saved", verifyToken, getSavedJobs);
router.delete("/saved/:id", verifyToken, removeSavedJob);

// Public routes
router.post("/", verifyToken, checkRole(["recruiter"]), createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.delete("/:id", verifyToken, checkRole(["recruiter"]), deleteJob);
router.put("/:id", verifyToken, checkRole(["recruiter"]), updateJob);

export default router;
