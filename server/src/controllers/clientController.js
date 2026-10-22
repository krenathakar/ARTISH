const prisma = require('../config/db');

// @desc    Get clients
// @route   GET /api/clients
const getClients = async (req, res, next) => {
  try {
    const { all, featured } = req.query;
    const where = {};

    if (all !== 'true') {
      where.isActive = true;
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }

    const clients = await prisma.client.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });

    res.json(clients);
  } catch (error) {
    next(error);
  }
};

// @desc    Create client (Admin)
// @route   POST /api/clients
const createClient = async (req, res, next) => {
  try {
    const { name, category, description, logo, initials, website, instagram, isFeatured, isActive, sortOrder } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category are required' });
    }

    const client = await prisma.client.create({
      data: {
        name,
        category,
        description: description || null,
        logo: logo || null,
        initials: initials || name.substring(0, 2).toUpperCase(),
        website: website || null,
        instagram: instagram || null,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      },
    });

    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

// @desc    Update client (Admin)
// @route   PUT /api/clients/:id
const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, description, logo, initials, website, instagram, isFeatured, isActive, sortOrder } = req.body;

    const existing = await prisma.client.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const updated = await prisma.client.update({
      where: { id: parseInt(id) },
      data: {
        name: name !== undefined ? name : existing.name,
        category: category !== undefined ? category : existing.category,
        description: description !== undefined ? description : existing.description,
        logo: logo !== undefined ? logo : existing.logo,
        initials: initials !== undefined ? initials : existing.initials,
        website: website !== undefined ? website : existing.website,
        instagram: instagram !== undefined ? instagram : existing.instagram,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : existing.sortOrder,
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete client (Admin)
// @route   DELETE /api/clients/:id
const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.client.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Client deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClients,
  createClient,
  updateClient,
  deleteClient,
};
