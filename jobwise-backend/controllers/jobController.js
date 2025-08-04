import Job from "../models/Job.js";

// @desc Create a new job (Recruiter only)
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

// @desc Get all jobs (public)
export const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name email");
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

// @desc Get single job by ID (public)
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

// @desc Delete a job (Recruiter only)
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

// @desc Get jobs posted by logged-in recruiter
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

// @desc Update a job (Recruiter only)
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
