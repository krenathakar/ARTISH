import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col justify-between">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-36 pb-20 text-left space-y-6">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#101946]">Terms & Conditions</h1>
        <p className="text-sm text-gray-500">Last updated: January 2026</p>
        
        <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] space-y-4 text-sm text-[#64748B] leading-relaxed">
          <p>
            Welcome to <strong>Artish UK</strong>. By accessing our website or engaging our marketing, video production, and social media services, you agree to these Terms and Conditions.
          </p>

          <h3 className="text-lg font-extrabold text-[#101946]">1. Services & Proposals</h3>
          <p>
            All custom production retainers, content shoot deliverables, turnaround timelines, and pricing will be specified in an agreed proposal or invoice.
          </p>

          <h3 className="text-lg font-extrabold text-[#101946]">2. Intellectual Property</h3>
          <p>
            Upon full payment of agreed project fees, clients receive usage rights for final edited videos, photography, and campaign assets.
          </p>

          <h3 className="text-lg font-extrabold text-[#101946]">3. Revisions & Turnaround</h3>
          <p>
            Standard reels and social content are typically delivered within 5 working days. Events and podcasts within 7-10 working days.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsPage;
