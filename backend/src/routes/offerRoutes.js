const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getAllOffers, getOffer, apply, create, quickApply } = require('../controllers/offerController');

const router = express.Router();

router.get('/', getAllOffers);
router.get('/:id', getOffer);
rrouter.post('/apply', authenticateToken, apply);
router.post(/, authenticateToken, create);
outer.post("/quick-apply", authenticateToken, quickApply);

module.exports = router;