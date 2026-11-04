const prisma = require('../config/db');
const { sendEnquiryNotification } = require('../utils/mailer');

// @desc    Submit consultation form (Public)
// @route   POST /api/enquiries
const createEnquiry = async (req, res, next) => {
  try {
    const {
      fullName,
      businessName,
      email,
      phone,
      service,
      message,
      botField,
      bot_field,
      hp_field,
    } = req.body || {};

    console.log('----------------------------------------------------------------------');
    console.log('📥 [DIAGNOSTIC 1/4] POST /api/enquiries reached controller:');
    console.log(`   Customer: "${fullName || 'N/A'}" | Business: "${businessName || 'N/A'}" | Email: "${email || 'N/A'}"`);
    console.log(`   Service: "${service || 'N/A'}" | Phone: "${phone || 'N/A'}"`);

    // 1. Spam protection: Honeypot trap check
    if (botField || bot_field || hp_field) {
      console.warn('⚠️ [Spam Blocked] Consultation submission rejected via honeypot field.');
      return res.status(400).json({ message: 'Invalid submission.' });
    }

    // 2. Validate required fields
    if (!fullName || !businessName || !email || !service || !message) {
      console.warn('⚠️ [Validation Failed] Missing required fields in request body.');
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const trimmedName = String(fullName).trim();
    const trimmedBusiness = String(businessName).trim();
    const trimmedEmail = String(email).trim().toLowerCase();
    const trimmedPhone = phone ? String(phone).trim() : null;
    const trimmedService = String(service).trim();
    const trimmedMessage = String(message).trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return res.status(400).json({ message: 'Name must be between 2 and 100 characters.' });
    }

    if (trimmedBusiness.length < 2 || trimmedBusiness.length > 100) {
      return res.status(400).json({ message: 'Business name must be between 2 and 100 characters.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 150) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (trimmedPhone && trimmedPhone.length > 30) {
      return res.status(400).json({ message: 'Phone number is too long (max 30 characters).' });
    }

    if (trimmedMessage.length < 5 || trimmedMessage.length > 3000) {
      return res.status(400).json({ message: 'Message must be between 5 and 3000 characters.' });
    }

    // 3. Prevent duplicate submissions within a 30-second window
    const duplicateWindow = new Date(Date.now() - 30 * 1000);
    const recentDuplicate = await prisma.enquiry.findFirst({
      where: {
        email: trimmedEmail,
        service: trimmedService,
        createdAt: { gte: duplicateWindow },
      },
    });

    if (recentDuplicate) {
      console.warn(`⚠️ [Duplicate Blocked] Recent duplicate enquiry found for ${trimmedEmail}`);
      return res.status(429).json({
        message: 'A consultation request was recently submitted. Please wait a moment before trying again.',
      });
    }

    // 4. Save enquiry into the database
    const enquiry = await prisma.enquiry.create({
      data: {
        fullName: trimmedName,
        businessName: trimmedBusiness,
        email: trimmedEmail,
        phone: trimmedPhone,
        service: trimmedService,
        message: trimmedMessage,
        status: 'NEW',
      },
    });

    console.log(`💾 [DIAGNOSTIC 2/4] Enquiry successfully saved to database:`);
    console.log(`   ID: ${enquiry.id} | Status: ${enquiry.status} | CreatedAt: ${enquiry.createdAt.toISOString()}`);
    console.log(`   Visible in Admin Panel: YES (Database ID #${enquiry.id})`);

    // 5. Deliver notification email to info@artishmedia.com
    console.log(`📤 [DIAGNOSTIC 3/4] Immediately before email sending for Enquiry #${enquiry.id}...`);
    let emailResult = { delivered: false };
    try {
      emailResult = await sendEnquiryNotification(enquiry);
    } catch (emailErr) {
      console.error(`❌ [DIAGNOSTIC] Uncaught exception during email dispatch:`, emailErr.message);
      emailResult = { delivered: false, error: emailErr.message };
    }

    console.log(`🏁 [DIAGNOSTIC 4/4] After email sending for Enquiry #${enquiry.id}:`);
    console.log(`   Email Delivered: ${emailResult.delivered ? 'YES ✅' : 'NO ❌'}`);
    if (!emailResult.delivered) {
      console.log(`   Failure Reason: ${emailResult.error || 'Check SMTP configuration'}`);
    } else {
      console.log(`   Message ID: ${emailResult.messageId || 'N/A'}`);
    }
    console.log('----------------------------------------------------------------------');

    // 6. Return response to client
    return res.status(201).json({
      success: true,
      message: "Thank you! Your consultation request has been received. We'll get back to you within 24 hours.",
      enquiryId: enquiry.id,
      emailSent: Boolean(emailResult?.delivered),
    });
  } catch (error) {
    console.error('❌ [Enquiry Route Error]:', error);
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
      where: { id: parseInt(id, 10) },
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
      where: { id: parseInt(id, 10) },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    const updated = await prisma.enquiry.update({
      where: { id: parseInt(id, 10) },
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
      where: { id: parseInt(id, 10) },
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
