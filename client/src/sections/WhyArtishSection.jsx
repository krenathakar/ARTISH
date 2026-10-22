import React from 'react';

const whyCards = [
  {
    title: 'Creative Storytelling',
    description: "Every business has a story. We frame yours in a way audiences can't scroll past.",
  },
  {
    title: 'Fast Delivery',
    description: 'Briefed Monday, posted by Friday. Speed without compromising quality.',
  },
  {
    title: 'Results Driven',
    description: 'We track reach, engagement, leads and footfall — not just vanity metrics.',
  },
  {
    title: 'Personal Support',
    description: 'Talk directly to the people making your content. No middlemen, ever.',
  },
];

export const WhyArtishSection = () => {
  return (
    <section className="bg-[#F7F8FA] py-24 border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#101946] tracking-tight">
            Why businesses choose Artish
          </h2>
          <p className="text-base sm:text-lg text-[#64748B]">
            We bridge the gap between creative storytelling and real commercial growth.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          {whyCards.map((card) => {
            return (
              <div
                key={card.title}
                className="bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-xs hover:shadow-xl hover:border-[#CBD5E1] transition-all duration-300 group"
              >
                <h3 className="text-xl font-extrabold text-[#101946] mb-3">
                  {card.title}
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyArtishSection;
