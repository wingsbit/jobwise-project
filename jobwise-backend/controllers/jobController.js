import Job from "../models/Job.js";
import User from "../models/User.js";

/**
 * @desc Create a new job (Recruiter only)
 */
export const createJob = async (req, res, next) => {
  try {
    const { title, description, location, salary, skills } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ msg: "Title, description, and location are required" });
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
 * @desc Get recommended jobs for logged-in seeker
 */
export const getRecommendedJobs = async (req, res, next) => {
  try {
    // ✅ Only for seekers
    if (!["seeker", "jobseeker"].includes(req.user.role)) {
      return res.status(403).json({ msg: "Only job seekers can get recommendations" });
    }

    const user = await User.findById(req.user._id);

    // 1️⃣ Determine skill source (query param → roadmap → profile skills)
    let skillsToSearch = [];

    if (req.query.skills) {
      // From query param (Dashboard roadmap extraction)
      skillsToSearch = req.query.skills.split(",").map(s => s.trim());
    } else if (user.careerRoadmap) {
      // Extract keywords from roadmap text
      skillsToSearch = extractSkillsFromRoadmap(user.careerRoadmap);
    } else if (user.skills && user.skills.length > 0) {
      skillsToSearch = user.skills;
    }

    // 2️⃣ No skills found → return missingSkills
    if (!skillsToSearch || skillsToSearch.length === 0) {
      return res.status(200).json({
        missingSkills: true,
        jobs: [],
      });
    }

    // 3️⃣ Build regex for case-insensitive skill match
    const skillRegexes = skillsToSearch.map(skill => new RegExp(skill.trim(), "i"));

    // 4️⃣ Find matching jobs
    let jobs = await Job.find({
      skills: { $in: skillRegexes }
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("createdBy", "name email");

    // 5️⃣ Fallback: no matches → latest jobs
    if (!jobs.length) {
      jobs = await Job.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("createdBy", "name email");
    }

    return res.status(200).json({
      missingSkills: false,
      jobs,
    });

  } catch (error) {
    console.error("Error in getRecommendedJobs:", error);
    next(error);
  }
};

/**
 * 🔹 Extracts simple skill keywords from a roadmap text
 */
const extractSkillsFromRoadmap = (roadmapText) => {
  if (!roadmapText) return [];
  return roadmapText
    .split(/\s|,|\.|\n/) // split on spaces, commas, dots, and newlines
    .filter(word => /^[a-zA-Z]+$/.test(word)) // keep only alphabetic words
    .map(word => word.toLowerCase())
    .filter((w, i, arr) => arr.indexOf(w) === i) // unique
    .slice(0, 6); // limit to top 6
};

/**
 * @desc Get single job by ID (public)
 */
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("createdBy", "name email");
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
    const jobs = await Job.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

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
 * @desc Apply to a job (Seeker only)
 */
export const applyToJob = async (req, res, next) => {
  try {
    if (!["seeker", "jobseeker"].includes(req.user.role)) {
      return res.status(403).json({ msg: "Only job seekers can apply to jobs" });
    }

    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    const user = await User.findById(req.user._id);
    const alreadyApplied = user.appliedJobs.some((a) => a.job.toString() === jobId);

    if (!alreadyApplied) {
      user.appliedJobs.push({
        job: jobId,
        appliedAt: new Date(),
        status: "Pending",
      });
      await user.save();
    }

    res.status(200).json({ msg: "Application submitted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get jobs applied by logged-in seeker
 */
export const getMyApplications = async (req, res, next) => {
  try {
    if (!["seeker", "jobseeker"].includes(req.user.role)) {
      return res.status(403).json({ msg: "Only job seekers can view applications" });
    }

    const user = await User.findById(req.user._id).populate({
      path: "appliedJobs.job",
      populate: { path: "createdBy", select: "name email" },
    });

    if (!user || !user.appliedJobs) {
      return res.status(200).json([]);
    }

    const applications = user.appliedJobs.map((app) => ({
      ...app.job.toObject(),
      appliedAt: app.appliedAt || null,
      status: app.status || "Pending",
    }));

    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get applicants for a job (Recruiter only)
 */
export const getJobApplicants = async (req, res, next) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const applicants = await User.find({ "appliedJobs.job": jobId }).select(
      "name email avatar resume appliedJobs"
    );

    const formattedApplicants = applicants.map((applicant) => {
      const applicationData = applicant.appliedJobs.find(
        (a) => a.job.toString() === jobId
      );
      return {
        _id: applicant._id,
        name: applicant.name,
        email: applicant.email,
        avatar: applicant.avatar,
        resume: applicant.resume,
        appliedAt: applicationData?.appliedAt || null,
        status: applicationData?.status || "Pending",
      };
    });

    res.status(200).json(formattedApplicants);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update applicant status (Recruiter only)
 */
export const updateApplicantStatus = async (req, res, next) => {
  try {
    const { jobId, applicantId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Shortlisted", "Rejected", "Hired"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized to update this applicant" });
    }

    const user = await User.findById(applicantId);
    if (!user) return res.status(404).json({ msg: "Applicant not found" });

    const application = user.appliedJobs.find((a) => a.job.toString() === jobId);
    if (!application) {
      return res.status(404).json({ msg: "Application not found" });
    }

    application.status = status;
    await user.save();

    res.status(200).json({ msg: "Status updated successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Save a job (Seeker only)
 */
export const saveJob = async (req, res, next) => {
  try {
    if (req.user.role !== "seeker") {
      return res.status(403).json({ msg: "Only job seekers can save jobs" });
    }

    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    const user = await User.findById(req.user._id);

    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }

    res.status(200).json({ msg: "Job saved successfully", savedJobs: user.savedJobs });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get saved jobs (Seeker only)
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
 * @desc Remove saved job (Seeker only)
 */
export const removeSavedJob = async (req, res, next) => {
  try {
    if (req.user.role !== "seeker") {
      return res.status(403).json({ msg: "Only job seekers can remove saved jobs" });
    }

    const user = await User.findById(req.user._id);

    if (!user.savedJobs.includes(req.params.id)) {
      return res.status(404).json({ msg: "Job not found in saved list" });
    }

    user.savedJobs = user.savedJobs.filter(
      (savedId) => savedId.toString() !== req.params.id
    );
    await user.save();

    res.status(200).json({ msg: "Job removed from saved list", savedJobs: user.savedJobs });
  } catch (error) {
    next(error);
  }
};
