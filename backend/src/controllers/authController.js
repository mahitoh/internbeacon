const { register, login } = require('../services/authService');

const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    const result = await register(userData);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login({ email, password });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser };