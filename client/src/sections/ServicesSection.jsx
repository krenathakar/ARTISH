import React from 'react';
import {
  Users,
  Camera,
  Calendar,
  Mic,
  Megaphone,
  Star,
  ArrowRight,
} from 'lucide-react';

const services = [
  {
    id: 1,
    title: 'Social Media Management',
    tagline: 'Turn followers into a community.',
    description:
      'We manage your social presence from strategy to posting, keeping your brand consistent, active and ready to grow.',
    icon: Users,
  },
  {
    id: 2,
    title: 'Content Creation',
    tagline: 'Make your brand impossible to scroll past.',
    description:
      'Professional photography, video and creative content designed to make your business stand out online.',
    icon: Camera,
  },
  {
    id: 3,
    title: 'Event Shooting',
    tagline: 'Your event deserves more than memories.',
    description:
      'We capture the energy, people and moments that turn your event into content worth sharing.',
    icon: Calendar,
  },
  {
    id: 4,
    title: 'Podcast Production',
    tagline: 'Your ideas. Your voice. Your story.',
    description:
      'From recording and editing to polished social clips, we turn conversations into professional podcast content.',
    icon: Mic,
  },
  {
    id: 5,
    title: 'Media Campaigns',
    tagline: 'Put your brand in the right places.',
    description:
      'We plan and create targeted media campaigns that connect your brand with the right audience across digital platforms.',
    icon: Megaphone,
  },
  {
    id: 6,
    title: 'Influencer Marketing',
    tagline: 'The right creator. The right audience.',
    description:
      'We connect brands with relevant creators to build authentic partnerships, reach new audiences and drive engagement.',
    icon: Star,
  },
];

export const ServicesSection = () => {
  const handleInquire = (serviceTitle) => {
    // 1. Dispatch custom event for React state preselection
    window.dispatchEvent(
      new CustomEvent('select-service', { detail: serviceTitle })
    );

    // 2. Direct DOM fallback for native select input
    const selectEl = document.querySelector('select[name="service"]');
    if (selectEl) {
      selectEl.value = serviceTitle;
      selectEl.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 3. Smooth scroll to contact consultation section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const offset = 80;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="services" className="bg-[#F7F8FA] py-24 border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl lg:max-w-5xl mx-auto mb-16 space-y-4 sm:space-y-5 px-2">
          {/* Main Heading */}
          <h2 className="text-2xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-extrabold text-[#101946] tracking-tight leading-[1.25] text-balance">
            <span>Everything your brand needs to </span>
            <span className="relative inline-block text-[#101946] bg-[#B8FF00] px-2.5 sm:px-3 py-0.5 rounded-lg sm:rounded-xl shadow-xs">
              stand out.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-2xl mx-auto text-balance">
            From content creation and social media management to marketing campaigns and event production, we bring your brand closer to the people who matter.
          </p>
        </div>

        {/* 6-Card Services Grid: 3 columns desktop, 2 columns tablet, 1 column mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl p-8 sm:p-9 border border-[#E2E8F0] shadow-xs hover:shadow-2xl hover:border-[#B8FF00] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Lime-green line icon in dark navy rounded-square container */}
                  <div className="w-14 h-14 rounded-2xl bg-[#101946] flex items-center justify-center text-[#B8FF00] mb-6 shadow-md shadow-[#101946]/10 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-[#B8FF00] stroke-[1.8]" />
                  </div>

                  {/* Service Title */}
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#101946] mb-2 tracking-tight group-hover:text-[#101946] transition-colors">
                    {service.title}
                  </h3>

                  {/* Tagline */}
                  <p className="text-sm font-bold text-[#101946]/80 mb-3 leading-snug">
                    {service.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Inquire Link with Right Arrow */}
                <div className="pt-5 border-t border-[#E2E8F0] mt-auto">
                  <button
                    onClick={() => handleInquire(service.title)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#101946] hover:text-[#101946] transition-all duration-200 cursor-pointer w-full text-left group/btn"
                  >
                    <span>Inquire about this</span>
                    <ArrowRight className="w-4 h-4 text-[#101946] group-hover:translate-x-1.5 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
