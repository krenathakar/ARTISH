const express = require('express');
const router = express.Router();
const {
  getPublicVideos,
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  updateVideoStatus,
  deleteVideo,
} = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');

// Public endpoint - only returns published videos
router.get('/public', getPublicVideos);

// Admin protected endpoints
router.get('/', protect, getVideos);
router.get('/:id', protect, getVideoById);
router.post('/', protect, createVideo);
router.put('/:id', protect, updateVideo);
router.patch('/:id/status', protect, updateVideoStatus);
router.delete('/:id', protect, deleteVideo);

module.exports = router;

