import React from 'react';
import { useSettings } from '../context/SettingsContext';

export const ResultsSection = () => {
  const { settings } = useSettings();

  const stats = [
    {
      value: settings.stat_projects || '50+',
      label: 'Projects Completed',
    },
    {
      value: settings.stat_views || '100K+',
      label: 'Content Views Generated',
    },
    {
      value: settings.stat_businesses || '25+',
      label: 'Businesses Supported',
    },
    {
      value: settings.stat_satisfaction || '95%',
      label: 'Client Satisfaction',
    },
  ];

  return (
    <section className="bg-[#101946] py-20 text-white border-b border-[#1A2355]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Content that delivers real results
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 rounded-3xl p-8 border border-white/15 shadow-md backdrop-blur-sm transform hover:-translate-y-1 transition-all"
            >
              <p className="text-4xl sm:text-6xl font-black tracking-tight mb-2 text-[#B8FF00]">
                {stat.value}
              </p>
              <p className="text-sm sm:text-base font-bold text-gray-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
