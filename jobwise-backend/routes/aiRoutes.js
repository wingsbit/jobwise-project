// jobwise-backend/routes/aiRoutes.js
import express from "express";

const router = express.Router();

/**
 * GET /api/ai/test
 * Simple AI route placeholder
 */
router.get("/test", (req, res) => {
  res.json({
    message: "AI route is working!",
    nextSteps: [
      "Integrate OpenAI, Claude, or other LLMs here.",
      "Add endpoints for CV analysis.",
      "Add endpoints for AI-powered job recommendations."
    ]
  });
});

export default router;
