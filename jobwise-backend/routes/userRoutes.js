const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  saveJob,
  getSavedJobs,
  removeSavedJob,
} = require('../controllers/userController');

// Profile
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Saved Jobs
router.post('/save/:jobId', protect, saveJob);
router.get('/saved', protect, getSavedJobs);
router.delete('/saved/:jobId', protect, removeSavedJob);

module.exports = router;
