import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../sections/HeroSection';
import PartnersSection from '../sections/PartnersSection';
import ServicesSection from '../sections/ServicesSection';
import RecentReelsSection from '../sections/RecentReelsSection';
import AboutSection from '../sections/AboutSection';
import WhyArtishSection from '../sections/WhyArtishSection';
import ProcessSection from '../sections/ProcessSection';
import ResultsSection from '../sections/ResultsSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import ContactSection from '../sections/ContactSection';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#F7F8FA] selection:bg-[#B8FF00] selection:text-[#101946]">
      <Navbar />
      <main>
        <HeroSection />
        <PartnersSection />
        <AboutSection />
        <ServicesSection />
        <RecentReelsSection />
        <WhyArtishSection />
        <ProcessSection />
        <ResultsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default HomePage;
