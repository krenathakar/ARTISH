const prisma = require('../config/db');

// @desc    Get all active services (Public) or all services (Admin)
// @route   GET /api/services
const getServices = async (req, res, next) => {
  try {
    const { all } = req.query;
    const where = all === 'true' ? {} : { isActive: true };

    const services = await prisma.service.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    res.json(services);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service by ID or Slug
// @route   GET /api/services/:id
const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isNum = !isNaN(id);

    const service = isNum
      ? await prisma.service.findUnique({ where: { id: parseInt(id) } })
      : await prisma.service.findUnique({ where: { slug: id } });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new service (Admin)
// @route   POST /api/services
const createService = async (req, res, next) => {
  try {
    const { title, description, icon, image, isActive, sortOrder } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const service = await prisma.service.create({
      data: {
        title,
        slug,
        description,
        icon: icon || 'Camera',
        image: image || null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      },
    });

    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a service (Admin)
// @route   PUT /api/services/:id
const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, icon, image, isActive, sortOrder } = req.body;

    const existing = await prisma.service.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ message: 'Service not found' });
    }

    let slug = existing.slug;
    if (title && title !== existing.title) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const updated = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        title: title !== undefined ? title : existing.title,
        slug,
        description: description !== undefined ? description : existing.description,
        icon: icon !== undefined ? icon : existing.icon,
        image: image !== undefined ? image : existing.image,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : existing.sortOrder,
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a service (Admin)
// @route   DELETE /api/services/:id
const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.service.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
