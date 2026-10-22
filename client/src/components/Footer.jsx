import React from 'react';
import { InstagramIcon, YoutubeIcon, FacebookIcon, TiktokIcon } from './BrandIcons';
import { useSettings } from '../context/SettingsContext';

export const Footer = () => {
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

  return (
    <footer className="bg-[#101946] text-white pt-16 pb-8 border-t border-[#1A2355]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#1A2355]">
          {/* Brand Col */}
          <div className="space-y-4 text-left">
            <a href="#home" className="inline-block">
              <img
                src="/artish-logo.png"
                alt="Artish UK logo"
                className="h-10 w-auto"
              />
            </a>
            <p className="text-gray-400 text-sm leading-relaxed">
              {settings.footer_tagline ||
                'Artish UK helps restaurants, events and small businesses grow through professional content creation, social media management and creative storytelling.'}
            </p>
            <div className="flex items-center text-xs text-gray-400">
              <span>{settings.location || 'United Kingdom · Serving nationwide'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h4 className="text-[#B8FF00] font-bold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              {[
                { name: 'Home', href: '#home' },
                { name: 'Services', href: '#services' },
                { name: 'About Us', href: '#about' },
                { name: 'Testimonials', href: '#testimonials' },
                { name: 'Book Consultation', href: '#contact' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="hover:text-[#B8FF00] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Col */}
          <div className="text-[#FFFFFF] text-left">
            <h4 className="text-[#B8FF00] font-bold text-sm uppercase tracking-wider mb-4">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>Content Creation</li>
              <li>Social Media Management</li>
              <li>Instagram Reels</li>
              <li>Podcast Production</li>
              <li>Event Coverage</li>
              <li>Meta Advertising</li>
              <li>Branding</li>
            </ul>
          </div>

          {/* Connect & Socials */}
          <div className="text-left">
            <h4 className="text-[#B8FF00] font-bold text-sm uppercase tracking-wider mb-4">
              Connect With Us
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Follow our latest work and social content engines across platforms.
            </p>
            <div className="flex items-center gap-3">
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram — Artish"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-[#101946] hover:bg-[#B8FF00] transition-all"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
              {settings.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube — Artish"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-[#101946] hover:bg-[#B8FF00] transition-all"
                >
                  <YoutubeIcon className="w-5 h-5" />
                </a>
              )}
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook — Artish"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-[#101946] hover:bg-[#B8FF00] transition-all"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
              )}
              {settings.tiktok_url && (
                <a
                  href={settings.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok — Artish"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-[#101946] hover:bg-[#B8FF00] transition-all"
                >
                  <TiktokIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 Artish UK. All Rights Reserved. Made with care in the United Kingdom.</p>
          <div className="flex items-center gap-6">
            <a href="/privacy-policy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-gray-300 transition-colors">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
