const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});
/**
 * Escapes HTML entities to prevent injection in email templates.
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Formats submission date for display (Europe/London UK timezone).
 */
function formatSubmissionDate(date) {
  return new Date(date || Date.now()).toLocaleString('en-GB', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Europe/London',
  });
}

/**
 * Returns cleaned configuration values from environment variables.
 * Automatically strips whitespace from Google App Passwords (e.g. "abcd efgh ijkl mnop" -> "abcdefghijklmnop").
 */
function getEmailConfig() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = port === 465; // SSL/TLS for port 465
  const user = (process.env.EMAIL_USER || process.env.SMTP_USER || 'info@artishmedia.com').trim();
  const rawPass = process.env.EMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD || '';
  const pass = rawPass.replace(/[\s\r\n]+/g, ''); // Google App Passwords are 16 chars with no spaces
  const receiver = (process.env.ENQUIRY_RECEIVER || process.env.CONSULTATION_RECIPIENT_EMAIL || user || 'info@artishmedia.com').trim();

  return {
    host,
    port,
    secure,
    user,
    pass,
    receiver,
    isConfigured: Boolean(pass && pass.length > 0),
  };
}

/**
 * Creates and returns a Nodemailer transporter configured for Google Workspace / Gmail SMTP.
 * Host: smtp.gmail.com
 * Port: 465 (SSL/TLS secure)
 */
function createTransporter() {
  const config = getEmailConfig();

  if (!config.isConfigured) {
    return null;
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure, // true for 465
    auth: {
      user: config.user,
      pass: config.pass,
    },
    connectionTimeout: 15000, // 15s timeout
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });
}

/**
 * Generates responsive HTML email notification for the Artish UK admin team.
 */
function generateNotificationHtml(enquiry) {
  const { fullName, businessName, email, phone, service, message, createdAt } = enquiry;
  const submissionDate = formatSubmissionDate(createdAt);

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #101946; color: #ffffff; padding: 32px; border-radius: 16px; border: 1px solid #1A2355;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #222C66;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">ARTISH <span style="color: #B8FF00;">UK</span></h1>
        <span style="background: rgba(184, 255, 0, 0.15); color: #B8FF00; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">New Website Enquiry</span>
      </div>

      <h2 style="color: #B8FF00; margin: 0 0 16px 0; font-size: 18px; font-weight: 700;">Consultation Request Received</h2>
      <p style="color: #94A3B8; font-size: 14px; margin-top: 0; margin-bottom: 24px;">A new prospective client submitted the consultation enquiry form on the Artish UK website.</p>

      <div style="background-color: #172152; border: 1px solid #252F66; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #94A3B8; width: 140px; font-weight: 600;">Full Name:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: 700;">${escapeHtml(fullName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94A3B8; font-weight: 600;">Business Name:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: 700;">${businessName ? escapeHtml(businessName) : '<span style="color: #64748B;">Not provided</span>'}</td>
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
            <td style="padding: 8px 0; color: #E2E8F0; font-size: 13px;">${submissionDate}</td>
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
        Artish UK Website Notification Engine • Delivered to ${escapeHtml(process.env.ENQUIRY_RECEIVER || process.env.CONSULTATION_RECIPIENT_EMAIL || 'info@artishmedia.com')}
      </p>
    </div>
  `;
}

/**
 * Generates plain text version of enquiry notification.
 */
function generateNotificationText(enquiry) {
  const { fullName, businessName, email, phone, service, message, createdAt } = enquiry;
  const submissionDate = formatSubmissionDate(createdAt);

  return [
    '=== NEW ARTISH UK WEBSITE ENQUIRY ===',
    '',
    `Full Name:       ${fullName}`,
    `Business Name:   ${businessName || 'Not provided'}`,
    `Email:           ${email}`,
    `Phone:           ${phone || 'Not provided'}`,
    `Service:         ${service}`,
    `Submission Date: ${submissionDate}`,
    '',
    '--- Customer Message ---',
    message,
    '',
    `Reply directly to: ${email}`,
    '=====================================',
  ].join('\n');
}

/**
 * Sends enquiry email notification to business email (info@artishmedia.com)
 * Sets sender to business email and replyTo to customer's email.
 *
 * @param {Object} enquiry Enquiry data saved in DB
 * @returns {Promise<{ delivered: boolean, error?: string, messageId?: string }>}
 */
async function sendEnquiryNotification(enquiry) {
  const config = getEmailConfig();

  console.log(`   [Mailer] Inspecting SMTP configuration for Enquiry #${enquiry.id || 'N/A'}:`);
  console.log(`   - Host: ${config.host}:${config.port} (${config.secure ? 'SSL/TLS' : 'STARTTLS'})`);
  console.log(`   - Sender: "${config.user}"`);
  console.log(`   - Recipient: "${config.receiver}"`);
  console.log(`   - Reply-To: "${enquiry.email}"`);
  console.log(`   - Password Loaded?: ${config.pass ? `YES (${config.pass.length} chars)` : 'NO (EMPTY STRING in server/.env)'}`);

  // 1. Check if email credentials are configured in .env
  if (!config.isConfigured) {
    const warningMsg = 'EMAIL_APP_PASSWORD is empty in server/.env. Google Workspace requires a 16-character App Password to authenticate SMTP.';
    console.error(`❌ [Mailer Error] Notification skipped: ${warningMsg}`);
    console.warn(`   👉 Add your Google-generated App Password to server/.env: EMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"`);
    return {
      delivered: false,
      error: warningMsg,
    };
  }

  // 2. Attempt Nodemailer SMTP delivery via Google Workspace (smtp.gmail.com:465)
  try {
    console.log(`   [Mailer] Initiating secure SSL connection to ${config.host}:${config.port}...`);
    const transporter = createTransporter();
    if (!transporter) {
      throw new Error('Failed to initialize Nodemailer transporter.');
    }

    const mailOptions = {
      from: `"Artish UK" <${config.user}>`,
      to: config.receiver,
      replyTo: enquiry.email, // Replies go straight to the customer
      subject: `New Website Enquiry – Artish UK: ${enquiry.fullName}${enquiry.businessName ? ` (${enquiry.businessName})` : ''}`,
      text: generateNotificationText(enquiry),
      html: generateNotificationHtml(enquiry),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Mailer] Notification email ACCEPTED by Google SMTP for delivery to ${config.receiver}!`);
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   SMTP Server Response: ${info.response}`);

    return {
      delivered: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    // Log error safely without exposing passwords
    console.error(`❌ [Mailer Error] Google Workspace SMTP rejected message: ${error.message}`);
    return {
      delivered: false,
      error: error.message,
    };
  }
}

/**
 * Development test helper: Sends a verification email to info@artishmedia.com.
 * Used exclusively by backend test scripts (not exposed as a public endpoint).
 */
async function testEmailDelivery() {
  const config = getEmailConfig();

  if (!config.isConfigured) {
    return {
      success: false,
      error: 'EMAIL_APP_PASSWORD is missing or empty in server/.env.',
      solution: 'Generate a 16-character Google Workspace / Gmail App Password at https://myaccount.google.com/apppasswords and add it to server/.env.',
    };
  }

  try {
    const transporter = createTransporter();
    // 1. Verify connection and authentication
    await transporter.verify();

    // 2. Dispatch test message
    const info = await transporter.sendMail({
      from: `"Artish UK" <${config.user}>`,
      to: config.receiver,
      replyTo: config.user,
      subject: 'Artish UK - Email Delivery Test',
      text: 'This is a test notification confirming that Google Workspace SMTP email delivery is functioning correctly on port 465 (SSL/TLS).',
      html: `
        <div style="font-family: Arial, sans-serif; background: #101946; color: #fff; padding: 24px; border-radius: 12px; max-width: 500px;">
          <h2 style="color: #B8FF00; margin-top: 0;">Artish UK – SMTP Test Successful</h2>
          <p>This email confirms that your Google Workspace SMTP configuration is working.</p>
          <p><strong>Sender:</strong> ${config.user}</p>
          <p><strong>Recipient:</strong> ${config.receiver}</p>
          <p><strong>Host:</strong> ${config.host}:${config.port} (SSL/TLS)</p>
          <p style="color: #94A3B8; font-size: 12px; margin-top: 20px;">Timestamp: ${new Date().toISOString()}</p>
        </div>
      `,
    });

    return {
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      response: info.response,
    };
  } catch (err) {
    let explanation = 'SMTP Error';
    if (err.message.includes('535') || err.message.includes('Username and Password not accepted') || err.code === 'EAUTH') {
      explanation = 'Google rejected the username or password. Ensure 2-Step Verification is enabled and use a 16-character App Password generated specifically for this application at https://myaccount.google.com/apppasswords.';
    } else if (err.code === 'ETIMEDOUT' || err.code === 'ECONNECTION') {
      explanation = 'Connection timed out while trying to reach smtp.gmail.com on port 465. Verify that your network/firewall permits outbound connections on port 465.';
    }

    return {
      success: false,
      error: err.message,
      code: err.code,
      explanation,
    };
  }
}

/**
 * Helper to verify SMTP credentials connection without exposing secrets.
 */
async function verifySmtpConnection() {
  const config = getEmailConfig();
  if (!config.isConfigured) {
    return { verified: false, message: 'EMAIL_APP_PASSWORD not configured in server/.env' };
  }

  try {
    const transporter = createTransporter();
    await transporter.verify();
    return { verified: true, message: 'SMTP connection verified successfully' };
  } catch (err) {
    return { verified: false, message: err.message };
  }
}

module.exports = {
  createTransporter,
  sendEnquiryNotification,
  verifySmtpConnection,
  testEmailDelivery,
  generateNotificationHtml,
  generateNotificationText,
  getEmailConfig,
};
