const prisma = require('../config/db');
const fs = require('fs');
const path = require('path');

// Auto-seed guard: guarantees that canonical videos are seeded on initial setup
let isSeeding = false;
async function ensureCanonicalVideosExist() {
  if (isSeeding) return;
  try {
    const alreadySeeded = await prisma.siteSetting.findUnique({
      where: { key: 'videos_initially_seeded' },
    });
    if (alreadySeeded) return;

    const count = await prisma.video.count();
    if (count > 0) {
      await prisma.siteSetting.upsert({
        where: { key: 'videos_initially_seeded' },
        create: { key: 'videos_initially_seeded', value: 'true' },
        update: { value: 'true' },
      });
      return;
    }

    isSeeding = true;
    const backupPath = path.join(__dirname, '../../prisma/backup_videos.json');
    if (fs.existsSync(backupPath)) {
      const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      console.log(`[VideoController] Auto-seeding ${backupData.length} canonical videos...`);
      for (const item of backupData) {
        const { id, createdAt, updatedAt, ...rest } = item;
        await prisma.video.create({ data: rest });
      }
      await prisma.siteSetting.upsert({
        where: { key: 'videos_initially_seeded' },
        create: { key: 'videos_initially_seeded', value: 'true' },
        update: { value: 'true' },
      });
      console.log('[VideoController] Canonical videos successfully seeded.');
    }
  } catch (err) {
    console.error('[VideoController] Auto-seed check error:', err.message);
  } finally {
    isSeeding = false;
  }
}

// Helper to detect video type from URL
function detectVideoType(url) {
  if (!url) return 'MP4';
  const cleanUrl = url.trim().toLowerCase();

  if (cleanUrl.includes('youtube.com/shorts') || cleanUrl.includes('/shorts/')) {
    return 'YOUTUBE_SHORTS';
  }
  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
    return 'YOUTUBE';
  }
  if (cleanUrl.includes('instagram.com/reel') || cleanUrl.includes('instagram.com/p/') || cleanUrl.includes('instagr.am')) {
    return 'INSTAGRAM';
  }
  return 'MP4';
}

// Helper to extract YouTube video ID
function extractYouTubeId(url) {
  if (!url) return null;
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/))([\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// @desc    Get published videos for public website
// @route   GET /api/videos/public
const getPublicVideos = async (req, res, next) => {
  try {
    await ensureCanonicalVideosExist();
    const { category } = req.query;
    const where = { status: 'PUBLISHED' };

    if (category && category !== 'All') {
      where.category = category;
    }

    const videos = await prisma.video.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.json(videos);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all videos (Admin)
// @route   GET /api/videos
const getVideos = async (req, res, next) => {
  try {
    await ensureCanonicalVideosExist();
    const { status, category, search } = req.query;
    const where = {};

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (category && category !== 'All' && category !== 'all') {
      where.category = category;
    }

    if (search && search.trim()) {
      where.title = {
        contains: search.trim(),
      };
    }

    const videos = await prisma.video.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.json(videos);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single video by ID (Admin)
// @route   GET /api/videos/:id
const getVideoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const video = await prisma.video.findUnique({
      where: { id: parseInt(id) },
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new video (Admin)
// @route   POST /api/videos
const createVideo = async (req, res, next) => {
  try {
    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      videoType,
      status,
      displayOrder,
      featured,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Video title is required' });
    }

    if (!videoUrl || !videoUrl.trim()) {
      return res.status(400).json({ message: 'Video URL is required' });
    }

    // Determine video type
    const determinedType = videoType && videoType !== 'AUTO'
      ? videoType
      : detectVideoType(videoUrl);

    // Auto-generate YouTube thumbnail if none provided
    let finalThumbnail = thumbnailUrl ? thumbnailUrl.trim() : null;
    if (!finalThumbnail && (determinedType === 'YOUTUBE' || determinedType === 'YOUTUBE_SHORTS')) {
      const ytId = extractYouTubeId(videoUrl);
      if (ytId) {
        finalThumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      }
    }

    // Determine display order
    let order = 0;
    if (displayOrder !== undefined && displayOrder !== null && displayOrder !== '') {
      order = parseInt(displayOrder) || 0;
    } else {
      const highest = await prisma.video.findFirst({
        orderBy: { displayOrder: 'desc' },
        select: { displayOrder: true },
      });
      order = (highest?.displayOrder || 0) + 1;
    }

    const video = await prisma.video.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        videoUrl: videoUrl.trim(),
        thumbnailUrl: finalThumbnail,
        category: category && category.trim() ? category.trim() : 'Restaurants',
        videoType: determinedType,
        status: status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED',
        displayOrder: order,
        featured: Boolean(featured),
      },
    });

    res.status(201).json(video);
  } catch (error) {
    next(error);
  }
};

// @desc    Update video (Admin)
// @route   PUT /api/videos/:id
const updateVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const videoId = parseInt(id);
    const existing = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      videoType,
      status,
      displayOrder,
      featured,
    } = req.body;

    const finalUrl = videoUrl !== undefined ? videoUrl.trim() : existing.videoUrl;
    const finalType = videoType !== undefined && videoType !== 'AUTO'
      ? videoType
      : (videoUrl ? detectVideoType(finalUrl) : existing.videoType);

    let finalThumbnail = thumbnailUrl !== undefined ? (thumbnailUrl ? thumbnailUrl.trim() : null) : existing.thumbnailUrl;
    if (!finalThumbnail && (finalType === 'YOUTUBE' || finalType === 'YOUTUBE_SHORTS')) {
      const ytId = extractYouTubeId(finalUrl);
      if (ytId) {
        finalThumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      }
    }

    const updated = await prisma.video.update({
      where: { id: videoId },
      data: {
        title: title !== undefined ? title.trim() : existing.title,
        description: description !== undefined ? (description ? description.trim() : null) : existing.description,
        videoUrl: finalUrl,
        thumbnailUrl: finalThumbnail,
        category: category !== undefined ? category.trim() : existing.category,
        videoType: finalType,
        status: status !== undefined ? (status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED') : existing.status,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) || 0 : existing.displayOrder,
        featured: featured !== undefined ? Boolean(featured) : existing.featured,
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle or update video publishing status (Admin)
// @route   PATCH /api/videos/:id/status
const updateVideoStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const videoId = parseInt(id);

    const existing = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const nextStatus = req.body.status
      ? (req.body.status.toUpperCase() === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT')
      : (existing.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED');

    const updated = await prisma.video.update({
      where: { id: videoId },
      data: { status: nextStatus },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete video (Admin)
// @route   DELETE /api/videos/:id
const deleteVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const videoId = parseInt(id);

    const existing = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await prisma.video.delete({
      where: { id: videoId },
    });

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicVideos,
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  updateVideoStatus,
  deleteVideo,
};

