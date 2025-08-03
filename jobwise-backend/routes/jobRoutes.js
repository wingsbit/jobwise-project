// jobwise-backend/routes/jobRoutes.js
import express from "express";

const router = express.Router();

/**
 * GET /api/jobs/test
 * Example job route
 */
router.get("/test", (req, res) => {
  res.json({
    message: "Jobs route is working!",
    examples: [
      "Later: GET /api/jobs to list all jobs",
      "Later: POST /api/jobs to create a new job post"
    ]
  });
});

export default router;
