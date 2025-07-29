const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply to a job
// @route   POST /api/applications
// @access  Private
exports.applyToJob = async (req, res) => {
  try {
    const { jobId, message } = req.body;

    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      message,
    });

    // Optionally push to job.applications (if added in model)
    const job = await Job.findById(jobId);
    if (job) {
      job.applications.push(application._id);
      await job.save();
    }

    res.status(201).json({
      message: 'Application submitted',
      application,
    });
  } catch (error) {
    res.status(500).json({ message: 'Application failed', error: error.message });
  }
};

// @desc    Get applications by logged-in user
// @route   GET /api/applications/my
// @access  Private
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location');

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
};

// @desc    Get applicants for employer's jobs
// @route   GET /api/applications/employer
// @access  Private (Employer only)
exports.getApplicationsForMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).select('_id');
    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('applicant', 'name email')
      .populate('job', 'title');

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job applications', error: error.message });
  }
};
