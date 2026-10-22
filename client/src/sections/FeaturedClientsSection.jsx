import React, { useState, useEffect } from 'react';
import API from '../services/api';

const fallbackClients = [
  {
    id: 1,
    name: 'Shayona Restaurant',
    category: 'Indian Cuisine • Restaurant',
    description: 'Weekly content engine that grew online orders and brought hundreds of new customers through the door.',
    initials: 'SR',
    tags: ['Content', 'Reels', 'Social Media'],
  },
  {
    id: 2,
    name: 'Rajdhani Express',
    category: 'Quick Service Restaurant',
    description: 'Brand refresh and paid social campaign that delivered consistent footfall during off-peak hours.',
    initials: 'RE',
    tags: ['Food Photography', 'Meta Ads'],
  },
  {
    id: 3,
    name: 'PalindromeX',
    category: 'Tech & Personal Brand',
    description: 'End-to-end podcast production from studio sessions to short-form clips and channel growth.',
    initials: 'PX',
    tags: ['Podcast Production', 'YouTube'],
  },
  {
    id: 4,
    name: 'Community Events',
    category: 'Cultural & Charity Events',
    description: 'Documentary-style coverage of large UK community events with rapid same-week delivery.',
    initials: 'CE',
    tags: ['Event Coverage', 'Drone', 'Video'],
  },
];

export const FeaturedClientsSection = () => {
  const [clients, setClients] = useState(fallbackClients);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await API.get('/clients?featured=true');
        if (res.data && res.data.length > 0) {
          setClients(res.data);
        }
      } catch (err) {
        console.warn('Using fallback clients data:', err.message);
      }
    };
    fetchClients();
  }, []);

  return (
    <section id="clients" className="bg-[#F7F8FA] py-24 border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-[#101946] font-bold text-xs tracking-widest uppercase bg-[#E2E8F0] px-4 py-1.5 rounded-full inline-block">
            <span>CLIENT SPOTLIGHT</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#101946] tracking-tight">
            Brands we've worked with
          </h2>
          <p className="text-base sm:text-lg text-[#64748B]">
            Long-term partnerships built on consistency, creative content, and real growth.
          </p>
        </div>

        {/* Client Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {clients.map((client) => {
            const tags = client.tags || [client.category.split('•')[0].trim()];
            return (
              <div
                key={client.id || client.name}
                className="bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    {/* Client Initials / Logo */}
                    <div className="w-14 h-14 rounded-2xl bg-[#101946] text-[#B8FF00] font-black text-xl flex items-center justify-center shadow-md">
                      {client.initials || client.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-[#101946]">
                        {client.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                        {client.category}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                    {client.description}
                  </p>
                </div>

                {/* Service Tag Pills */}
                <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-bold text-[#101946] bg-[#F7F8FA] px-3 py-1 rounded-full border border-[#E2E8F0]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedClientsSection;
