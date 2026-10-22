const prisma = require('../config/db');

// @desc    Get all portfolio projects
// @route   GET /api/portfolio
const getPortfolio = async (req, res, next) => {
  try {
    const { category, all } = req.query;
    const where = {};

    if (all !== 'true') {
      where.isPublished = true;
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    const portfolio = await prisma.portfolio.findMany({
      where,
      include: { client: true },
      orderBy: { sortOrder: 'asc' },
    });

    res.json(portfolio);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single portfolio project by ID or Slug
// @route   GET /api/portfolio/:id
const getPortfolioById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isNum = !isNaN(id);

    const project = isNum
      ? await prisma.portfolio.findUnique({ where: { id: parseInt(id) }, include: { client: true } })
      : await prisma.portfolio.findUnique({ where: { slug: id }, include: { client: true } });

    if (!project) {
      return res.status(404).json({ message: 'Portfolio project not found' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new portfolio project (Admin)
// @route   POST /api/portfolio
const createPortfolio = async (req, res, next) => {
  try {
    const {
      title,
      category,
      description,
      image,
      videoUrl,
      instagramUrl,
      externalUrl,
      clientId,
      isFeatured,
      isPublished,
      sortOrder,
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const project = await prisma.portfolio.create({
      data: {
        title,
        slug,
        category,
        description: description || null,
        image: image || null,
        videoUrl: videoUrl || null,
        instagramUrl: instagramUrl || null,
        externalUrl: externalUrl || null,
        clientId: clientId ? parseInt(clientId) : null,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Update portfolio project (Admin)
// @route   PUT /api/portfolio/:id
const updatePortfolio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      description,
      image,
      videoUrl,
      instagramUrl,
      externalUrl,
      clientId,
      isFeatured,
      isPublished,
      sortOrder,
    } = req.body;

    const existing = await prisma.portfolio.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ message: 'Portfolio project not found' });
    }

    const updated = await prisma.portfolio.update({
      where: { id: parseInt(id) },
      data: {
        title: title !== undefined ? title : existing.title,
        category: category !== undefined ? category : existing.category,
        description: description !== undefined ? description : existing.description,
        image: image !== undefined ? image : existing.image,
        videoUrl: videoUrl !== undefined ? videoUrl : existing.videoUrl,
        instagramUrl: instagramUrl !== undefined ? instagramUrl : existing.instagramUrl,
        externalUrl: externalUrl !== undefined ? externalUrl : existing.externalUrl,
        clientId: clientId !== undefined ? (clientId ? parseInt(clientId) : null) : existing.clientId,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : existing.isPublished,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : existing.sortOrder,
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete portfolio project (Admin)
// @route   DELETE /api/portfolio/:id
const deletePortfolio = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.portfolio.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Portfolio project deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPortfolio,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
};
