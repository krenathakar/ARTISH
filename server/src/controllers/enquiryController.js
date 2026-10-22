const prisma = require('../config/db');
const { sendConsultationEmails } = require('../services/emailService');

// @desc    Submit consultation form (Public)
// @route   POST /api/enquiries
const createEnquiry = async (req, res, next) => {
  try {
    const { fullName, businessName, email, phone, service, message } = req.body;

    // Backend validation
    if (!fullName || !businessName || !email || !service || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        fullName,
        businessName,
        email: email.toLowerCase().trim(),
        phone: phone || null,
        service,
        message,
        status: 'NEW',
      },
    });

    // Trigger Nodemailer notifications in background
    sendConsultationEmails(enquiry).catch((err) =>
      console.error('Failed to send consultation emails:', err)
    );

    res.status(201).json({
      success: true,
      message: "Thank you! Your consultation request has been received. We'll get back to you within 24 hours.",
      enquiryId: enquiry.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enquiries (Admin)
// @route   GET /api/enquiries
const getEnquiries = async (req, res, next) => {
  try {
    const { status, service, search } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }
    if (service) {
      where.service = service;
    }
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { businessName: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const enquiries = await prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(enquiries);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single enquiry (Admin)
// @route   GET /api/enquiries/:id
const getEnquiryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enquiry = await prisma.enquiry.findUnique({
      where: { id: parseInt(id) },
    });

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    res.json(enquiry);
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status/notes (Admin)
// @route   PUT /api/enquiries/:id
const updateEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const existing = await prisma.enquiry.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    const updated = await prisma.enquiry.update({
      where: { id: parseInt(id) },
      data: {
        status: status || existing.status,
        notes: notes !== undefined ? notes : existing.notes,
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete enquiry (Admin)
// @route   DELETE /api/enquiries/:id
const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.enquiry.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Enquiry deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
};
