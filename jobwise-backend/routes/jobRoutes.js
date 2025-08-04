import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import {
  createJob,
  getJobs,
  getJobById,
  deleteJob,
  getMyJobs,
  updateJob
} from "../controllers/jobController.js";

const router = express.Router();

router.post("/", verifyToken, checkRole(["recruiter"]), createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.delete("/:id", verifyToken, checkRole(["recruiter"]), deleteJob);
router.get("/mine", verifyToken, checkRole(["recruiter"]), getMyJobs);
router.put("/:id", verifyToken, checkRole(["recruiter"]), updateJob);

export default router;
