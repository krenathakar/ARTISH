import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar = () => {
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Determine active section
      const sections = navLinks.map((link) => link.href.replace('#', ''));
      const current = sections.find((section) => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 140 && rect.bottom >= 140;
        }
        return false;
      });

      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
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
    <header className="fixed top-4 sm:top-5 inset-x-0 z-50 px-4 sm:px-6 pointer-events-none">
      {/* Centered Floating Glass Container */}
      <div
        className={`max-w-[1280px] w-[calc(100%-16px)] sm:w-[calc(100%-40px)] mx-auto pointer-events-auto relative transition-all duration-300 rounded-[26px] sm:rounded-[30px] overflow-hidden ${
          isScrolled
            ? 'bg-white/[0.96] backdrop-blur-[24px] border border-white/80 shadow-xl shadow-[#101946]/[0.10] py-2 sm:py-2.5 px-5 sm:px-8'
            : 'bg-white/[0.85] backdrop-blur-[20px] border border-white/50 shadow-lg shadow-[#101946]/[0.06] py-2.5 sm:py-3 px-5 sm:px-8'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* 1. Large Visible Artish Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="flex items-center group shrink-0 py-0.5"
          >
            <img
              src="/artish-logo.png"
              alt="Artish UK logo"
              className="w-[80px] sm:w-[100px] h-auto object-contain transition-transform duration-300 hover:scale-[1.04]"
              loading="eager"
              decoding="async"
            />
          </a>

          {/* 2. Navigation Capsule */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F7F8FA]/90 p-1.5 rounded-full border border-[#E2E8F0] backdrop-blur-md shadow-inner">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ease-out ${
                    isActive
                      ? 'bg-[#101946] text-[#B8FF00] font-bold shadow-sm'
                      : 'text-[#101946] hover:bg-black/5 font-medium'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* 3. Accent Lime CTA Button */}
          <div className="hidden lg:flex items-center shrink-0">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="inline-flex items-center justify-center bg-[#B8FF00] hover:bg-[#A3E600] text-[#101946] font-bold text-sm px-6 py-2.5 sm:py-3 rounded-full transition-all duration-300 shadow-md shadow-[#B8FF00]/25 transform hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 border border-[#B8FF00]"
            >
              <span>Book Free Consultation →</span>
            </a>
          </div>

          {/* 4. Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-2xl text-[#101946] bg-gray-100/80 hover:bg-gray-200/80 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Floating Menu Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-w-[1280px] w-[calc(100%-16px)] sm:w-[calc(100%-40px)] mx-auto pointer-events-auto mt-2 sm:mt-3 bg-white/95 backdrop-blur-2xl rounded-3xl p-5 border border-[#E2E8F0] shadow-2xl space-y-2 animate-fadeIn text-left">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`block px-4 py-3 rounded-2xl text-base transition-colors ${
                  isActive
                    ? 'bg-[#101946] text-[#B8FF00] font-bold shadow-sm'
                    : 'text-[#101946] hover:bg-gray-100 font-semibold'
                }`}
              >
                {link.name}
              </a>
            );
          })}
          <div className="pt-2">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="flex items-center justify-center w-full bg-[#B8FF00] hover:bg-[#A3E600] text-[#101946] font-extrabold text-center py-3.5 rounded-2xl shadow-md border border-[#B8FF00]"
            >
              <span>Book Free Consultation →</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
