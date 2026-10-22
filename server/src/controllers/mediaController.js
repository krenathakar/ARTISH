const prisma = require('../config/db');
const cloudinary = require('../config/cloudinary');

// @desc    Upload media file
// @route   POST /api/media
const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let fileUrl = `/uploads/${req.file.filename}`;
    let publicId = null;

    // Check if Cloudinary is configured
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      try {
        const cloudResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'artish_uk',
        });
        fileUrl = cloudResult.secure_url;
        publicId = cloudResult.public_id;
      } catch (cErr) {
        console.warn('Cloudinary upload fallback to local storage:', cErr.message);
      }
    }

    const media = await prisma.media.create({
      data: {
        url: fileUrl,
        publicId,
        filename: req.file.originalname,
        altText: req.body.altText || req.file.originalname,
      },
    });

    res.status(201).json(media);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all media assets (Admin)
// @route   GET /api/media
const getMedia = async (req, res, next) => {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(media);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete media asset (Admin)
// @route   DELETE /api/media/:id
const deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.media.findUnique({ where: { id: parseInt(id) } });
    if (existing && existing.publicId && process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        await cloudinary.uploader.destroy(existing.publicId);
      } catch (err) {
        console.warn('Failed to delete Cloudinary asset:', err.message);
      }
    }

    await prisma.media.delete({ where: { id: parseInt(id) } });

    res.json({ message: 'Media file deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadMedia, getMedia, deleteMedia };
