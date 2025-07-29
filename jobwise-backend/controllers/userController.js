// controllers/userController.js
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = (req, res) => {
  res.json({
    message: 'Welcome to your profile',
    user: req.user,
  });
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // ✅ Safely update role only if valid
    const allowedRoles = ['seeker', 'employer'];
    if (req.body.role && allowedRoles.includes(req.body.role)) {
      user.role = req.body.role;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      message: 'Profile updated',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// @desc    Save a job to favorites
// @route   POST /api/users/save/:jobId
// @access  Private
exports.saveJob = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const jobId = req.params.jobId;
      if (!user.savedJobs.includes(jobId)) {
        user.savedJobs.push(jobId);
        await user.save();
      }
  
      res.json({ message: 'Job saved' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to save job', error: error.message });
    }
  };
  
  // @desc    Get saved jobs
  // @route   GET /api/users/saved
  // @access  Private
  exports.getSavedJobs = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate('savedJobs');
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.json(user.savedJobs);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get saved jobs', error: error.message });
    }
  };
  
  // @desc    Remove a saved job
  // @route   DELETE /api/users/saved/:jobId
  // @access  Private
  exports.removeSavedJob = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const jobId = req.params.jobId;
      user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
      await user.save();
  
      res.json({ message: 'Job removed from saved list' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove saved job', error: error.message });
    }
  };
  
