// controllers/advisorController.js

// @desc    Process quiz answers and return career insight
// @route   POST /api/advisor/analyze
// @access  Public or Private (you decide)
exports.analyzeQuiz = async (req, res) => {
    try {
      const answers = req.body.answers;
  
      if (!answers || answers.length !== 8) {
        return res.status(400).json({ message: 'Please answer all 8 questions.' });
      }
  
      // Dummy scoring system for MVP
      const result = {
        personalityType: '',
        suggestedRoles: [],
        motivators: [],
      };
  
      const score = answers.reduce((acc, val) => acc + Number(val), 0);
  
      if (score <= 16) {
        result.personalityType = 'Strategic Thinker';
        result.suggestedRoles = ['Product Manager', 'Data Analyst'];
        result.motivators = ['Autonomy', 'Big-picture planning'];
      } else if (score <= 24) {
        result.personalityType = 'Collaborative Innovator';
        result.suggestedRoles = ['UI/UX Designer', 'Marketing Lead'];
        result.motivators = ['Teamwork', 'Creative Freedom'];
      } else {
        result.personalityType = 'Tech Explorer';
        result.suggestedRoles = ['Software Engineer', 'AI Developer'];
        result.motivators = ['Problem solving', 'Learning new tools'];
      }
  
      res.status(200).json({ insights: result });
    } catch (error) {
      res.status(500).json({ message: 'Failed to analyze quiz', error: error.message });
    }
  };
  