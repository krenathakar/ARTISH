const {
  sendEnquiryNotification,
  generateNotificationHtml,
  generateNotificationText,
} = require('../utils/mailer');

const getAdminEmailHtml = (enquiry) => generateNotificationHtml(enquiry);

const getCustomerEmailHtml = (enquiry) => {
  const { fullName, service, message } = enquiry;
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #F8FAFC; color: #101946; padding: 32px; border-radius: 16px; border: 1px solid #E2E8F0;">
      <div style="background-color: #101946; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">ARTISH <span style="color: #B8FF00;">UK</span></h1>
        <p style="color: #94A3B8; font-size: 12px; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Creative Marketing & Content Agency</p>
      </div>
      <div style="padding: 28px 24px; background: #ffffff; border-radius: 0 0 12px 12px; border: 1px solid #E2E8F0; border-top: none;">
        <p style="font-size: 16px; font-weight: 700; color: #101946; margin-top: 0;">Hi ${fullName},</p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Thank you for reaching out to <strong>Artish UK</strong>!
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          We have received your enquiry regarding <strong>${service}</strong>. Our creative team is reviewing your requirements and will get back to you with a tailored strategy and quote within <strong>24 hours</strong>.
        </p>
        <div style="background-color: #F1F5F9; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 3px solid #101946;">
          <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase;">Summary of your message:</p>
          <p style="margin: 0; color: #334155; font-size: 13px; line-height: 1.5; font-style: italic;">"${message}"</p>
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
  return await sendEnquiryNotification(enquiry);
};

module.exports = {
  sendConsultationEmails,
  getAdminEmailHtml,
  getCustomerEmailHtml,
};
