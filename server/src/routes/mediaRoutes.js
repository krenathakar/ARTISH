const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadMedia, getMedia, deleteMedia } = require('../controllers/mediaController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, upload.single('file'), uploadMedia);
router.get('/', protect, getMedia);
router.delete('/:id', protect, deleteMedia);

module.exports = router;
