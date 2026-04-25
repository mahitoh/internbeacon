const { register, login, refresh, getCurrentUser } = require('../services/authService');

const registerUser = async (req, res) => {
  try {
    const result = await register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    global.logger?.error('Register error', { message: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login({ email, password });
    res.json({ success: true, data: result });
  } catch (error) {
    global.logger?.error('Login error', { message: error.message });
    res.status(401).json({ success: false, message: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await refresh(refreshToken);
    res.json({ success: true, data: result });
  } catch (error) {
    global.logger?.error('Refresh token error', { message: error.message });
    res.status(401).json({ success: false, message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await getCurrentUser(req.user.id);
    res.json({ success: true, data: user });
  } catch (error) {
    global.logger?.error('Get current user error', { message: error.message });
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, refreshToken, getMe };
