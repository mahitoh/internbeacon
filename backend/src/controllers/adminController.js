const { getAllUsers, getAllOffers, getStats, deleteUser, deleteOffer } = require('../services/adminService');

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOffers = async (req, res) => {
  try {
    const offers = await getAllOffers();
    res.json({ success: true, data: offers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const stats = await getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await deleteUser(userId);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const removeOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    await deleteOffer(offerId);
    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  getOffers,
  getDashboardStats,
  removeUser,
  removeOffer
};