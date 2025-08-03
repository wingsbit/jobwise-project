// jobwise-backend/routes/advisorRoutes.js
import express from "express";

const router = express.Router();

/**
 * GET /api/advisor/suggest
 * Placeholder for AI career advice
 */
router.get("/suggest", (req, res) => {
  res.json({
    message: "AI Career Advisor placeholder",
    suggestions: [
      "Refine your LinkedIn profile for targeted job searches.",
      "Enhance your portfolio with measurable achievements.",
      "Research top companies in your industry for better targeting."
    ]
  });
});

export default router;
