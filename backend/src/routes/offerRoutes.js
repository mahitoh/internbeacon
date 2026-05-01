const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getAllOffers, getOffer, apply, create, quickApply, remove } = require('../controllers/offerController');

const router = express.Router();

router.get('/', getAllOffers);
router.get('/:id', getOffer);
router.post('/apply', authenticateToken, apply);
router.post('/', authenticateToken, create);
router.post('/quick-apply', authenticateToken, quickApply);
router.delete('/:id', authenticateToken, remove);

module.exports = router;
