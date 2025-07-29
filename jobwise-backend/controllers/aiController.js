// controllers/aiController.js

const Job = require('../models/Job');

// @desc    Match jobs based on user preferences
// @route   POST /api/ai/match
// @access  Private
exports.matchJobs = async (req, res) => {
  try {
    const { skills, location, preferences } = req.body;

    // For MVP: simple matching by keyword & location
    const jobs = await Job.find({
      location: { $regex: location, $options: 'i' },
      $or: [
        { title: { $regex: skills.join('|'), $options: 'i' } },
        { description: { $regex: skills.join('|'), $options: 'i' } },
      ],
    });

    // Simple scoring by matched skill count
    const scoredJobs = jobs.map(job => {
      const score = skills.reduce((acc, skill) => {
        return acc + (job.description.toLowerCase().includes(skill.toLowerCase()) ? 1 : 0);
      }, 0);
      return { job, score };
    }).sort((a, b) => b.score - a.score);

    res.status(200).json({
      matches: scoredJobs.map(entry => ({
        job: entry.job,
        matchScore: entry.score,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'AI matching failed', error: error.message });
  }
};
