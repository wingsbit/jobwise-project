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
  updateApplicantStatus,
  getRecommendedJobs,
} from "../controllers/jobController.js";

const router = express.Router();

// Helpers
const auth = (roles) => [verifyToken, checkRole(roles)];

// Recruiter
router.get("/my-jobs", ...auth(["recruiter"]), getMyJobs);
router.get("/:id/applicants", ...auth(["recruiter"]), getJobApplicants);
router.patch("/:jobId/applicants/:applicantId/status", ...auth(["recruiter"]), updateApplicantStatus);

// Seeker
router.get("/recommended", ...auth(["seeker", "jobseeker"]), getRecommendedJobs);
router.post("/apply/:id", ...auth(["seeker", "jobseeker"]), applyToJob);
router.get("/my-applications", ...auth(["seeker", "jobseeker"]), getMyApplications);
router.post("/save/:id", verifyToken, saveJob);
router.get("/saved", verifyToken, getSavedJobs);
router.delete("/saved/:id", verifyToken, removeSavedJob);

// Public / CRUD
router.post("/", ...auth(["recruiter"]), createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.delete("/:id", ...auth(["recruiter"]), deleteJob);
router.patch("/:id", ...auth(["recruiter"]), updateJob);

export default router;
