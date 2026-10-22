import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, FacebookIcon, TiktokIcon } from '../components/BrandIcons';
import { useSettings } from '../context/SettingsContext';
import API from '../services/api';

const servicesList = [
  'Social Media Management',
  'Content Creation',
  'Event Shooting',
  'Podcast Production',
  'Media Campaigns',
  'Influencer Marketing',
  'Website Design',
  'Meta Advertising',
  'Other',
];

export const ContactSection = () => {
  const { settings } = useSettings();
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const handleSelectService = (e) => {
      if (e.detail) {
        setValue('service', e.detail);
      }
    };
    window.addEventListener('select-service', handleSelectService);
    return () => window.removeEventListener('select-service', handleSelectService);
  }, [setValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSuccessMessage('');
    setServerError('');

    try {
      const res = await API.post('/enquiries', data);
      setSuccessMessage(
        res.data.message ||
          "Thank you! Your consultation request has been received. We'll get back to you within 24 hours."
      );
      reset();
    } catch (err) {
      console.error('Submission error:', err);
      setServerError(
        err.response?.data?.message ||
          'Failed to submit request. Please try again or email us directly.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-white py-24 border-b border-[#E2E8F0] text-[#101946]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column Contact Information Cards */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Let's grow{' '}
              <span className="text-[#101946] bg-[#B8FF00] px-3 py-0.5 rounded-xl inline-block border border-[#B8FF00]">
                your
              </span>{' '}
              <span>business.</span>
            </h2>

            <p className="text-base text-[#64748B] leading-relaxed">
              Tell us a little about your business and we'll come back with a free strategy call within 24 hours.
            </p>

            {/* Information Cards */}
            <div className="space-y-4 pt-2">
              {/* EMAIL */}
              <a
                href={`mailto:${settings.business_email || 'artish.uk.2003@gmail.com'}`}
                className="block bg-[#F7F8FA] p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#101946] transition-all group shadow-xs"
              >
                <div>
                  <p className="text-xs text-[#64748B] font-semibold uppercase">Email Us</p>
                  <p className="text-sm sm:text-base font-bold text-[#101946] group-hover:text-[#101946] transition-colors">
                    {settings.business_email || 'artish.uk.2003@gmail.com'}
                  </p>
                </div>
              </a>

              {/* INSTAGRAM */}
              <a
                href={settings.instagram_url || 'https://www.instagram.com/artish.uk'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#F7F8FA] p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#101946] transition-all group shadow-xs"
              >
                <InstagramIcon className="w-5 h-5 text-[#101946]" />
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
                className="flex items-center gap-3 bg-[#F7F8FA] p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#101946] transition-all group shadow-xs"
              >
                <YoutubeIcon className="w-5 h-5 text-[#101946]" />
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
                className="flex items-center gap-3 bg-[#F7F8FA] p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#101946] transition-all group shadow-xs"
              >
                <FacebookIcon className="w-5 h-5 text-[#101946]" />
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
                className="flex items-center gap-3 bg-[#F7F8FA] p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#101946] transition-all group shadow-xs"
              >
                <TiktokIcon className="w-5 h-5 text-[#101946]" />
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

              {/* DYNAMIC PHONE CARD */}
              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="block bg-[#F7F8FA] p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#101946] transition-all group shadow-xs"
                >
                  <div>
                    <p className="text-xs text-[#64748B] font-semibold uppercase">Phone</p>
                    <p className="text-sm font-bold text-[#101946] group-hover:text-[#101946]">
                      {settings.phone}
                    </p>
                  </div>
                </a>
              )}

              {/* DYNAMIC WHATSAPP CARD */}
              {settings.whatsapp_url && (
                <a
                  href={settings.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-[#F7F8FA] p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#101946] transition-all group shadow-xs"
                >
                  <div>
                    <p className="text-xs text-[#64748B] font-semibold uppercase">WhatsApp</p>
                    <p className="text-sm font-bold text-[#101946] group-hover:text-[#25D366]">
                      Chat on WhatsApp
                    </p>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Right Column Consultation Form */}
          <div className="lg:col-span-7 bg-[#F7F8FA] p-8 sm:p-10 rounded-3xl border border-[#E2E8F0] shadow-xl text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#101946] mb-2">
              Book a free consultation
            </h3>
            <p className="text-sm text-[#64748B] mb-8">
              We'll send a clear quote within 24 hours.
            </p>

            {successMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500 text-emerald-800 flex items-start gap-3 text-sm font-bold animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {serverError && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500 text-red-700 flex items-start gap-3 text-sm font-bold animate-fadeIn">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#101946] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('fullName', { required: 'Full name is required' })}
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl px-4 py-3.5 text-[#101946] placeholder-gray-400 focus:outline-none focus:border-[#101946] transition-colors"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 mt-1 font-semibold">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Business Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#101946] mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    {...register('businessName', { required: 'Business name is required' })}
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl px-4 py-3.5 text-[#101946] placeholder-gray-400 focus:outline-none focus:border-[#101946] transition-colors"
                  />
                  {errors.businessName && (
                    <p className="text-xs text-red-500 mt-1 font-semibold">
                      {errors.businessName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#101946] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email format',
                      },
                    })}
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl px-4 py-3.5 text-[#101946] placeholder-gray-400 focus:outline-none focus:border-[#101946] transition-colors"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1 font-semibold">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#101946] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl px-4 py-3.5 text-[#101946] placeholder-gray-400 focus:outline-none focus:border-[#101946] transition-colors"
                  />
                </div>
              </div>

              {/* Service Interested In */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#101946] mb-2">
                  Service Interested In *
                </label>
                <select
                  {...register('service', { required: 'Please select a service' })}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-4 py-3.5 text-[#101946] focus:outline-none focus:border-[#101946] transition-colors cursor-pointer"
                >
                  <option value="">Select a Service...</option>
                  {servicesList.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <p className="text-xs text-red-500 mt-1 font-semibold">
                    {errors.service.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#101946] mb-2">
                  Message *
                </label>
                <textarea
                  rows={4}
                  {...register('message', { required: 'Message is required' })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-4 py-3.5 text-[#101946] placeholder-gray-400 focus:outline-none focus:border-[#101946] transition-colors resize-none"
                />
                {errors.message && (
                  <p className="text-xs text-red-500 mt-1 font-semibold">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#B8FF00] hover:bg-[#A3E600] text-[#101946] font-extrabold text-base py-4 rounded-xl shadow-lg shadow-[#B8FF00]/25 transition-all flex items-center justify-center gap-2 transform active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <span>Book Free Consultation</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
