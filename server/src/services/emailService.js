const nodemailer = require('nodemailer');

const sendConsultationEmails = async (enquiry) => {
  const { fullName, businessName, email, phone, service, message, createdAt } = enquiry;

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;

  // Fallback to console notification if SMTP is not configured
  if (!smtpUser || !smtpPass) {
    console.log('----------------------------------------------------');
    console.log('📧 [NEW CONSULTATION SUBMISSION] (SMTP credentials not configured)');
    console.log(`From: ${fullName} (${businessName})`);
    console.log(`Email: ${email} | Phone: ${phone || 'N/A'}`);
    console.log(`Service: ${service}`);
    console.log(`Message: ${message}`);
    console.log(`Date: ${createdAt}`);
    console.log('----------------------------------------------------');
    return { success: true, mode: 'console' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // 1. Notification Email to Artish UK
    const adminMailOptions = {
      from: process.env.SMTP_FROM || `"Artish UK" <${smtpUser}>`,
      to: 'artish.uk.2003@gmail.com',
      subject: `⚡ New Consultation Request from ${fullName} (${businessName})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #11163F; color: #ffffff; padding: 30px; border-radius: 10px;">
          <h2 style="color: #C6FF00; margin-top: 0;">New Consultation Request Received</h2>
          <hr style="border: 0; height: 1px; background: #252B62; margin: 20px 0;" />
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Business Name:</strong> ${businessName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #C6FF00;">${email}</a></p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Service Interested In:</strong> <span style="background: #C6FF00; color: #11163F; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${service}</span></p>
          <div style="background-color: #171B4B; padding: 15px; border-radius: 6px; margin-top: 15px; border-left: 4px solid #C6FF00;">
            <p style="margin: 0; font-style: italic;">"${message}"</p>
          </div>
          <p style="margin-top: 25px; font-size: 12px; color: #8F93B2;">Received at: ${new Date(createdAt).toLocaleString('en-GB')}</p>
        </div>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    // 2. Auto-confirmation Email to Customer
    const customerMailOptions = {
      from: process.env.SMTP_FROM || `"Artish UK" <${smtpUser}>`,
      to: email,
      subject: `Thank you for contacting Artish UK!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #F7F8FC; color: #11163F; padding: 30px; border-radius: 10px; border: 1px solid #E5E7EF;">
          <div style="background-color: #11163F; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">ARTISH <span style="color: #C6FF00;">UK</span></h1>
          </div>
          <div style="padding: 20px; background: #ffffff; border-radius: 0 0 8px 8px;">
            <p>Hi ${fullName},</p>
            <p>Thank you for reaching out to <strong>Artish UK</strong>!</p>
            <p>We have successfully received your consultation request for <strong>${service}</strong>. Our team is reviewing your details and will get back to you with a clear strategy and fixed quote within <strong>24 hours</strong>.</p>
            <div style="background-color: #F7F8FC; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Summary of your request:</strong></p>
              <p style="margin: 5px 0 0 0; color: #5F6380;">"${message}"</p>
            </div>
            <p>Best regards,<br /><strong>The Artish UK Team</strong><br /><a href="https://www.instagram.com/artish.uk" style="color: #11163F;">@artish.uk</a></p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(customerMailOptions);
    return { success: true, mode: 'smtp' };
  } catch (error) {
    console.error('❌ Nodemailer error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendConsultationEmails };
