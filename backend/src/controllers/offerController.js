const { getOffers, getOfferById, applyToOffer, createOffer } = require('../services/offerService');

const getAllOffers = async (req, res) => {
  try {
    const data = await getOffers(req.query);
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get offers error', { message: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
};

const getOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getOfferById(id);
    if (!data) return res.status(404).json({ success: false, message: 'Offer not found' });
    res.json({ success: true, data });
  } catch (error) {
    global.logger?.error('Get offer error', { message: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};

const apply = async (req, res) => {
  const { offerId, coverLetter, resume, portfolio, availability } = req.body;
  try {
    const student = await require('../config/database').prisma.student.findUnique({
      where: { userId: req.user.id },
    });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const additionalData = { coverLetter, resume, portfolio, availability };
    const data = await applyToOffer(student.id, offerId, additionalData);
    res.status(201).json({ success: true, data });
  } catch (error) {
    global.logger?.error('Apply offer error', { message: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const company = await require('../config/database').prisma.company.findUnique({
      where: { userId: req.user.id },
    });
    if (!company) return res.status(403).json({ success: false, message: 'Company profile required' });

    const data = await createOffer(company.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    global.logger?.error('Create offer error', { message: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
};

const quickApply = async (req, res) => {
  try {
    const { offerId, customCoverLetter } = req.body;
    const student = await require('../config/database').prisma.student.findUnique({
      where: { userId: req.user.id },
      include: { user: true },
    });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    let coverLetter = customCoverLetter;
    if (!coverLetter && student.bio) {
      coverLetter = `Dear Hiring Manager,\n\nI am excited to apply for this internship opportunity. ${student.bio}\n\nMy skills include: ${student.skills.join(', ')}.\n\nI would welcome the opportunity to discuss how I can contribute to your team.\n\nBest regards,\n${student.user.name}`;
    }

    const additionalData = {
      coverLetter,
      availability: 'Flexible',
    };

    const data = await applyToOffer(student.id, offerId, additionalData);
    res.status(201).json({ success: true, data });
  } catch (error) {
    global.logger?.error('Quick apply error', { message: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getAllOffers, getOffer, apply, create, quickApply };
