// routes/aiRoutes.js

const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { matchJobs } = require('../controllers/aiController');
const { getMe } = require("../controllers/authController");

router.post('/match', protect, matchJobs);
router.get("/me", getMe);

module.exports = router;
