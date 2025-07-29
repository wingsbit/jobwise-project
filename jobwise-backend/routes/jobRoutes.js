const express = require('express');
const router = express.Router();
const { createJob, getAllJobs } = require('../controllers/jobController');
const protect = require('../middleware/authMiddleware');

// Public: Get jobs
router.get('/', getAllJobs);

// Protected: Post job
router.post('/', protect, createJob);

module.exports = router;
