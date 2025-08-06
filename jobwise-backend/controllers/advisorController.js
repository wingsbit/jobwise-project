import User from "../models/User.js";

// Existing: Analyze & return advice
export const analyzeCareer = async (req, res, next) => {
  try {
    const { skills, goals } = req.body;

    if (!skills || !goals) {
      return res.status(400).json({ msg: "Skills and goals are required" });
    }

    const advice = `Based on your skills in ${Array.isArray(skills) ? skills.join(", ") : skills}
and your goals to ${goals}, we suggest applying to jobs that match these skills and improving in-demand areas.`;

    // Save to user roadmap
    await User.findByIdAndUpdate(req.user._id, { careerRoadmap: advice });

    res.status(200).json({ advice });
  } catch (error) {
    next(error);
  }
};

// ✅ Get user's saved roadmap
export const getCareerRoadmap = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("careerRoadmap");
    res.status(200).json({ roadmap: user?.careerRoadmap || "" });
  } catch (error) {
    next(error);
  }
};

// ✅ Save roadmap manually (used by AIAdvisor)
export const saveCareerRoadmap = async (req, res, next) => {
  try {
    const { advice } = req.body;
    await User.findByIdAndUpdate(req.user._id, { careerRoadmap: advice });
    res.status(200).json({ msg: "Roadmap saved successfully" });
  } catch (error) {
    next(error);
  }
};
