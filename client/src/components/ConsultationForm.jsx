import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, AlertCircle, Loader2, Send, Sparkles, RefreshCw } from 'lucide-react';
import { submitConsultationEnquiry } from '../services/api';
import { useSettings } from '../context/SettingsContext';

const DEFAULT_SERVICES = [
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

export const ConsultationForm = () => {
  const { settings } = useSettings();
  const businessEmail = settings?.business_email || 'info@artishmedia.com';

  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      businessName: '',
      email: '',
      phone: '',
      service: '',
      message: '',
      botField: '',
    },
  });

  // Listen for 'select-service' custom event triggered by ServicesSection cards
  useEffect(() => {
    const handleSelectService = (event) => {
      const selectedService = event.detail;
      if (selectedService && typeof selectedService === 'string') {
        setValue('service', selectedService, { shouldValidate: true, shouldDirty: true });
      }
    };

    window.addEventListener('select-service', handleSelectService);
    return () => window.removeEventListener('select-service', handleSelectService);
  }, [setValue]);

  const onSubmit = async (formData) => {
    // 1. Prevent duplicate submission while a request is in flight
    if (submitting) return;

    setSubmitting(true);
    setServerError('');

    // Prepare payload (honeypot included)
    const payload = {
      fullName: formData.fullName.trim(),
      businessName: formData.businessName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone ? formData.phone.trim() : '',
      service: formData.service,
      message: formData.message.trim(),
      botField: formData.botField || '',
    };

    try {
      // 2. Connect to existing backend API endpoint: POST /api/enquiries
      const response = await submitConsultationEnquiry(payload);

      // 3. Never display success unless backend confirms success
      if (response && (response.success === true || response.enquiryId)) {
        setSubmittedName(payload.fullName);
        setSubmissionSuccess(true);
        reset();
      } else {
        throw new Error(response?.message || 'Unexpected response from server. Please try again.');
      }
    } catch (err) {
      console.error('[Consultation Form] Submission error:', err);
      const status = err.response?.status;
      const resData = err.response?.data;

      let errorMsg = '';
      if (resData && typeof resData === 'object' && resData.message) {
        errorMsg = resData.message;
      } else if (typeof resData === 'string' && !resData.includes('<html')) {
        errorMsg = resData;
      } else if (status === 429) {
        errorMsg = 'A consultation request was recently submitted from your connection. Please wait a moment before trying again.';
      } else if (status === 400) {
        errorMsg = 'Please verify that all required fields are filled out correctly.';
      } else if (err.message && !err.message.includes('status code') && !err.message.includes('Network Error')) {
        errorMsg = err.message;
      } else {
        errorMsg = `Unable to reach the server. Please check your internet connection or email us directly at ${businessEmail}.`;
      }

      setServerError(errorMsg);
      setSubmissionSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmissionSuccess(false);
    setSubmittedName('');
    setServerError('');
    reset();
  };

  return (
    <div
      id="consultation-form-card"
      className="bg-[#F7F8FA] p-8 sm:p-10 rounded-3xl border border-[#E2E8F0] shadow-xl text-left transition-all"
    >
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101946]/5 border border-[#101946]/10 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#101946]" />
          <span className="text-xs font-bold text-[#101946] uppercase tracking-wider">
            Free Strategy Call & Fixed Quote
          </span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#101946] tracking-tight mb-2">
          Book a free consultation
        </h3>
        <p className="text-sm text-[#64748B] leading-relaxed">
          Tell us about your brand goals. We will review your project and deliver a tailored strategy and fixed quote within 24 hours.
        </p>
      </div>

      {/* Success State Banner */}
      {submissionSuccess ? (
        <div
          id="consultation-success-banner"
          role="alert"
          aria-live="polite"
          className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 space-y-4 animate-fadeIn"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0 mt-0.5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-extrabold text-[#101946]">
                Consultation Request Received!
              </h4>
              <p className="text-sm text-emerald-900 leading-relaxed">
                Thank you{submittedName ? `, ${submittedName}` : ''}! Your consultation request has been securely recorded and sent to our team at{' '}
                <a
                  href={`mailto:${businessEmail}`}
                  className="font-bold underline hover:text-[#101946]"
                >
                  {businessEmail}
                </a>
                .
              </p>
              <p className="text-xs text-emerald-800 font-semibold pt-1">
                ✓ We will review your project and get back to you within 24 hours.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-200 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-emerald-800">
              Need immediate assistance? Call us directly on{' '}
              <a href="tel:+447552782519" className="font-bold underline text-[#101946]">
                +44 7552 782519
              </a>
            </span>
            <button
              type="button"
              onClick={handleResetForm}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-extrabold text-[#101946] bg-[#B8FF00] hover:bg-[#A3E600] rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Submit Another Enquiry</span>
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
          aria-label="Artish UK Consultation Enquiry Form"
        >
          {/* Server Error State Banner */}
          {serverError && (
            <div
              id="consultation-error-banner"
              role="alert"
              aria-live="assertive"
              className="p-4 rounded-2xl bg-red-500/10 border-2 border-red-500 text-red-900 flex items-start gap-3 text-sm font-semibold animate-fadeIn"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-red-800">Unable to Submit Enquiry</p>
                <p className="text-xs leading-relaxed text-red-700">{serverError}</p>
              </div>
            </div>
          )}

          {/* Honeypot Spam Protection Field - Hidden from normal users */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <label htmlFor="botField">Do not fill this field</label>
            <input
              id="botField"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register('botField')}
            />
          </div>

          {/* Row 1: Full Name & Business Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-bold uppercase tracking-wider text-[#101946] mb-2"
              >
                Full Name <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                disabled={submitting}
                placeholder="e.g. John Doe"
                aria-required="true"
                aria-invalid={errors.fullName ? 'true' : 'false'}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                {...register('fullName', {
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  maxLength: { value: 100, message: 'Name cannot exceed 100 characters' },
                })}
                className={`w-full bg-white border ${
                  errors.fullName ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-[#CBD5E1] focus:border-[#101946] focus:ring-[#101946]/10'
                } rounded-xl px-4 py-3.5 text-[#101946] placeholder-gray-400 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 disabled:bg-gray-50`}
              />
              {errors.fullName && (
                <p id="fullName-error" role="alert" className="text-xs text-red-500 mt-1.5 font-semibold">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Business Name */}
            <div>
              <label
                htmlFor="businessName"
                className="block text-xs font-bold uppercase tracking-wider text-[#101946] mb-2"
              >
                Business Name <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="businessName"
                type="text"
                autoComplete="organization"
                disabled={submitting}
                placeholder="e.g. The Artisan Bistro"
                aria-required="true"
                aria-invalid={errors.businessName ? 'true' : 'false'}
                aria-describedby={errors.businessName ? 'businessName-error' : undefined}
                {...register('businessName', {
                  required: 'Business name is required',
                  minLength: { value: 2, message: 'Business name must be at least 2 characters' },
                  maxLength: { value: 100, message: 'Business name cannot exceed 100 characters' },
                })}
                className={`w-full bg-white border ${
                  errors.businessName ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-[#CBD5E1] focus:border-[#101946] focus:ring-[#101946]/10'
                } rounded-xl px-4 py-3.5 text-[#101946] placeholder-gray-400 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 disabled:bg-gray-50`}
              />
              {errors.businessName && (
                <p id="businessName-error" role="alert" className="text-xs text-red-500 mt-1.5 font-semibold">
                  {errors.businessName.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Email Address & Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-[#101946] mb-2"
              >
                Email Address <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                disabled={submitting}
                placeholder="e.g. john@yourcompany.co.uk"
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address (e.g. name@domain.co.uk)',
                  },
                  maxLength: { value: 150, message: 'Email address cannot exceed 150 characters' },
                })}
                className={`w-full bg-white border ${
                  errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-[#CBD5E1] focus:border-[#101946] focus:ring-[#101946]/10'
                } rounded-xl px-4 py-3.5 text-[#101946] placeholder-gray-400 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 disabled:bg-gray-50`}
              />
              {errors.email && (
                <p id="email-error" role="alert" className="text-xs text-red-500 mt-1.5 font-semibold">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-bold uppercase tracking-wider text-[#101946] mb-2"
              >
                Phone Number <span className="text-xs font-normal text-[#64748B] lowercase">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                disabled={submitting}
                placeholder="e.g. +44 7123 456789"
                aria-invalid={errors.phone ? 'true' : 'false'}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                {...register('phone', {
                  maxLength: { value: 30, message: 'Phone number cannot exceed 30 characters' },
                  pattern: {
                    value: /^[0-9+\s\-()]{0,30}$/,
                    message: 'Please enter a valid phone number',
                  },
                })}
                className={`w-full bg-white border ${
                  errors.phone ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-[#CBD5E1] focus:border-[#101946] focus:ring-[#101946]/10'
                } rounded-xl px-4 py-3.5 text-[#101946] placeholder-gray-400 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 disabled:bg-gray-50`}
              />
              {errors.phone && (
                <p id="phone-error" role="alert" className="text-xs text-red-500 mt-1.5 font-semibold">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Service Interested In */}
          <div>
            <label
              htmlFor="service"
              className="block text-xs font-bold uppercase tracking-wider text-[#101946] mb-2"
            >
              Service Interested In <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <select
              id="service"
              disabled={submitting}
              aria-required="true"
              aria-invalid={errors.service ? 'true' : 'false'}
              aria-describedby={errors.service ? 'service-error' : undefined}
              {...register('service', {
                required: 'Please select a service you are interested in',
              })}
              className={`w-full bg-white border ${
                errors.service ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-[#CBD5E1] focus:border-[#101946] focus:ring-[#101946]/10'
              } rounded-xl px-4 py-3.5 text-[#101946] focus:outline-none focus:ring-2 transition-all cursor-pointer disabled:opacity-60 disabled:bg-gray-50`}
            >
              <option value="">Select a Service...</option>
              {DEFAULT_SERVICES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.service && (
              <p id="service-error" role="alert" className="text-xs text-red-500 mt-1.5 font-semibold">
                {errors.service.message}
              </p>
            )}
          </div>

          {/* Row 4: Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-xs font-bold uppercase tracking-wider text-[#101946] mb-2"
            >
              Message <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <textarea
              id="message"
              rows={4}
              disabled={submitting}
              placeholder="Tell us about your brand, current goals, and where you would like our help..."
              aria-required="true"
              aria-invalid={errors.message ? 'true' : 'false'}
              aria-describedby={errors.message ? 'message-error' : undefined}
              {...register('message', {
                required: 'Please tell us a little about your project or enquiry',
                minLength: { value: 5, message: 'Message must be at least 5 characters' },
                maxLength: { value: 3000, message: 'Message cannot exceed 3000 characters' },
              })}
              className={`w-full bg-white border ${
                errors.message ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-[#CBD5E1] focus:border-[#101946] focus:ring-[#101946]/10'
              } rounded-xl px-4 py-3.5 text-[#101946] placeholder-gray-400 focus:outline-none focus:ring-2 transition-all resize-none disabled:opacity-60 disabled:bg-gray-50`}
            />
            {errors.message && (
              <p id="message-error" role="alert" className="text-xs text-red-500 mt-1.5 font-semibold">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="btn-submit-consultation"
            disabled={submitting}
            aria-busy={submitting}
            className="w-full bg-[#B8FF00] hover:bg-[#A3E600] text-[#101946] font-extrabold text-base py-4 rounded-xl shadow-lg shadow-[#B8FF00]/25 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>Submitting Consultation Request...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-[#101946]" aria-hidden="true" />
                <span>Book Free Consultation</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ConsultationForm;

