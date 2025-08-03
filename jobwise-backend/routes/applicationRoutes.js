// jobwise-backend/routes/applicationRoutes.js
import express from "express";

const router = express.Router();

/**
 * GET /api/applications/test
 * Placeholder applications route
 */
router.get("/test", (req, res) => {
  res.json({
    message: "Applications route is working!",
    examples: [
      "GET /api/applications/test → This message",
      "Later: POST /api/applications to create an application",
      "Later: GET /api/applications to list user applications"
    ]
  });
});

export default router;
