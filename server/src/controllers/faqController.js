const prisma = require('../config/db');

// @desc    Get FAQs
// @route   GET /api/faqs
const getFaqs = async (req, res, next) => {
  try {
    const { all } = req.query;
    const where = all === 'true' ? {} : { isPublished: true };

    const faqs = await prisma.faq.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });

    res.json(faqs);
  } catch (error) {
    next(error);
  }
};

// @desc    Create FAQ (Admin)
// @route   POST /api/faqs
const createFaq = async (req, res, next) => {
  try {
    const { question, answer, isPublished, sortOrder } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    const faq = await prisma.faq.create({
      data: {
        question,
        answer,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      },
    });

    res.status(201).json(faq);
  } catch (error) {
    next(error);
  }
};

// @desc    Update FAQ (Admin)
// @route   PUT /api/faqs/:id
const updateFaq = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question, answer, isPublished, sortOrder } = req.body;

    const existing = await prisma.faq.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    const updated = await prisma.faq.update({
      where: { id: parseInt(id) },
      data: {
        question: question !== undefined ? question : existing.question,
        answer: answer !== undefined ? answer : existing.answer,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : existing.isPublished,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : existing.sortOrder,
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete FAQ (Admin)
// @route   DELETE /api/faqs/:id
const deleteFaq = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.faq.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'FAQ deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
};
