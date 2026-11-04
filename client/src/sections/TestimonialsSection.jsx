import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import API, { getAssetUrl } from '../services/api';

const fallbackTestimonials = [
  {
    id: 1,
    name: 'Darshan Patel',
    company: 'Managing Director, Shayona',
    quote: `Artish has completely transformed how we present Shayona online. Their creativity, quick turnaround and understanding of our brand has helped us reach thousands of new customers across London.

From high-impact reels to consistent social media management, the results speak for themselves. Footfall is up, engagement is higher than ever, and our brand finally looks the way it deserves to.`,
    rating: 5,
    image: '/images/partners/shayona-restaurant.jpg',
  },
  {
    id: 2,
    name: 'Tushar Patel',
    company: 'Owner, HK Furniture',
    quote: `Working with Artish was one of the best marketing decisions we made this year. They took the time to understand our bespoke furniture business and created content that truly showcases the quality of our craftsmanship.

Our enquiries have significantly increased, and customers regularly mention seeing our videos before visiting the showroom. Professional, reliable and exceptionally talented.`,
    rating: 5,
    image: null,
  },
  {
    id: 3,
    name: 'Priya Patel',
    company: 'Shayona Restaurant',
    quote: 'Artish transformed our online presence. Reels they made for us went viral and brought a packed restaurant every weekend.',
    rating: 5,
    image: '/images/partners/shayona-restaurant.jpg',
  },
  {
    id: 4,
    name: 'Marcus Vance',
    company: 'Soundwave Studio',
    quote: 'The podcast production quality is outstanding. Our engagement multiplied by 3x within two months of working with Artish UK.',
    rating: 5,
    image: null,
  },
  {
    id: 5,
    name: 'Rahul Sharma',
    company: 'Rajdhani Express',
    quote: 'Fast, creative, and extremely results-driven. They understand food marketing better than anyone else in the UK.',
    rating: 5,
    image: '/images/partners/rajdhani-express.jpg',
  },
];

const getInitials = (name) => {
  if (!name) return 'A';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState({});

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
  const hasValidImage = activeTestimonial?.image && !failedImages[activeTestimonial.id];

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
            {/* Star Rating */}
            <div className="flex items-center gap-1 mb-5">
              {Array.from({ length: activeTestimonial.rating || 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-lg sm:text-2xl font-bold text-[#101946] leading-relaxed mb-8 whitespace-pre-line">
              "{activeTestimonial.quote}"
            </blockquote>

            {/* Client Profile */}
            <div className="flex items-center justify-between pt-6 border-t border-[#E2E8F0]">
              <div className="flex items-center gap-4">
                {hasValidImage ? (
                  <img
                    src={getAssetUrl(activeTestimonial.image)}
                    alt={activeTestimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#101946] shrink-0 bg-white"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [activeTestimonial.id]: true }))
                    }
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-full bg-[#101946] text-[#B8FF00] font-extrabold text-base flex items-center justify-center border-2 border-[#101946] shrink-0 tracking-wider shadow-sm select-none"
                    aria-label={activeTestimonial.name}
                  >
                    {getInitials(activeTestimonial.name)}
                  </div>
                )}
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
