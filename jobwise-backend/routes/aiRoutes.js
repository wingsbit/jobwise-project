// routes/aiRoutes.js

const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { matchJobs } = require('../controllers/aiController');

router.post('/match', protect, matchJobs);

module.exports = router;
