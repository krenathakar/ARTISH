import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../services/api';

const fallbackTestimonials = [
  {
    id: 1,
    name: 'Priya Patel',
    company: 'Shayona Restaurant',
    quote: 'Artish transformed our online presence. Reels they made for us went viral and brought a packed restaurant every weekend.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2,
    name: 'Marcus Vance',
    company: 'Soundwave Studio',
    quote: 'The podcast production quality is outstanding. Our engagement multiplied by 3x within two months of working with Artish UK.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 3,
    name: 'Rahul Sharma',
    company: 'Rajdhani Express',
    quote: 'Fast, creative, and extremely results-driven. They understand food marketing better than anyone else in the UK.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
];

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await API.get('/testimonials');
        if (res.data && res.data.length > 0) {
          setTestimonials(res.data);
        }
      } catch (err) {
        console.warn('Using fallback testimonials data:', err.message);
      }
    };
    fetchTestimonials();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const activeTestimonial = testimonials[currentIndex] || testimonials[0];

  return (
    <section id="testimonials" className="bg-[#F7F8FA] py-24 border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#101946] tracking-tight">
            What our clients say
          </h2>
          <p className="text-base sm:text-lg text-[#64748B]">
            Hear directly from the business owners we work with every single month.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="max-w-4xl mx-auto relative">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E2E8F0] shadow-xl relative overflow-hidden text-left">
            {/* Quote */}
            <blockquote className="text-lg sm:text-2xl font-bold text-[#101946] leading-relaxed mb-8">
              "{activeTestimonial.quote}"
            </blockquote>

            {/* Client Profile */}
            <div className="flex items-center justify-between pt-6 border-t border-[#E2E8F0]">
              <div className="flex items-center gap-4">
                <img
                  src={
                    activeTestimonial.image ||
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
                  }
                  alt={activeTestimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#101946]"
                />
                <div>
                  <h4 className="text-base font-extrabold text-[#101946]">
                    {activeTestimonial.name}
                  </h4>
                  <p className="text-xs font-semibold text-[#64748B]">
                    {activeTestimonial.company}
                  </p>
                </div>
              </div>

              {/* Slider Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-full bg-[#101946] text-[#B8FF00] hover:bg-[#101946]/90 transition-all shadow-sm cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-3 rounded-full bg-[#101946] text-[#B8FF00] hover:bg-[#101946]/90 transition-all shadow-sm cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'w-8 bg-[#101946]' : 'w-2.5 bg-[#CBD5E1]'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
