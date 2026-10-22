import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import API from '../services/api';

const fallbackFaqs = [
  {
    id: 1,
    question: 'How much does content creation cost?',
    answer: "Our packages start from £350/month and scale based on volume, locations and turnaround. After a free consultation we'll send a clear, fixed quote.",
  },
  {
    id: 2,
    question: 'Do you work with small businesses?',
    answer: 'Absolutely — small and independent businesses are our specialty. We have packages designed specifically for cafes, takeaways and local brands.',
  },
  {
    id: 3,
    question: 'Do you offer monthly packages?',
    answer: 'Yes. Most clients sit on a monthly retainer covering shoots, edits and posting. We also offer one-off projects for events and launches.',
  },
  {
    id: 4,
    question: 'Can you manage our social media?',
    answer: 'Yes. We can handle strategy, posting, captions, hashtags, engagement and reporting end-to-end.',
  },
  {
    id: 5,
    question: 'Do you travel across the UK?',
    answer: 'We do. We regularly travel for events, restaurants and clients across England — travel costs are always agreed up front.',
  },
  {
    id: 6,
    question: 'How quickly can projects be completed?',
    answer: 'Most reels and social content are delivered within 5 working days. Events and podcasts within 7-10 days. Rush turnaround available on request.',
  },
];

export const FaqSection = () => {
  const [faqs, setFaqs] = useState(fallbackFaqs);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await API.get('/faqs');
        if (res.data && res.data.length > 0) {
          setFaqs(res.data);
        }
      } catch (err) {
        console.warn('Using fallback FAQs data:', err.message);
      }
    };
    fetchFaqs();
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-[#F7F8FA] py-24 border-b border-[#E2E8F0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <div className="mb-14 space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#101946] tracking-tight">
            Frequently asked questions
          </h2>
          <p className="text-base text-[#64748B]">
            Everything you need to know about working with Artish UK.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 text-left">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id || faq.question}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-6 text-left flex items-center justify-between font-extrabold text-base sm:text-lg text-[#101946] hover:text-[#101946] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#101946] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#101946]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm sm:text-base text-[#64748B] leading-relaxed border-t border-gray-100 pt-4 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
