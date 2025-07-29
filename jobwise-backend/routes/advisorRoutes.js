// routes/advisorRoutes.js

const express = require('express');
const router = express.Router();
const { analyzeQuiz } = require('../controllers/advisorController');

// Public or protected – your call (for MVP, leave open)
router.post('/analyze', analyzeQuiz);

module.exports = router;
