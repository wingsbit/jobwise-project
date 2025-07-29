// routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  applyToJob,
  getMyApplications,
  getApplicationsForMyJobs,
} = require('../controllers/applicationController');

// @route   POST /api/applications
// @desc    Apply to a job
// @access  Private
router.post('/', protect, applyToJob);

// @route   GET /api/applications/my
// @desc    Get user's applications
// @access  Private
router.get('/my', protect, getMyApplications);

// @route   GET /api/applications/employer
// @desc    Get applications for employer's jobs
// @access  Private (Employer)
router.get('/employer', protect, getApplicationsForMyJobs);

module.exports = router;
