/**
 * Cloudflare Pages Function: POST /api/enquiries
 *
 * Handles public consultation requests for Artish UK (artishmedia.com).
 * Validates inputs, protects against spam, sends email notifications via Resend HTTP API,
 * and returns proper HTTP status codes.
 *
 * NOTE: This serverless edge function is email-dispatch only and does not store records
 * in a persistent database (MySQL). Enquiries are routed directly to the consultation inbox.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

// In-memory rate & duplicate protection (per Worker isolate)
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
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #11163F; color: #ffffff; padding: 30px; border-radius: 10px;">
      <h2 style="color: #C6FF00; margin-top: 0;">New Consultation Request Received</h2>
      <hr style="border: 0; height: 1px; background: #252B62; margin: 20px 0;" />
      <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Business Name:</strong> ${escapeHtml(businessName)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color: #C6FF00;">${escapeHtml(email)}</a></p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || 'Not provided')}</p>
      <p><strong>Service Interested In:</strong> <span style="background: #C6FF00; color: #11163F; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${escapeHtml(service)}</span></p>
      <div style="background-color: #171B4B; padding: 15px; border-radius: 6px; margin-top: 15px; border-left: 4px solid #C6FF00;">
        <p style="margin: 0; font-style: italic;">"${escapeHtml(message)}"</p>
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
        <p>Hi ${escapeHtml(fullName)},</p>
        <p>Thank you for reaching out to <strong>Artish UK</strong>!</p>
        <p>We have successfully received your consultation request for <strong>${escapeHtml(service)}</strong>. Our team is reviewing your details and will get back to you with a clear strategy and fixed quote within <strong>24 hours</strong>.</p>
        <div style="background-color: #F7F8FC; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Summary of your request:</strong></p>
          <p style="margin: 5px 0 0 0; color: #5F6380;">"${escapeHtml(message)}"</p>
        </div>
        <p>Best regards,<br /><strong>The Artish UK Team</strong><br /><a href="https://www.instagram.com/artish.uk" style="color: #11163F;">@artish.uk</a></p>
      </div>
    </div>
  `;
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // 1. Enforce POST method
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, message: 'Method Not Allowed' }),
      {
        status: 405,
        headers: {
          ...CORS_HEADERS,
          Allow: 'POST, OPTIONS',
        },
      }
    );
  }

  // 2. Parse JSON body
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid JSON payload' }),
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const { fullName, businessName, email, phone, service, message, botField, bot_field, hp_field } = body || {};

  // 3. Spam protection: Honeypot check
  if (botField || bot_field || hp_field) {
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid submission' }),
      { status: 400, headers: CORS_HEADERS }
    );
  }

  // 4. Validate required fields
  if (!fullName || !businessName || !email || !service || !message) {
    return new Response(
      JSON.stringify({ success: false, message: 'Please fill in all required fields.' }),
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const trimmedName = String(fullName).trim();
  const trimmedBusiness = String(businessName).trim();
  const trimmedEmail = String(email).trim().toLowerCase();
  const trimmedPhone = phone ? String(phone).trim() : null;
  const trimmedService = String(service).trim();
  const trimmedMessage = String(message).trim();

  if (trimmedName.length < 2 || trimmedName.length > 100) {
    return new Response(
      JSON.stringify({ success: false, message: 'Name must be between 2 and 100 characters.' }),
      { status: 400, headers: CORS_HEADERS }
    );
  }

  if (trimmedBusiness.length < 2 || trimmedBusiness.length > 100) {
    return new Response(
      JSON.stringify({ success: false, message: 'Business name must be between 2 and 100 characters.' }),
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 150) {
    return new Response(
      JSON.stringify({ success: false, message: 'Please enter a valid email address.' }),
      { status: 400, headers: CORS_HEADERS }
    );
  }

  if (trimmedPhone && trimmedPhone.length > 30) {
    return new Response(
      JSON.stringify({ success: false, message: 'Phone number is too long.' }),
      { status: 400, headers: CORS_HEADERS }
    );
  }

  if (trimmedMessage.length < 5 || trimmedMessage.length > 3000) {
    return new Response(
      JSON.stringify({ success: false, message: 'Message must be between 5 and 3000 characters.' }),
      { status: 400, headers: CORS_HEADERS }
    );
  }

  // 5. Duplicate submission prevention
  cleanExpiredSubmissions();
  const submissionKey = `${trimmedEmail}:${trimmedService}:${trimmedMessage.slice(0, 40)}`;
  if (recentSubmissions.has(submissionKey)) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'A consultation request was recently submitted. Please wait a few moments before trying again.',
      }),
      { status: 429, headers: CORS_HEADERS }
    );
  }
  recentSubmissions.set(submissionKey, Date.now());

  // 6. Verify Resend credentials
  const resendApiKey = env?.RESEND_API_KEY;
  const adminRecipient = env?.CONSULTATION_RECIPIENT_EMAIL || 'info@artishmedia.com';
  const fromEmail = env?.FROM_EMAIL || 'Artish UK <onboarding@resend.dev>';

  let emailSent = false;

  // 6. Send Admin & Customer Notifications if Resend is configured
  if (resendApiKey) {
    try {
      const adminEmailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [adminRecipient],
          reply_to: trimmedEmail,
          subject: `New Website Enquiry – Artish UK: ${trimmedName} (${trimmedBusiness})`,
          html: getAdminEmailHtml(enquiry),
        }),
      });

      if (adminEmailRes.ok) {
        emailSent = true;
        console.log(`[Enquiry API] Admin notification successfully delivered for enquiry id: ${enquiry.id}`);
      } else {
        const errText = await adminEmailRes.text().catch(() => '');
        console.error(`[Enquiry API] Resend admin email failed with status ${adminEmailRes.status}: ${errText.slice(0, 200)}`);
      }
    } catch (err) {
      console.error('[Enquiry API] Resend network error:', err?.message || 'Unknown network error');
    }
  } else {
    console.log('----------------------------------------------------');
    console.log('📧 [CONSULTATION SUBMISSION] (RESEND_API_KEY pending in environment)');
    console.log(`Customer: ${trimmedName} (${trimmedBusiness})`);
    console.log(`Email: ${trimmedEmail} | Phone: ${trimmedPhone || 'N/A'}`);
    console.log(`Service: ${trimmedService}`);
    console.log(`Message: ${trimmedMessage}`);
    console.log('----------------------------------------------------');
  }

  // 8. Send Customer Auto-confirmation Email
  try {
    const customerEmailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [trimmedEmail],
        subject: 'Thank you for contacting Artish UK!',
        html: getCustomerEmailHtml(enquiry),
      }),
    });

    if (!customerEmailRes.ok) {
      const custErr = await customerEmailRes.text().catch(() => '');
      console.warn(`[Enquiry API] Customer confirmation email skipped/failed (status ${customerEmailRes.status}). Verify domain in Resend. Summary: ${custErr.slice(0, 150)}`);
    } else {
      console.log(`[Enquiry API] Customer confirmation sent successfully for enquiry id: ${enquiry.id}`);
    }
  } catch (custErr) {
    console.warn('[Enquiry API] Customer confirmation email network error:', custErr?.message || 'Unknown error');
  }

  // 9. Success response
  return new Response(
    JSON.stringify({
      success: true,
      message: "Thank you! Your consultation request has been received. We'll get back to you within 24 hours.",
      enquiryId: enquiry.id,
    }),
    { status: 201, headers: CORS_HEADERS }
  );
}

// Universal handler fallback for any HTTP method
export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return onRequestOptions(context);
  }
  if (context.request.method === 'POST') {
    return onRequestPost(context);
  }
  return new Response(
    JSON.stringify({ success: false, message: 'Method Not Allowed' }),
    {
      status: 405,
      headers: {
        ...CORS_HEADERS,
        Allow: 'POST, OPTIONS',
      },
    }
  );
}
