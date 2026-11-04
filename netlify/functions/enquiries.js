import nodemailer from 'nodemailer';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

// In-memory rate & duplicate protection (per serverless container instance)
const recentSubmissions = new Map();
const DUPLICATE_WINDOW_MS = 30000; // 30 seconds

function cleanExpiredSubmissions() {
  const now = Date.now();
  for (const [key, timestamp] of recentSubmissions.entries()) {
    if (now - timestamp > DUPLICATE_WINDOW_MS) {
      recentSubmissions.delete(key);
    }
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const getAdminEmailHtml = (enquiry) => {
  const { fullName, businessName, email, phone, service, message, createdAt } = enquiry;
  const formattedDate = new Date(createdAt || Date.now()).toLocaleString('en-GB', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Europe/London',
  });

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #101946; color: #ffffff; padding: 32px; border-radius: 16px; border: 1px solid #1A2355;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #222C66;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">ARTISH <span style="color: #B8FF00;">UK</span></h1>
        <span style="background: rgba(184, 255, 0, 0.15); color: #B8FF00; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">New Website Enquiry</span>
      </div>

      <h2 style="color: #B8FF00; margin: 0 0 16px 0; font-size: 18px; font-weight: 700;">Consultation Request Received</h2>
      <p style="color: #94A3B8; font-size: 14px; margin-top: 0; margin-bottom: 24px;">A new prospective client submitted the consultation form on the Artish UK website.</p>

      <div style="background-color: #172152; border: 1px solid #252F66; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #94A3B8; width: 140px; font-weight: 600;">Full Name:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: 700;">${escapeHtml(fullName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94A3B8; font-weight: 600;">Business Name:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: 700;">${escapeHtml(businessName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94A3B8; font-weight: 600;">Email Address:</td>
            <td style="padding: 8px 0;">
              <a href="mailto:${escapeHtml(email)}" style="color: #B8FF00; font-weight: 700; text-decoration: none;">${escapeHtml(email)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94A3B8; font-weight: 600;">Phone Number:</td>
            <td style="padding: 8px 0; color: #ffffff;">
              ${phone ? `<a href="tel:${escapeHtml(phone)}" style="color: #B8FF00; font-weight: 700; text-decoration: none;">${escapeHtml(phone)}</a>` : '<span style="color: #64748B;">Not provided</span>'}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94A3B8; font-weight: 600;">Selected Service:</td>
            <td style="padding: 8px 0;">
              <span style="background: #B8FF00; color: #101946; padding: 3px 10px; border-radius: 6px; font-weight: 800; font-size: 12px; display: inline-block;">${escapeHtml(service)}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94A3B8; font-weight: 600;">Submission Date:</td>
            <td style="padding: 8px 0; color: #E2E8F0; font-size: 13px;">${formattedDate}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #172152; border-left: 4px solid #B8FF00; border-radius: 0 12px 12px 0; padding: 18px; margin-bottom: 24px;">
        <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #94A3B8; letter-spacing: 0.5px;">Customer Message:</p>
        <p style="margin: 0; color: #ffffff; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
      </div>

      <div style="text-align: center; padding-top: 12px;">
        <a href="mailto:${escapeHtml(email)}" style="display: inline-block; background-color: #B8FF00; color: #101946; font-weight: 800; font-size: 14px; padding: 12px 28px; border-radius: 999px; text-decoration: none;">Reply Directly to Customer</a>
      </div>

      <p style="margin-top: 28px; font-size: 11px; color: #64748B; text-align: center;">
        Artish UK Netlify Serverless Engine • Sent to ${escapeHtml(process.env.CONSULTATION_RECIPIENT_EMAIL || 'info@artishmedia.com')}
      </p>
    </div>
  `;
};

const getCustomerEmailHtml = (enquiry) => {
  const { fullName, service, message } = enquiry;
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #F8FAFC; color: #101946; padding: 32px; border-radius: 16px; border: 1px solid #E2E8F0;">
      <div style="background-color: #101946; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">ARTISH <span style="color: #B8FF00;">UK</span></h1>
        <p style="color: #94A3B8; font-size: 12px; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Creative Marketing & Content Agency</p>
      </div>
      <div style="padding: 28px 24px; background: #ffffff; border-radius: 0 0 12px 12px; border: 1px solid #E2E8F0; border-top: none;">
        <p style="font-size: 16px; font-weight: 700; color: #101946; margin-top: 0;">Hi ${escapeHtml(fullName)},</p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Thank you for reaching out to <strong>Artish UK</strong>!
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          We have received your enquiry regarding <strong>${escapeHtml(service)}</strong>. Our team is reviewing your requirements and will get back to you with a tailored strategy and quote within <strong>24 hours</strong>.
        </p>
        <div style="background-color: #F1F5F9; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 3px solid #101946;">
          <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase;">Summary of your message:</p>
          <p style="margin: 0; color: #334155; font-size: 13px; line-height: 1.5; font-style: italic;">"${escapeHtml(message)}"</p>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Need immediate assistance? You can call us directly on <a href="tel:+447552782519" style="color: #101946; font-weight: 700;">+44 7552 782519</a> or chat with us on <a href="https://wa.me/447552782519" style="color: #101946; font-weight: 700;">WhatsApp</a>.
        </p>
        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #E2E8F0; font-size: 13px; color: #64748B;">
          <p style="margin: 0 0 4px 0; font-weight: 700; color: #101946;">The Artish UK Team</p>
          <p style="margin: 0;">
            <a href="mailto:info@artishmedia.com" style="color: #64748B; text-decoration: none;">info@artishmedia.com</a> • 
            <a href="https://www.instagram.com/artish.uk" style="color: #64748B; text-decoration: none;">@artish.uk</a>
          </p>
        </div>
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
  const adminRecipient = process.env.CONSULTATION_RECIPIENT_EMAIL || 'info@artishmedia.com';
  const smtpFrom = process.env.SMTP_FROM || (smtpUser ? `"Artish UK" <${smtpUser}>` : `"Artish UK" <${adminRecipient}>`);

  let emailSent = false;

  // 1. Try Nodemailer SMTP if credentials provided
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
        replyTo: email,
        subject: `New Website Enquiry – Artish UK: ${fullName} (${businessName})`,
        html: getAdminEmailHtml(enquiry),
      };

      const customerMailOptions = {
        from: smtpFrom,
        to: email,
        replyTo: adminRecipient,
        subject: 'Thank you for contacting Artish UK!',
        html: getCustomerEmailHtml(enquiry),
      };

      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(customerMailOptions),
      ]);

      console.log('✅ Nodemailer sent consultation emails successfully to', adminRecipient);
      emailSent = true;
    } catch (smtpErr) {
      console.error('❌ Nodemailer error:', smtpErr.message);
    }
  }

  // 2. Try Resend if configured and SMTP didn't send
  if (!emailSent && process.env.RESEND_API_KEY) {
    try {
      const resendFrom = process.env.RESEND_FROM || 'Artish UK <onboarding@resend.dev>';
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
            reply_to: email,
            subject: `New Website Enquiry – Artish UK: ${fullName} (${businessName})`,
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
            reply_to: adminRecipient,
            subject: 'Thank you for contacting Artish UK!',
            html: getCustomerEmailHtml(enquiry),
          }),
        }),
      ]);
      console.log('✅ Resend sent consultation emails successfully to', adminRecipient);
      emailSent = true;
    } catch (resendErr) {
      console.error('❌ Resend API error:', resendErr.message);
    }
  }

  // Operational logging so no consultation lead is ever lost
  console.log('----------------------------------------------------');
  console.log(`📧 [CONSULTATION SUBMISSION] ${emailSent ? '(Emails delivered)' : '(Credentials pending in Netlify environment)'}`);
  console.log(`From: ${fullName} (${businessName})`);
  console.log(`Email: ${email} | Phone: ${phone || 'N/A'}`);
  console.log(`Service: ${service}`);
  console.log(`Message: ${message}`);
  console.log(`Recipient: ${adminRecipient}`);
  console.log(`Date: ${createdAt}`);
  if (!emailSent && !smtpUser && !process.env.RESEND_API_KEY) {
    console.log('💡 Tip: Set SMTP_USER & SMTP_PASSWORD or RESEND_API_KEY in Netlify Site Configuration -> Environment Variables.');
  }
  console.log('----------------------------------------------------');

  return { success: true, emailSent };
};

const processEnquiry = async (body) => {
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
  } = body || {};

  // 1. Spam honeypot protection
  if (botField || bot_field || hp_field) {
    return {
      status: 400,
      data: { success: false, message: 'Invalid submission' },
    };
  }

  // 2. Validate required fields
  if (!fullName || !businessName || !email || !service || !message) {
    return {
      status: 400,
      data: { success: false, message: 'Please fill in all required fields.' },
    };
  }

  const trimmedName = String(fullName).trim();
  const trimmedBusiness = String(businessName).trim();
  const trimmedEmail = String(email).trim().toLowerCase();
  const trimmedPhone = phone ? String(phone).trim() : null;
  const trimmedService = String(service).trim();
  const trimmedMessage = String(message).trim();

  if (trimmedName.length < 2 || trimmedName.length > 100) {
    return {
      status: 400,
      data: { success: false, message: 'Name must be between 2 and 100 characters.' },
    };
  }

  if (trimmedBusiness.length < 2 || trimmedBusiness.length > 100) {
    return {
      status: 400,
      data: { success: false, message: 'Business name must be between 2 and 100 characters.' },
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 150) {
    return {
      status: 400,
      data: { success: false, message: 'Please enter a valid email address.' },
    };
  }

  if (trimmedPhone && trimmedPhone.length > 30) {
    return {
      status: 400,
      data: { success: false, message: 'Phone number is too long (max 30 characters).' },
    };
  }

  if (trimmedMessage.length < 5 || trimmedMessage.length > 3000) {
    return {
      status: 400,
      data: { success: false, message: 'Message must be between 5 and 3000 characters.' },
    };
  }

  // 3. Duplicate protection
  cleanExpiredSubmissions();
  const submissionKey = `${trimmedEmail}:${trimmedService}:${trimmedMessage.slice(0, 40)}`;
  if (recentSubmissions.has(submissionKey)) {
    return {
      status: 429,
      data: {
        success: false,
        message: 'A consultation request was recently submitted. Please wait a few moments before trying again.',
      },
    };
  }
  recentSubmissions.set(submissionKey, Date.now());

  let enquiryId = Date.now();
  const enquiry = {
    id: enquiryId,
    fullName: trimmedName,
    businessName: trimmedBusiness,
    email: trimmedEmail,
    phone: trimmedPhone,
    service: trimmedService,
    message: trimmedMessage,
    createdAt: new Date().toISOString(),
  };

  // 4. If DATABASE_URL is configured, persist to MySQL database via Prisma
  if (process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      const saved = await prisma.enquiry.create({
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
      enquiry.id = saved.id;
      enquiryId = saved.id;
      await prisma.$disconnect().catch(() => {});
    } catch (dbErr) {
      console.warn('⚠️ [Netlify Function] Database save warning:', dbErr.message);
    }
  }

  // 5. Send consultation emails
  let emailResult = { success: true, emailSent: false };
  try {
    emailResult = await sendConsultationEmails(enquiry);
  } catch (err) {
    console.error('Email sending error:', err);
  }

  return {
    status: 201,
    data: {
      success: true,
      message: "Thank you! Your consultation request has been received. We'll get back to you within 24 hours.",
      enquiryId,
      emailSent: emailResult.emailSent,
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
