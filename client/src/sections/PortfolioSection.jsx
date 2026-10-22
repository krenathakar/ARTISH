import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { InstagramIcon } from '../components/BrandIcons';
import API from '../services/api';

const fallbackPortfolio = [
  {
    id: 1,
    title: 'Plated to perfection',
    category: 'Restaurants',
    description: 'High-definition food videography highlighting signature dishes and ambient dining setup.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    instagramUrl: 'https://www.instagram.com/artish.uk',
  },
  {
    id: 2,
    title: 'A night to remember',
    category: 'Events',
    description: 'Capturing live energy, stage performance, and crowd moments for a major cultural festival.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    instagramUrl: 'https://www.instagram.com/artish.uk',
  },
  {
    id: 3,
    title: 'Studio Sessions',
    category: 'Podcasts',
    description: 'Multi-camera podcast recording studio setup with crisp audio and short social snippets.',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80',
    instagramUrl: 'https://www.instagram.com/artish.uk',
  },
  {
    id: 4,
    title: 'City skyline series',
    category: 'Community Projects',
    description: 'Urban visual storytelling showcasing local architecture, vibrant streets and community hubs.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
    instagramUrl: 'https://www.instagram.com/artish.uk',
  },
  {
    id: 5,
    title: 'Behind the launch',
    category: 'Social Media Campaigns',
    description: 'Strategic short-form teaser campaign driving grand opening queues and viral social reach.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    instagramUrl: 'https://www.instagram.com/artish.uk',
  },
  {
    id: 6,
    title: "Chef's table series",
    category: 'Restaurants',
    description: 'Authentic kitchen prep storytelling capturing master chefs in their element.',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1000&q=80',
    instagramUrl: 'https://www.instagram.com/artish.uk',
  },
];

const categories = [
  'All',
  'Restaurants',
  'Events',
  'Podcasts',
  'Social Media Campaigns',
  'Community Projects',
];

export const PortfolioSection = () => {
  const [projects, setProjects] = useState(fallbackPortfolio);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await API.get('/portfolio');
        if (res.data && res.data.length > 0) {
          setProjects(res.data);
        }
      } catch (err) {
        console.warn('Using fallback portfolio data:', err.message);
      }
    };
    fetchPortfolio();
  }, []);

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="portfolio" className="bg-white py-24 border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="text-[#101946] font-bold text-xs tracking-widest uppercase bg-[#F7F8FA] px-4 py-1.5 rounded-full border border-[#E2E8F0] shadow-xs">
            PORTFOLIO
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#101946] tracking-tight">
            Our work,{' '}
            <span className="text-[#101946] bg-[#B8FF00] px-3 py-0.5 rounded-xl inline-block border border-[#B8FF00]">
              our pride.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#64748B]">
            Real campaigns, real businesses, real results. A selection of recent projects from across the UK.
          </p>
        </div>

        {/* Dynamic Category Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-[#101946] text-[#B8FF00] shadow-md scale-105'
                  : 'bg-[#F7F8FA] text-gray-700 border border-[#E2E8F0] hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id || project.slug}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-[#F7F8FA] border border-[#E2E8F0] hover:border-gray-300 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between"
            >
              <div className="relative h-64 overflow-hidden bg-black">
                <img
                  src={project.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                <span className="absolute top-4 left-4 text-[10px] font-extrabold text-[#101946] bg-[#B8FF00] px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  {project.category}
                </span>
              </div>

              <div className="p-6 text-left flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-[#101946] mb-2 group-hover:text-[#101946] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#64748B] line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-bold text-[#101946]">
                  <span>View Details</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Detail View */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-[#E2E8F0] rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-left relative shadow-2xl text-[#101946]">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 text-gray-700 hover:text-black hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-extrabold text-[#101946] bg-[#B8FF00] px-3 py-1 rounded-full uppercase tracking-wider">
              {selectedProject.category}
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold mt-4 mb-3">
              {selectedProject.title}
            </h3>

            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              className="w-full h-64 object-cover rounded-2xl mb-4 border border-[#E2E8F0]"
            />

            <p className="text-[#64748B] text-sm leading-relaxed mb-6">
              {selectedProject.description}
            </p>

            <div className="flex items-center gap-4 pt-4 border-t border-[#E2E8F0]">
              {selectedProject.instagramUrl && (
                <a
                  href={selectedProject.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#101946] text-[#B8FF00] font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#101946]/90 transition-colors"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>View on Instagram</span>
                </a>
              )}
              <button
                onClick={() => setSelectedProject(null)}
                className="bg-gray-100 text-gray-800 font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PortfolioSection;
