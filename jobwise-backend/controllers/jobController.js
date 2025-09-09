import mongoose from "mongoose"
import Job from "../models/Job.js"
import User from "../models/User.js"

/* ----------------------------- helpers ---------------------------------- */
const toBool = (v) => (v === "true" ? true : v === "false" ? false : undefined)
const toNum = (v) => (v !== undefined && v !== null && v !== "" && !isNaN(+v) ? +v : undefined)

/**
 * Build the Mongo query from req.query.
 * If useText=true, use {$text}; otherwise fallback to regex ORs.
 * Compatible with your current schema.
 */
function buildQuery(qs, useText) {
  const {
    q,
    location,
    remote,        // if you add to schema later, this will still work
    type,          // same here
    minSalary,
    maxSalary,
    isActive,
    createdBy,
  } = qs

  const query = {}

  // search
  if (q && q.trim()) {
    const needle = q.trim()
    if (useText) {
      query.$text = { $search: needle }
    } else {
      query.$or = [
        { title: { $regex: needle, $options: "i" } },
        { description: { $regex: needle, $options: "i" } },
        { location: { $regex: needle, $options: "i" } },
        { skills: { $regex: needle, $options: "i" } },
      ]
    }
  }

  if (location) query.location = { $regex: location.trim(), $options: "i" }

  const remoteBool = toBool(remote)
  if (remoteBool !== undefined) query.remote = remoteBool

  if (type) {
    const list = type.split(",").map((s) => s.trim()).filter(Boolean)
    if (list.length) query.type = { $in: list }
  }

  // salary window overlap (supports legacy single salary or future min/max)
  const sMin = toNum(minSalary)
  const sMax = toNum(maxSalary)
  if (sMin != null || sMax != null) {
    query.$and = query.$and || []
    if (sMin != null) query.$and.push({ $or: [{ maxSalary: { $gte: sMin } }, { salary: { $gte: sMin } }] })
    if (sMax != null) query.$and.push({ $or: [{ minSalary: { $lte: sMax } }, { salary: { $lte: sMax } }] })
  }

  const activeBool = toBool(isActive)
  if (activeBool !== undefined) query.isActive = activeBool
  else query.isActive = true

  if (createdBy && mongoose.isValidObjectId(createdBy)) {
    query.createdBy = new mongoose.Types.ObjectId(createdBy)
  }

  return query
}

function parsePageSort(qs) {
  const page = Math.max(1, parseInt(qs.page || "1", 10))
  const limit = Math.min(50, Math.max(1, parseInt(qs.limit || "12", 10)))
  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    salary_asc: { minSalary: 1, maxSalary: 1, salary: 1 },
    salary_desc: { maxSalary: -1, minSalary: -1, salary: -1 },
  }
  const sort = sortMap[qs.sort] || sortMap.newest
  return { page, limit, sort }
}

/* ----------------------------- create ----------------------------------- */
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      salary, // legacy single salary
      skills,
      tags,
      remote,
      type,
      minSalary,
      maxSalary,
      isActive,
    } = req.body

    if (!title || !description || !location) {
      return res.status(400).json({ msg: "Title, description, and location are required" })
    }

    const doc = {
      title,
      description,
      location,
      salary: toNum(salary) ?? undefined,
      skills: Array.isArray(skills) ? skills : skills ? String(skills).split(",").map(s => s.trim()) : [],
      tags: Array.isArray(tags) ? tags : tags ? String(tags).split(",").map(s => s.trim()) : [],
      remote: toBool(remote),
      type,
      minSalary: toNum(minSalary),
      maxSalary: toNum(maxSalary),
      isActive: isActive === undefined ? true : toBool(isActive),
      createdBy: req.user._id,
    }

    const job = await Job.create(doc)
    res.status(201).json({ msg: "Job created successfully", job })
  } catch (error) {
    next(error)
  }
}

/* ----------------------------- list (text first, regex fallback) -------- */
export const getJobs = async (req, res, next) => {
  try {
    const { page, limit, sort } = parsePageSort(req.query)
    const skip = (page - 1) * limit
    const hasQ = !!(req.query.q && req.query.q.trim())

    let useText = hasQ
    let query = buildQuery(req.query, useText)

    let items = []
    let total = 0

    const runQuery = async () => {
      const [list, cnt] = await Promise.all([
        Job.find(query)
          .populate("createdBy", "name email")
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        Job.countDocuments(query),
      ])
      return { list, cnt }
    }

    try {
      const res1 = await runQuery()
      items = res1.list
      total = res1.cnt
    } catch (err) {
      // missing text index -> fallback to regex
      if (String(err?.message || "").toLowerCase().includes("text index")) {
        useText = false
      } else {
        throw err
      }
    }

    if (!items.length && hasQ && useText === false) {
      query = buildQuery(req.query, false)
      const res2 = await runQuery()
      items = res2.list
      total = res2.cnt
    }

    res.status(200).json({
      data: items,
      page,
      pageSize: items.length,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    })
  } catch (error) {
    next(error)
  }
}

/* ----------------------------- recommendations -------------------------- */
export const getRecommendedJobs = async (req, res, next) => {
  try {
    if (!["seeker", "jobseeker"].includes(req.user.role)) {
      return res.status(403).json({ msg: "Only job seekers can get recommendations" })
    }

    const user = await User.findById(req.user._id)

    let skillsToSearch = []
    if (req.query.skills) {
      skillsToSearch = req.query.skills.split(",").map((s) => s.trim())
    } else if (user?.careerRoadmap) {
      skillsToSearch = extractSkillsFromRoadmap(user.careerRoadmap)
    } else if (user?.skills?.length) {
      skillsToSearch = user.skills
    }

    if (!skillsToSearch.length) {
      return res.status(200).json({ missingSkills: true, jobs: [] })
    }

    const skillRegexes = skillsToSearch.map((s) => new RegExp(String(s).trim(), "i"))

    let jobs = await Job.find({ skills: { $in: skillRegexes }, isActive: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("createdBy", "name email")

    if (!jobs.length) {
      jobs = await Job.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("createdBy", "name email")
    }

    return res.status(200).json({ missingSkills: false, jobs })
  } catch (error) {
    console.error("Error in getRecommendedJobs:", error)
    next(error)
  }
}

const extractSkillsFromRoadmap = (roadmapText) => {
  if (!roadmapText) return []
  return roadmapText
    .split(/\s|,|\.|\n/)
    .filter((word) => /^[a-zA-Z]+$/.test(word))
    .map((word) => word.toLowerCase())
    .filter((w, i, arr) => arr.indexOf(w) === i)
    .slice(0, 6)
}

/* ----------------------------- single ----------------------------------- */
export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ msg: "Invalid job id" })

    const job = await Job.findById(id).populate("createdBy", "name email").lean()
    if (!job) return res.status(404).json({ msg: "Job not found" })
    res.status(200).json(job)
  } catch (error) {
    next(error)
  }
}

/* ----------------------------- delete / mine / update ------------------- */
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) return res.status(404).json({ msg: "Job not found" })
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" })
    }
    await job.deleteOne()
    res.status(200).json({ msg: "Job deleted successfully" })
  } catch (error) {
    next(error)
  }
}

export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email")
    res.status(200).json(jobs)
  } catch (error) {
    next(error)
  }
}

export const updateJob = async (req, res, next) => {
  try {
    const { title, description, location, salary, skills, tags, remote, type, minSalary, maxSalary, isActive } =
      req.body
    const job = await Job.findById(req.params.id)
    if (!job) return res.status(404).json({ msg: "Job not found" })
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" })
    }

    if (title) job.title = title
    if (description) job.description = description
    if (location) job.location = location
    if (salary !== undefined) job.salary = toNum(salary)
    if (skills) job.skills = Array.isArray(skills) ? skills : String(skills).split(",").map(s => s.trim())
    if (tags) job.tags = Array.isArray(tags) ? tags : String(tags).split(",").map(s => s.trim())
    if (remote !== undefined) job.remote = toBool(remote)
    if (type) job.type = type
    if (minSalary !== undefined) job.minSalary = toNum(minSalary)
    if (maxSalary !== undefined) job.maxSalary = toNum(maxSalary)
    if (isActive !== undefined) job.isActive = toBool(isActive)

    await job.save()
    res.status(200).json({ msg: "Job updated successfully", job })
  } catch (error) {
    next(error)
  }
}

/* ----------------------------- apply / applications --------------------- */
export const applyToJob = async (req, res, next) => {
  try {
    if (!["seeker", "jobseeker"].includes(req.user.role)) {
      return res.status(403).json({ msg: "Only job seekers can apply to jobs" })
    }

    const jobId = req.params.id
    const job = await Job.findById(jobId)
    if (!job) return res.status(404).json({ msg: "Job not found" })

    const user = await User.findById(req.user._id)
    const alreadyApplied = user.appliedJobs?.some((a) => a.job.toString() === jobId)

    if (!alreadyApplied) {
      user.appliedJobs = user.appliedJobs || []
      user.appliedJobs.push({ job: jobId, appliedAt: new Date(), status: "Pending" })
      await user.save()
    }

    res.status(200).json({ msg: "Application submitted successfully" })
  } catch (error) {
    next(error)
  }
}

export const getMyApplications = async (req, res, next) => {
  try {
    if (!["seeker", "jobseeker"].includes(req.user.role)) {
      return res.status(403).json({ msg: "Only job seekers can view applications" })
    }

    const user = await User.findById(req.user._id).populate({
      path: "appliedJobs.job",
      populate: { path: "createdBy", select: "name email" },
    })

    if (!user || !user.appliedJobs) return res.status(200).json([])

    const applications = user.appliedJobs
      .filter((app) => app.job)
      .map((app) => ({
        ...app.job.toObject(),
        appliedAt: app.appliedAt || null,
        status: app.status || "Pending",
      }))

    res.status(200).json(applications)
  } catch (error) {
    next(error)
  }
}

/* ----------------------------- applicants / status ---------------------- */
export const getJobApplicants = async (req, res, next) => {
  try {
    const jobId = req.params.id

    const job = await Job.findById(jobId)
    if (!job) return res.status(404).json({ msg: "Job not found" })
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" })
    }

    const applicants = await User.find({ "appliedJobs.job": jobId }).select(
      "name email avatar resume appliedJobs"
    )

    const formatted = applicants.map((applicant) => {
      const applicationData = applicant.appliedJobs.find((a) => a.job.toString() === jobId)
      return {
        _id: applicant._id,
        name: applicant.name,
        email: applicant.email,
        avatar: applicant.avatar,
        resume: applicant.resume,
        appliedAt: applicationData?.appliedAt || null,
        status: applicationData?.status || "Pending",
      }
    })

    res.status(200).json(formatted)
  } catch (error) {
    next(error)
  }
}

export const updateApplicantStatus = async (req, res, next) => {
  try {
    const { jobId, applicantId } = req.params
    const { status } = req.body

    const allowed = ["Pending", "Shortlisted", "Rejected", "Hired"]
    if (!allowed.includes(status)) return res.status(400).json({ msg: "Invalid status" })

    const job = await Job.findById(jobId)
    if (!job) return res.status(404).json({ msg: "Job not found" })
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized to update this applicant" })
    }

    const user = await User.findById(applicantId)
    if (!user) return res.status(404).json({ msg: "Applicant not found" })

    const application = user.appliedJobs?.find((a) => a.job.toString() === jobId)
    if (!application) return res.status(404).json({ msg: "Application not found" })

    application.status = status
    await user.save()

    res.status(200).json({ msg: "Status updated successfully" })
  } catch (error) {
    next(error)
  }
}

/* ----------------------------- saved jobs ------------------------------- */
export const saveJob = async (req, res, next) => {
  try {
    if (req.user.role !== "seeker") {
      return res.status(403).json({ msg: "Only job seekers can save jobs" })
    }

    const jobId = req.params.id
    const job = await Job.findById(jobId)
    if (!job) return res.status(404).json({ msg: "Job not found" })

    const user = await User.findById(req.user._id)
    user.savedJobs = user.savedJobs || []
    if (!user.savedJobs.map(String).includes(String(jobId))) {
      user.savedJobs.push(jobId)
      await user.save()
    }

    res.status(200).json({ msg: "Job saved successfully", savedJobs: user.savedJobs })
  } catch (error) {
    next(error)
  }
}

export const getSavedJobs = async (req, res, next) => {
  try {
    if (req.user.role !== "seeker") {
      return res.status(403).json({ msg: "Only job seekers can view saved jobs" })
    }

    const user = await User.findById(req.user._id).populate({
      path: "savedJobs",
      populate: { path: "createdBy", select: "name email" },
    })
    res.status(200).json(user?.savedJobs || [])
  } catch (error) {
    next(error)
  }
}

export const removeSavedJob = async (req, res, next) => {
  try {
    if (req.user.role !== "seeker") {
      return res.status(403).json({ msg: "Only job seekers can remove saved jobs" })
    }

    const user = await User.findById(req.user._id)
    if (!user.savedJobs?.map(String).includes(String(req.params.id))) {
      return res.status(404).json({ msg: "Job not found in saved list" })
    }

    user.savedJobs = user.savedJobs.filter((id) => String(id) !== String(req.params.id))
    await user.save()

    res.status(200).json({ msg: "Job removed from saved list", savedJobs: user.savedJobs })
  } catch (error) {
    next(error)
  }
}
