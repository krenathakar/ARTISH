import React from 'react';
import { Phone, Mail, MessageSquare } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, FacebookIcon, TiktokIcon } from '../components/BrandIcons';
import { useSettings } from '../context/SettingsContext';
import ConsultationForm from '../components/ConsultationForm';

const DEFAULT_EMAIL = 'info@artishmedia.com';
const DEFAULT_PHONE = '+44 7552 782519';
const DEFAULT_PHONE_TEL = '+447552782519';
const DEFAULT_WHATSAPP_PREFILLED = 'Hello Artish UK, I would like to enquire about your services.';
const DEFAULT_WHATSAPP = `https://wa.me/447552782519?text=${encodeURIComponent(DEFAULT_WHATSAPP_PREFILLED)}`;

export const ContactSection = () => {
  const { settings } = useSettings();

  const businessEmail = settings?.business_email || DEFAULT_EMAIL;
  const businessPhone = settings?.phone || DEFAULT_PHONE;
  const businessPhoneTel = businessPhone.replace(/[^0-9+]/g, '') || DEFAULT_PHONE_TEL;
  const businessWhatsapp = settings?.whatsapp_url || DEFAULT_WHATSAPP;

  return (
    <section id="contact" className="bg-white py-24 border-b border-[#E2E8F0] text-[#101946]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column Contact Information Cards */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Let's grow{' '}
                <span className="text-[#101946] bg-[#B8FF00] px-3 py-0.5 rounded-xl inline-block border border-[#B8FF00]">
                  your
                </span>{' '}
                <span>business.</span>
              </h2>

              <p className="text-base text-[#64748B] leading-relaxed mt-4">
                Tell us a little about your business and we'll come back with a free strategy call and fixed quote within 24 hours.
              </p>
            </div>

            {/* Immediate Direct Contact Action Buttons (Mobile-friendly Call & WhatsApp) */}
            <div className="bg-[#F7F8FA] p-5 rounded-3xl border border-[#E2E8F0] space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#101946]">
                  Need Immediate Help?
                </span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ● Available Mon-Sat
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Reach our creative team directly via direct call or instant WhatsApp chat:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Call Now Button */}
                <a
                  href={`tel:${businessPhoneTel}`}
                  id="btn-call-now"
                  className="flex items-center justify-center gap-2 bg-[#101946] hover:bg-[#1A2566] text-[#B8FF00] font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all duration-200 active:scale-95 group border border-[#101946]"
                  aria-label={`Call Now at ${businessPhone}`}
                >
                  <Phone className="w-4 h-4 text-[#B8FF00] group-hover:scale-110 transition-transform" />
                  <span>Call Now</span>
                </a>

                {/* WhatsApp Button */}
                <a
                  href={businessWhatsapp}
                  id="btn-whatsapp-now"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all duration-200 active:scale-95 group"
                  aria-label="Chat with Artish UK on WhatsApp"
                >
                  <MessageSquare className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Contact Details Cards */}
            <div className="space-y-3 pt-1">
              {/* PHONE CARD */}
              <a
                href={`tel:${businessPhoneTel}`}
                id="link-contact-phone"
                className="flex items-center gap-3.5 bg-[#F7F8FA] p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#101946] hover:bg-[#FFFFFF] transition-all group shadow-xs"
                aria-label={`Call Artish UK at ${businessPhone}`}
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 group-hover:bg-[#101946] group-hover:text-[#B8FF00] transition-colors">
                  <Phone className="w-5 h-5 text-[#101946] group-hover:text-[#B8FF00]" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B] font-semibold uppercase">Business Phone</p>
                  <p className="text-sm sm:text-base font-bold text-[#101946] group-hover:text-[#101946] transition-colors">
                    {businessPhone}
                  </p>
                </div>
              </a>

              {/* EMAIL CARD */}
              <a
                href={`mailto:${businessEmail}`}
                id="link-contact-email"
                className="flex items-center gap-3.5 bg-[#F7F8FA] p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#101946] hover:bg-[#FFFFFF] transition-all group shadow-xs"
                aria-label={`Email Artish UK at ${businessEmail}`}
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 group-hover:bg-[#101946] group-hover:text-[#B8FF00] transition-colors">
                  <Mail className="w-5 h-5 text-[#101946] group-hover:text-[#B8FF00]" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B] font-semibold uppercase">Business Email</p>
                  <p className="text-sm sm:text-base font-bold text-[#101946] group-hover:text-[#101946] transition-colors">
                    {businessEmail}
                  </p>
                </div>
              </a>

              {/* INSTAGRAM */}
              <a
                href={settings.instagram_url || 'https://www.instagram.com/artish.uk'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 bg-[#F7F8FA] p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#101946] hover:bg-[#FFFFFF] transition-all group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 group-hover:bg-[#101946] group-hover:text-[#B8FF00] transition-colors">
                  <InstagramIcon className="w-5 h-5 text-[#101946]" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B] font-semibold uppercase">Instagram</p>
                  <p className="text-sm sm:text-base font-bold text-[#101946] group-hover:text-[#101946] transition-colors">
                    @artish.uk
                  </p>
                </div>
              </a>

              {/* YOUTUBE */}
              <a
                href={settings.youtube_url || 'https://youtube.com/@artishmedia?si=YzOlivVPhrB2GO8h'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube — Artish"
                className="flex items-center gap-3.5 bg-[#F7F8FA] p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#101946] hover:bg-[#FFFFFF] transition-all group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 group-hover:bg-[#101946] group-hover:text-[#B8FF00] transition-colors">
                  <YoutubeIcon className="w-5 h-5 text-[#101946]" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B] font-semibold uppercase">YouTube</p>
                  <p className="text-sm sm:text-base font-bold text-[#101946] group-hover:text-[#101946] transition-colors">
                    Artish Media
                  </p>
                </div>
              </a>

              {/* FACEBOOK */}
              <a
                href={settings.facebook_url || 'https://www.facebook.com/profile.php?id=61590765263393#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook — Artish"
                className="flex items-center gap-3.5 bg-[#F7F8FA] p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#101946] hover:bg-[#FFFFFF] transition-all group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 group-hover:bg-[#101946] group-hover:text-[#B8FF00] transition-colors">
                  <FacebookIcon className="w-5 h-5 text-[#101946]" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B] font-semibold uppercase">Facebook</p>
                  <p className="text-sm sm:text-base font-bold text-[#101946] group-hover:text-[#101946] transition-colors">
                    Artish UK
                  </p>
                </div>
              </a>

              {/* TIKTOK */}
              <a
                href={settings.tiktok_url || 'https://www.tiktok.com/@artish711'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok — Artish"
                className="flex items-center gap-3.5 bg-[#F7F8FA] p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#101946] hover:bg-[#FFFFFF] transition-all group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 group-hover:bg-[#101946] group-hover:text-[#B8FF00] transition-colors">
                  <TiktokIcon className="w-5 h-5 text-[#101946]" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B] font-semibold uppercase">TikTok</p>
                  <p className="text-sm sm:text-base font-bold text-[#101946] group-hover:text-[#101946] transition-colors">
                    @artish711
                  </p>
                </div>
              </a>

              {/* LOCATION */}
              <div className="block bg-[#F7F8FA] p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <div>
                  <p className="text-xs text-[#64748B] font-semibold uppercase">Location</p>
                  <p className="text-sm font-bold text-[#101946]">
                    {settings.location || 'United Kingdom · Serving nationwide'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Consultation Form */}
          <div className="lg:col-span-7">
            <ConsultationForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
