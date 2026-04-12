const axios = require('axios');

// Configurable AI provider
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai'; // 'openai', 'gemini', 'huggingface'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

class AIResumeOptimizer {
  async optimizeResume(resumeText, jobDescription = '') {
    const prompt = `Analyze this resume and provide specific, actionable suggestions for improvement. Focus on:
1. Content gaps
2. Keyword optimization for ATS
3. Structure and formatting
4. Quantifiable achievements
5. Skills alignment with job requirements

Resume:
${resumeText}

${jobDescription ? `Target Job Description:
${jobDescription}

` : ''}

Provide suggestions in a structured format with sections.`;

    try {
      const response = await this.callAI(prompt);
      return this.parseSuggestions(response);
    } catch (error) {
      console.error('AI Resume optimization failed:', error);
      throw new Error('Resume optimization service temporarily unavailable');
    }
  }

  async callAI(prompt) {
    switch (AI_PROVIDER) {
      case 'openai':
        return this.callOpenAI(prompt);
      case 'gemini':
        return this.callGemini(prompt);
      case 'huggingface':
        return this.callHuggingFace(prompt);
      default:
        throw new Error('Unsupported AI provider');
    }
  }

  async callOpenAI(prompt) {
    if (!OPENAI_API_KEY) throw new Error('OpenAI API key not configured');

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  }

  async callGemini(prompt) {
    if (!GEMINI_API_KEY) throw new Error('Gemini API key not configured');

    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    });

    return response.data.candidates[0].content.parts[0].text;
  }

  async callHuggingFace(prompt) {
    // Using free inference API for a general model
    const response = await axios.post('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      inputs: prompt,
      parameters: {
        max_length: 1000,
        temperature: 0.7
      }
    }, {
      headers: {
        'Authorization': HUGGINGFACE_API_KEY ? `Bearer ${HUGGINGFACE_API_KEY}` : undefined,
        'Content-Type': 'application/json'
      }
    });

    return response.data[0].generated_text;
  }

  parseSuggestions(response) {
    // Parse the AI response into structured suggestions
    const sections = response.split('\n\n');
    const suggestions = {
      contentGaps: [],
      keywordOptimization: [],
      structure: [],
      achievements: [],
      skills: [],
      overall: ''
    };

    let currentSection = '';
    sections.forEach(section => {
      const lower = section.toLowerCase();
      if (lower.includes('content') && lower.includes('gap')) {
        currentSection = 'contentGaps';
      } else if (lower.includes('keyword')) {
        currentSection = 'keywordOptimization';
      } else if (lower.includes('structure') || lower.includes('format')) {
        currentSection = 'structure';
      } else if (lower.includes('achiev') || lower.includes('quantif')) {
        currentSection = 'achievements';
      } else if (lower.includes('skill')) {
        currentSection = 'skills';
      } else if (lower.includes('overall') || lower.includes('summary')) {
        suggestions.overall = section;
        return;
      }

      if (currentSection && section.trim()) {
        suggestions[currentSection].push(section.trim());
      }
    });

    return suggestions;
  }
}

module.exports = new AIResumeOptimizer();