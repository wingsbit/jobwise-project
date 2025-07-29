const Job = require('../models/Job');

// @desc    Create a new job
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, description } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      description,
      postedBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create job', error: error.message });
  }
};

// @desc    Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email');
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get jobs', error: error.message });
  }
};
