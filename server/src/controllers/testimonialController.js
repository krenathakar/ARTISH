const prisma = require('../config/db');

// @desc    Get testimonials
// @route   GET /api/testimonials
const getTestimonials = async (req, res, next) => {
  try {
    const { all } = req.query;
    const where = all === 'true' ? {} : { isPublished: true };

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });

    res.json(testimonials);
  } catch (error) {
    next(error);
  }
};

// @desc    Create testimonial (Admin)
// @route   POST /api/testimonials
const createTestimonial = async (req, res, next) => {
  try {
    const { name, company, quote, image, rating, isPublished, sortOrder } = req.body;

    if (!name || !quote || !company) {
      return res.status(400).json({ message: 'Name, company and quote are required' });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        company,
        quote,
        image: image || null,
        rating: rating ? parseInt(rating) : 5,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      },
    });

    res.status(201).json(testimonial);
  } catch (error) {
    next(error);
  }
};

// @desc    Update testimonial (Admin)
// @route   PUT /api/testimonials/:id
const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, company, quote, image, rating, isPublished, sortOrder } = req.body;

    const existing = await prisma.testimonial.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    const updated = await prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: {
        name: name !== undefined ? name : existing.name,
        company: company !== undefined ? company : existing.company,
        quote: quote !== undefined ? quote : existing.quote,
        image: image !== undefined ? image : existing.image,
        rating: rating !== undefined ? parseInt(rating) : existing.rating,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : existing.isPublished,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : existing.sortOrder,
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial (Admin)
// @route   DELETE /api/testimonials/:id
const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.testimonial.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
