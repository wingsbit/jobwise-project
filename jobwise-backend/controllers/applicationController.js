import Application from "../models/Application.js";
import Job from "../models/Job.js";

// @desc Apply for a job (Seeker)
export const applyForJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    const existingApp = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });
    if (existingApp)
      return res.status(400).json({ msg: "You already applied for this job" });

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
    });

    res.status(201).json({ msg: "Application submitted", application });
  } catch (error) {
    next(error);
  }
};

// @desc Get applications for logged in seeker
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title location")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc Get all applicants for a job (Recruiter)
export const getApplicantsForJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;

    // Check if job exists and belongs to this recruiter
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: "Job not found" });
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized to view applicants for this job" });
    }

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};
