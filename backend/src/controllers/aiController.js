const aiResumeService = require('../services/aiResumeService');

const optimizeResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Resume text is required'
      });
    }

    const suggestions = await aiResumeService.optimizeResume(resumeText, jobDescription);

    res.json({
      success: true,
      data: {
        suggestions,
        provider: process.env.AI_PROVIDER || 'openai'
      }
    });
  } catch (error) {
    console.error('Resume optimization error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to optimize resume'
    });
  }
};

module.exports = { optimizeResume };