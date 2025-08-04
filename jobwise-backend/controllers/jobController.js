import Job from "../models/Job.js";
import User from "../models/User.js";

/**
 * @desc Create a new job (Recruiter only)
 */
export const createJob = async (req, res, next) => {
  try {
    const { title, description, location, salary, skills } = req.body;

    if (!title || !description || !location) {
      return res
        .status(400)
        .json({ msg: "Title, description, and location are required" });
    }

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      skills,
      createdBy: req.user._id,
    });

    res.status(201).json({ msg: "Job created successfully", job });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all jobs (public)
 */
export const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name email");
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single job by ID (public)
 */
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!job) return res.status(404).json({ msg: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete a job (Recruiter only)
 */
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await job.deleteOne();
    res.status(200).json({ msg: "Job deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get jobs posted by logged-in recruiter
 */
export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update a job (Recruiter only)
 */
export const updateJob = async (req, res, next) => {
  try {
    const { title, description, location, salary, skills } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ msg: "Job not found" });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    job.title = title || job.title;
    job.description = description || job.description;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.skills = skills?.length ? skills : job.skills;

    await job.save();
    res.status(200).json({ msg: "Job updated successfully", job });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Save a job for logged-in user (Job Seeker only)
 */
export const saveJob = async (req, res, next) => {
  try {
    if (req.user.role !== "seeker") {
      return res.status(403).json({ msg: "Only job seekers can save jobs" });
    }

    const userId = req.user._id;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    const user = await User.findById(userId);

    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }

    res.status(200).json({
      msg: "Job saved successfully",
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all saved jobs for logged-in user (Job Seeker only)
 */
export const getSavedJobs = async (req, res, next) => {
  try {
    if (req.user.role !== "seeker") {
      return res.status(403).json({ msg: "Only job seekers can view saved jobs" });
    }

    const user = await User.findById(req.user._id).populate("savedJobs");
    res.status(200).json(user.savedJobs);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Remove a saved job for logged-in user (Job Seeker only)
 */
export const removeSavedJob = async (req, res, next) => {
  try {
    if (req.user.role !== "seeker") {
      return res.status(403).json({ msg: "Only job seekers can remove saved jobs" });
    }

    const userId = req.user._id;
    const jobId = req.params.id;

    const user = await User.findById(userId);

    if (!user.savedJobs.includes(jobId)) {
      return res.status(404).json({ msg: "Job not found in saved list" });
    }

    user.savedJobs = user.savedJobs.filter(
      (savedId) => savedId.toString() !== jobId
    );
    await user.save();

    res.status(200).json({
      msg: "Job removed from saved list",
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    next(error);
  }
};
