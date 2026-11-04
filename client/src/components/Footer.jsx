import React from 'react';
import { Mail, Phone, MessageSquare } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, FacebookIcon, TiktokIcon } from './BrandIcons';
import { useSettings } from '../context/SettingsContext';

const DEFAULT_EMAIL = 'info@artishmedia.com';
const DEFAULT_PHONE = '+44 7552 782519';
const DEFAULT_PHONE_TEL = '+447552782519';
const DEFAULT_WHATSAPP = 'https://wa.me/447552782519?text=Hello%20Artish%20UK%2C%20I%20would%20like%20to%20enquire%20about%20your%20services.';

export const Footer = () => {
  const { settings } = useSettings();

  const businessEmail = settings.business_email || DEFAULT_EMAIL;
  const businessPhone = settings.phone || DEFAULT_PHONE;
  const businessPhoneTel = businessPhone.replace(/[^0-9+]/g, '') || DEFAULT_PHONE_TEL;
  const businessWhatsapp = settings.whatsapp_url || DEFAULT_WHATSAPP;

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
                { name: 'About Us', href: '#about' },
                { name: 'Services', href: '#services' },
                { name: 'Portfolio', href: '#portfolio' },
                { name: 'Contact', href: '#contact' },
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

          {/* Direct Contact & Socials */}
          <div className="text-left space-y-4">
            <h4 className="text-[#B8FF00] font-bold text-sm uppercase tracking-wider">
              Get in Touch
            </h4>
            
            {/* Clickable Phone Link */}
            <div className="space-y-2.5 text-sm">
              <a
                href={`tel:${businessPhoneTel}`}
                className="flex items-center gap-2.5 text-gray-300 hover:text-[#B8FF00] transition-colors group"
                aria-label={`Call Artish UK at ${businessPhone}`}
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#B8FF00] group-hover:text-[#101946] transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Call Us</p>
                  <span className="font-bold text-white group-hover:text-[#B8FF00]">{businessPhone}</span>
                </div>
              </a>

              {/* Clickable Email Link */}
              <a
                href={`mailto:${businessEmail}`}
                className="flex items-center gap-2.5 text-gray-300 hover:text-[#B8FF00] transition-colors group"
                aria-label={`Email Artish UK at ${businessEmail}`}
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#B8FF00] group-hover:text-[#101946] transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Us</p>
                  <span className="font-bold text-white group-hover:text-[#B8FF00]">{businessEmail}</span>
                </div>
              </a>

              {/* WhatsApp Quick Action */}
              <a
                href={businessWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-gray-300 hover:text-[#25D366] transition-colors group"
                aria-label="Chat with Artish UK on WhatsApp"
              >
                <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">WhatsApp</p>
                  <span className="font-bold text-white group-hover:text-[#25D366]">Chat Directly</span>
                </div>
              </a>
            </div>

            {/* Social Icons */}
            <div className="pt-2">
              <p className="text-xs text-gray-400 mb-2 font-semibold">Follow Our Work</p>
              <div className="flex items-center gap-2.5">
                {settings.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram — Artish"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-[#101946] hover:bg-[#B8FF00] transition-all"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                )}
                {settings.youtube_url && (
                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube — Artish"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-[#101946] hover:bg-[#B8FF00] transition-all"
                  >
                    <YoutubeIcon className="w-4 h-4" />
                  </a>
                )}
                {settings.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook — Artish"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-[#101946] hover:bg-[#B8FF00] transition-all"
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                )}
                {settings.tiktok_url && (
                  <a
                    href={settings.tiktok_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok — Artish"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-[#101946] hover:bg-[#B8FF00] transition-all"
                  >
                    <TiktokIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
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
