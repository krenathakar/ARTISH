import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Discovery & Planning',
    description: 'Free consultation, brand audit and content strategy aligned with your goals.',
  },
  {
    number: '02',
    title: 'Content Production',
    description: 'On-location filming and photography by our in-house creative team.',
  },
  {
    number: '03',
    title: 'Editing & Optimisation',
    description: 'Cuts, captions, sound design and platform-specific formats.',
  },
  {
    number: '04',
    title: 'Publishing & Growth',
    description: 'Scheduling, posting and ongoing optimisation for reach and conversions.',
  },
];

export const ProcessSection = () => {
  return (
    <section className="bg-white py-24 border-b border-[#E2E8F0] text-[#101946]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            How we create{' '}
            <span className="text-[#101946] bg-[#B8FF00] px-3 py-0.5 rounded-xl inline-block border border-[#B8FF00]">
              content
            </span>{' '}
            <span>that converts</span>
          </h2>
          <p className="text-base sm:text-lg text-[#64748B]">
            A repeatable four-step system that gives you premium output every single month.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-[#F7F8FA] rounded-3xl p-8 border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-white hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div>
                {/* Step Number Badge */}
                <div className="text-4xl font-black text-[#101946] mb-6 flex items-center justify-between">
                  <span>{step.number}</span>
                  <div className="w-8 h-1 bg-gray-300 rounded-full group-hover:bg-[#B8FF00] transition-colors" />
                </div>

                <h3 className="text-xl font-bold text-[#101946] mb-3">
                  {step.title}
                </h3>

                <p className="text-sm text-[#64748B] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
