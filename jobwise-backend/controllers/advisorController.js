// controllers/advisorController.js
export const analyzeCareer = async (req, res, next) => {
  try {
    const { skills, goals } = req.body;

    if (!skills || !goals) {
      return res.status(400).json({ msg: "Skills and goals are required" });
    }

    // Placeholder logic — AI integration will replace this
    const advice = `Based on your skills in ${skills.join(", ")} and your goals to ${goals}, 
    we suggest applying to jobs that match these skills and improving in-demand areas.`;

    res.status(200).json({ advice });
  } catch (error) {
    next(error);
  }
};
