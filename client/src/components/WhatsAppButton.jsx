import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const DEFAULT_PHONE = '+44 7552 782519';
const DEFAULT_PREFILLED = 'Hello Artish UK, I would like to enquire about your services.';
const DEFAULT_WHATSAPP = `https://wa.me/447552782519?text=${encodeURIComponent(DEFAULT_PREFILLED)}`;

export const WhatsAppButton = () => {
  const { settings } = useSettings();

  const getWhatsAppLink = () => {
    if (settings?.whatsapp_url && settings.whatsapp_url.trim()) {
      return settings.whatsapp_url;
    }
    const phone = settings?.phone || DEFAULT_PHONE;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone || '447552782519'}?text=${encodeURIComponent(DEFAULT_PREFILLED)}`;
  };

  return (
    <a
      href={getWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Artish UK on WhatsApp (+44 7552 782519)"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 font-bold text-sm tracking-wide"
    >
      <MessageSquare className="w-5 h-5 fill-current" />
      <span className="inline">Chat on WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;
