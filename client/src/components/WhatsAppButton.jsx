import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const WhatsAppButton = () => {
  const { settings } = useSettings();

  // If no WhatsApp URL or number is set in settings, do not render floating button
  if (!settings.whatsapp_url && !settings.phone) {
    return null;
  }

  const getWhatsAppLink = () => {
    if (settings.whatsapp_url) return settings.whatsapp_url;
    const cleanPhone = settings.phone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}`;
  };

  return (
    <a
      href={getWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-sm"
    >
      <MessageSquare className="w-5 h-5 fill-current" />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
};

export default WhatsAppButton;
