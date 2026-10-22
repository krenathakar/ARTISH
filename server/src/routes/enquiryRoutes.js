const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
} = require('../controllers/enquiryController');
const { protect } = require('../middleware/authMiddleware');

// Rate limiter for public consultation submissions: max 5 per 15 minutes per IP
const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many consultation submissions from this IP. Please try again later.' },
});

router.post('/', enquiryLimiter, createEnquiry);
router.get('/', protect, getEnquiries);
router.get('/:id', protect, getEnquiryById);
router.put('/:id', protect, updateEnquiry);
router.delete('/:id', protect, deleteEnquiry);

module.exports = router;
