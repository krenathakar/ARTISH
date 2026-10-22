const express = require('express');
const router = express.Router();
const {
  getPortfolio,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPortfolio);
router.get('/:id', getPortfolioById);
router.post('/', protect, createPortfolio);
router.put('/:id', protect, updatePortfolio);
router.delete('/:id', protect, deletePortfolio);

module.exports = router;
