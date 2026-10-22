import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const AboutSection = () => {
  const shouldReduceMotion = useReducedMotion();

  const handleScrollTo = (targetId) => {
    const id = targetId.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      const offset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="about"
      className="bg-white py-20 sm:py-28 border-b border-[#E2E8F0]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-8"
        >
          {/* Small Label */}
          <div className="inline-flex items-center justify-center">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#11183F] px-4 py-1.5 rounded-full bg-[#F7F8FA] border border-[#E2E8F0]">
              ABOUT ARTISH
            </span>
          </div>

          {/* Heading & Subheading */}
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#11183F] tracking-tight leading-[1.12]">
              We Are Artish.
            </h2>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#11183F]/90 tracking-tight">
              We Create{' '}
              <span className="relative inline-block bg-[#C6FF00] text-[#11183F] px-2.5 sm:px-3 py-0.5 rounded-lg font-black shadow-xs">
                Artists
              </span>{' '}
              for Your Business.
            </h3>
          </div>

          {/* Description Paragraphs */}
          <div className="space-y-4 text-base sm:text-lg text-[#64748B] leading-relaxed font-normal max-w-2xl mx-auto">
            <p>
              Every business has a story. We turn it into a face people recognise, a personality people connect with and a brand people remember.
            </p>
            <p>
              At Artish, we believe your business deserves more than just posts on social media. It deserves its own identity, its own voice and its own way of standing out.
            </p>
            <p>
              We create content that brings your business to life. From scroll-stopping Reels to creative campaigns, we help your brand show up, stand out and connect with the right audience.
            </p>
          </div>

          {/* Highlighted Closing Statement */}
          <div className="pt-2">
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#11183F]">
              You build your business. We make it{' '}
              <span className="relative inline-block font-extrabold text-[#11183F] border-b-2 border-[#C6FF00] pb-0.5">
                unforgettable
              </span>.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-3">
            <button
              onClick={() => handleScrollTo('#contact')}
              className="inline-flex items-center gap-2 bg-[#C6FF00] hover:bg-[#B5EA00] text-[#11183F] font-extrabold text-base px-8 py-3.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Work With Us</span>
              <span aria-hidden="true" className="text-lg leading-none">→</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
