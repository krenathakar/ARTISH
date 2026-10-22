import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

export const HeroSection = () => {
  const { settings } = useSettings();

  const handleNavClick = (href) => {
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Stagger Container Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen bg-black text-white pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center overflow-hidden"
    >
      {/* Background Video - Original natural colors, no blue filter, no overlay */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        style={{ filter: 'none', opacity: 1 }}
        src="/videos/bridge.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Main Content Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <motion.div
          className="max-w-3xl lg:max-w-4xl space-y-6 sm:space-y-8 text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 1. Small Eyebrow Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-white shadow-lg">
              <span className="tracking-wide uppercase">
                {settings.hero_badge || 'UK DIGITAL MARKETING & CONTENT AGENCY'}
              </span>
            </div>
          </motion.div>

          {/* 2. Main H1 Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight"
            style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.7), 0 4px 20px rgba(0, 0, 0, 0.5)' }}
          >
            Content that <br />
            brings{' '}
            <span
              className="relative inline-block text-[#101946] bg-[#B8FF00] px-3.5 py-1 rounded-2xl transform -rotate-1 shadow-xl border border-[#B8FF00]"
              style={{ textShadow: 'none' }}
            >
              customers.
            </span>
          </motion.h1>

          {/* 3. Supporting SEO Text */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-white font-normal leading-relaxed max-w-xl"
            style={{ textShadow: '0 1px 8px rgba(0, 0, 0, 0.8), 0 2px 16px rgba(0, 0, 0, 0.6)' }}
          >
            {settings.hero_subtext ||
              'We help restaurants, events and growing businesses grow through professional content creation, social media management and creative storytelling.'}
          </motion.p>

          {/* 4. Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
          >
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="inline-flex items-center justify-center bg-[#B8FF00] hover:bg-[#A3E600] text-[#101946] font-extrabold text-base px-8 py-4 rounded-full transition-all duration-300 shadow-[0_0_25px_rgba(184,255,0,0.35)] transform hover:-translate-y-1"
            >
              <span>Book Free Consultation</span>
            </a>

            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#services');
              }}
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/25 font-bold text-base px-7 py-4 rounded-full transition-all duration-300 shadow-sm"
            >
              <span>View Our Work</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
