import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col justify-between">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-36 pb-20 text-left space-y-6">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#101946]">Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated: January 2026</p>
        
        <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] space-y-4 text-sm text-[#64748B] leading-relaxed">
          <p>
            At <strong>Artish UK</strong>, we are committed to respecting and protecting your privacy. This Privacy Policy explains how we handle personal data collected when you submit consultation requests, interact with our website, or work with us.
          </p>
          
          <h3 className="text-lg font-extrabold text-[#101946]">1. Information We Collect</h3>
          <p>
            When you complete our consultation booking form, we collect your full name, business name, email address, phone number, and service interest.
          </p>

          <h3 className="text-lg font-extrabold text-[#101946]">2. How We Use Your Information</h3>
          <p>
            We strictly use your information to contact you regarding your consultation request, deliver fixed quotes, coordinate shoot schedules, and provide agency services. We never sell your personal data to third parties.
          </p>

          <h3 className="text-lg font-extrabold text-[#101946]">3. Data Protection & Security</h3>
          <p>
            We maintain secure data storage standards and encryption for all user records and database interactions.
          </p>

          <h3 className="text-lg font-extrabold text-[#101946]">4. Contact</h3>
          <p>
            For any data privacy inquiries, please contact us directly at <a href="mailto:info@artishmedia.com" className="text-[#101946] font-bold hover:underline">info@artishmedia.com</a> or call <a href="tel:+447552782519" className="text-[#101946] font-bold hover:underline">+44 7552 782519</a>.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
