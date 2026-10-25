import nodemailer from 'nodemailer';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const getAdminEmailHtml = (enquiry) => {
  const { fullName, businessName, email, phone, service, message, createdAt } = enquiry;
  return `
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
  `;
};

const getCustomerEmailHtml = (enquiry) => {
  const { fullName, service, message } = enquiry;
  return `
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
  `;
};

const sendConsultationEmails = async (enquiry) => {
  const { fullName, businessName, email, phone, service, message, createdAt } = enquiry;

  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const adminRecipient = process.env.CONSULTATION_RECIPIENT_EMAIL || 'artish.uk.2003@gmail.com';
  const smtpFrom = process.env.SMTP_FROM || (smtpUser ? `"Artish UK" <${smtpUser}>` : `"Artish UK" <${adminRecipient}>`);

  let emailSent = false;

  // 1. Try Nodemailer SMTP if SMTP_USER and SMTP_PASSWORD are provided
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const adminMailOptions = {
        from: smtpFrom,
        to: adminRecipient,
        subject: `⚡ New Consultation Request from ${fullName} (${businessName})`,
        html: getAdminEmailHtml(enquiry),
      };

      const customerMailOptions = {
        from: smtpFrom,
        to: email,
        subject: 'Thank you for contacting Artish UK!',
        html: getCustomerEmailHtml(enquiry),
      };

      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(customerMailOptions),
      ]);

      console.log('✅ Nodemailer sent consultation emails successfully');
      emailSent = true;
    } catch (smtpErr) {
      console.error('❌ Nodemailer error:', smtpErr.message);
    }
  }

  // 2. Try Resend if configured and SMTP didn't send
  if (!emailSent && process.env.RESEND_API_KEY) {
    try {
      const resendFrom = process.env.RESEND_FROM || 'onboarding@resend.dev';
      await Promise.all([
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: resendFrom,
            to: [adminRecipient],
            subject: `⚡ New Consultation Request from ${fullName} (${businessName})`,
            html: getAdminEmailHtml(enquiry),
          }),
        }),
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: resendFrom,
            to: [email],
            subject: 'Thank you for contacting Artish UK!',
            html: getCustomerEmailHtml(enquiry),
          }),
        }),
      ]);
      console.log('✅ Resend sent consultation emails successfully');
      emailSent = true;
    } catch (resendErr) {
      console.error('❌ Resend API error:', resendErr.message);
    }
  }

  // Always log lead details so no consultation is ever lost
  console.log('----------------------------------------------------');
  console.log(`📧 [NEW CONSULTATION SUBMISSION] ${emailSent ? '(Emails delivered)' : '(Credentials pending in Netlify)'}`);
  console.log(`From: ${fullName} (${businessName})`);
  console.log(`Email: ${email} | Phone: ${phone || 'N/A'}`);
  console.log(`Service: ${service}`);
  console.log(`Message: ${message}`);
  console.log(`Date: ${createdAt}`);
  if (!emailSent && !smtpUser) {
    console.log('💡 Tip: Set SMTP_USER and SMTP_PASSWORD in Netlify Site Configuration -> Environment Variables to receive live emails.');
  }
  console.log('----------------------------------------------------');

  return { success: true, emailSent };
};

const processEnquiry = async (body) => {
  const { fullName, businessName, email, phone, service, message } = body || {};

  if (!fullName || !businessName || !email || !service || !message) {
    return {
      status: 400,
      data: { message: 'Please fill in all required fields.' },
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      status: 400,
      data: { message: 'Please enter a valid email address.' },
    };
  }

  const enquiry = {
    id: Date.now(),
    fullName: String(fullName).trim(),
    businessName: String(businessName).trim(),
    email: String(email).trim().toLowerCase(),
    phone: phone ? String(phone).trim() : null,
    service: String(service).trim(),
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
  };

  try {
    await sendConsultationEmails(enquiry);
  } catch (err) {
    console.error('Email sending error:', err);
  }

  return {
    status: 201,
    data: {
      success: true,
      message: "Thank you! Your consultation request has been received. We'll get back to you within 24 hours.",
      enquiryId: enquiry.id,
    },
  };
};

export const handler = async (event) => {
  // Check if invoked via Web Request (Netlify v2)
  if (event && (typeof event.json === 'function' || (typeof Request !== 'undefined' && event instanceof Request))) {
    if (event.method === 'OPTIONS') {
      return new Response('', { status: 204, headers: corsHeaders });
    }
    if (event.method !== 'POST') {
      return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
        status: 405,
        headers: corsHeaders,
      });
    }
    let body = {};
    try {
      body = await event.json();
    } catch {
      return new Response(JSON.stringify({ message: 'Invalid JSON payload' }), {
        status: 400,
        headers: corsHeaders,
      });
    }
    const result = await processEnquiry(body);
    return new Response(JSON.stringify(result.data), {
      status: result.status,
      headers: corsHeaders,
    });
  }

  // Classic Lambda event (Netlify v1)
  const method = event.httpMethod || 'GET';
  if (method === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }
  if (method !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  let body = {};
  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body) : (event.body || {});
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ message: 'Invalid JSON payload' }) };
  }

  const result = await processEnquiry(body);
  return {
    statusCode: result.status,
    headers: corsHeaders,
    body: JSON.stringify(result.data),
  };
};

export default handler;
