const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@artish.uk' },
    update: { password: hashedPassword },
    create: {
      name: 'Artish Admin',
      email: 'admin@artish.uk',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created/updated:', admin.email);

  // 2. Seed Site Settings
  const settings = [
    { key: 'business_name', value: 'Artish UK' },
    { key: 'business_email', value: 'info@artishmedia.com' },
    { key: 'instagram_url', value: 'https://www.instagram.com/artish.uk' },
    { key: 'youtube_url', value: 'https://youtube.com/@artishmedia?si=YzOlivVPhrB2GO8h' },
    { key: 'phone', value: '+44 7552 782519' },
    { key: 'whatsapp_url', value: 'https://wa.me/447552782519?text=Hello%20Artish%20UK%2C%20I%20would%20like%20to%20enquire%20about%20your%20services.' },
    { key: 'location', value: 'United Kingdom · Serving nationwide' },
    { key: 'hero_badge', value: 'UK Digital Marketing & Content Agency' },
    { key: 'hero_title', value: 'Content that brings customers.' },
    { key: 'hero_subtext', value: 'We help restaurants, events and small businesses grow through powerful content, social media marketing and creative storytelling.' },
    { key: 'about_heading', value: 'Meet Artish UK' },
    { key: 'about_text_1', value: 'Artish UK helps businesses attract customers through professional content creation, social media management, video production and digital marketing.' },
    { key: 'about_text_2', value: 'We believe every business has a story worth sharing — and every story deserves to be seen.' },
    { key: 'about_text_3', value: 'Our mission is to create content that drives awareness, engagement and growth.' },
    { key: 'about_years_badge', value: '3+ yrs IN THE FIELD' },
    { key: 'stat_projects', value: '50+' },
    { key: 'stat_views', value: '100K+' },
    { key: 'stat_businesses', value: '25+' },
    { key: 'stat_satisfaction', value: '95%' },
    { key: 'footer_tagline', value: 'Artish UK helps restaurants, events and small businesses grow through professional content creation, social media management and creative storytelling.' },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log('✅ Site settings seeded.');

  // 3. Seed Services
  const services = [
    {
      title: 'Content Creation',
      slug: 'content-creation',
      description: 'Professional photography and videography that makes your brand unforgettable.',
      icon: 'Camera',
      sortOrder: 1,
    },
    {
      title: 'Social Media Management',
      slug: 'social-media-management',
      description: 'Consistent posting and audience growth — done for you, monthly.',
      icon: 'Share2',
      sortOrder: 2,
    },
    {
      title: 'Instagram Reels',
      slug: 'instagram-reels',
      description: 'Short form videos engineered for engagement, reach and conversions.',
      icon: 'Video',
      sortOrder: 3,
    },
    {
      title: 'Podcast Production',
      slug: 'podcast-production',
      description: 'Recording, editing and promotion of professional podcasts.',
      icon: 'Mic',
      sortOrder: 4,
    },
    {
      title: 'Event Coverage',
      slug: 'event-coverage',
      description: 'Premium event photography and videography across the UK.',
      icon: 'Calendar',
      sortOrder: 5,
    },
    {
      title: 'Website Design',
      slug: 'website-design',
      description: 'Modern, fast websites that turn visitors into paying customers.',
      icon: 'Globe',
      sortOrder: 6,
    },
    {
      title: 'Meta Advertising',
      slug: 'meta-advertising',
      description: 'Facebook and Instagram ad campaigns built around results.',
      icon: 'Megaphone',
      sortOrder: 7,
    },
    {
      title: 'Branding',
      slug: 'branding',
      description: 'Visual identity and content strategy that aligns with your goals.',
      icon: 'Palette',
      sortOrder: 8,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log('✅ Services seeded.');

  // 4. Seed Clients
  const clientsData = [
    {
      name: 'Shayona Restaurant',
      category: 'Indian Cuisine • Restaurant',
      description: 'Weekly content engine that grew online orders and brought hundreds of new customers through the door.',
      initials: 'SR',
      instagram: 'https://www.instagram.com/artish.uk',
      isFeatured: true,
      sortOrder: 1,
    },
    {
      name: '1947 Restaurant & Bar',
      category: 'Fine Dining & Bar',
      description: 'High-definition culinary videography and event social campaigns.',
      initials: '19',
      instagram: 'https://www.instagram.com/artish.uk',
      isFeatured: true,
      sortOrder: 2,
    },
    {
      name: 'Rajdhani Express',
      category: 'Quick Service Restaurant',
      description: 'Brand refresh and paid social campaign that delivered consistent footfall during off-peak hours.',
      initials: 'RE',
      instagram: 'https://www.instagram.com/artish.uk',
      isFeatured: true,
      sortOrder: 3,
    },
    {
      name: 'GJ5',
      category: 'Restaurant & Lounge',
      description: 'Short-form food reels and monthly social media management.',
      initials: 'GJ',
      instagram: 'https://www.instagram.com/artish.uk',
      isFeatured: true,
      sortOrder: 4,
    },
    {
      name: 'Masala Tea',
      category: 'Cafe & Beverages',
      description: 'Product photography and community engagement campaigns.',
      initials: 'MT',
      instagram: 'https://www.instagram.com/artish.uk',
      isFeatured: true,
      sortOrder: 5,
    },
    {
      name: 'Gujarat No Rankar',
      category: 'Cultural Events',
      description: 'Documentary-style event coverage and festival promo videos.',
      initials: 'GN',
      instagram: 'https://www.instagram.com/artish.uk',
      isFeatured: true,
      sortOrder: 6,
    },
    {
      name: 'Reloit',
      category: 'Tech & Media',
      description: 'End-to-end podcast production and social clip distribution.',
      initials: 'RL',
      instagram: 'https://www.instagram.com/artish.uk',
      isFeatured: true,
      sortOrder: 7,
    },
    {
      name: 'R.K. Salon',
      category: 'Beauty & Lifestyle',
      description: 'Brand storytelling videos and local promotion reels.',
      initials: 'RK',
      instagram: 'https://www.instagram.com/artish.uk',
      isFeatured: true,
      sortOrder: 8,
    },
  ];

  const createdClients = [];
  for (const c of clientsData) {
    const existing = await prisma.client.findFirst({ where: { name: c.name } });
    if (existing) {
      const updated = await prisma.client.update({ where: { id: existing.id }, data: c });
      createdClients.push(updated);
    } else {
      const created = await prisma.client.create({ data: c });
      createdClients.push(created);
    }
  }
  console.log('✅ Clients seeded.');

  // 5. Seed Portfolio Projects
  const portfolioData = [
    {
      title: 'Plated to perfection',
      slug: 'plated-to-perfection',
      category: 'Restaurants',
      description: 'High-definition food videography highlighting signature dishes and ambient dining setup.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
      instagramUrl: 'https://www.instagram.com/artish.uk',
      clientId: createdClients[0]?.id,
      isFeatured: true,
      isPublished: true,
      sortOrder: 1,
    },
    {
      title: 'A night to remember',
      slug: 'a-night-to-remember',
      category: 'Events',
      description: 'Capturing live energy, stage performance, and crowd moments for a major cultural festival.',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
      instagramUrl: 'https://www.instagram.com/artish.uk',
      clientId: createdClients[5]?.id,
      isFeatured: true,
      isPublished: true,
      sortOrder: 2,
    },
    {
      title: 'Studio Sessions',
      slug: 'studio-sessions',
      category: 'Podcasts',
      description: 'Multi-camera podcast recording studio setup with crisp audio and short social snippets.',
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80',
      instagramUrl: 'https://www.instagram.com/artish.uk',
      clientId: createdClients[6]?.id,
      isFeatured: true,
      isPublished: true,
      sortOrder: 3,
    },
    {
      title: 'City skyline series',
      slug: 'city-skyline-series',
      category: 'Community Projects',
      description: 'Urban visual storytelling showcasing local architecture, vibrant streets and community hubs.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
      instagramUrl: 'https://www.instagram.com/artish.uk',
      isFeatured: true,
      isPublished: true,
      sortOrder: 4,
    },
    {
      title: 'Behind the launch',
      slug: 'behind-the-launch',
      category: 'Social Media Campaigns',
      description: 'Strategic short-form teaser campaign driving grand opening queues and viral social reach.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
      instagramUrl: 'https://www.instagram.com/artish.uk',
      clientId: createdClients[2]?.id,
      isFeatured: true,
      isPublished: true,
      sortOrder: 5,
    },
    {
      title: "Chef's table series",
      slug: 'chefs-table-series',
      category: 'Restaurants',
      description: 'Authentic kitchen prep storytelling capturing master chefs in their element.',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1000&q=80',
      instagramUrl: 'https://www.instagram.com/artish.uk',
      clientId: createdClients[1]?.id,
      isFeatured: true,
      isPublished: true,
      sortOrder: 6,
    },
  ];

  for (const p of portfolioData) {
    await prisma.portfolio.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log('✅ Portfolio seeded.');

  // 6. Seed Testimonials
  const testimonials = [
    {
      name: 'Darshan Patel',
      company: 'Managing Director, Shayona',
      quote: 'Artish has completely transformed how we present Shayona online. Their creativity, quick turnaround and understanding of our brand has helped us reach thousands of new customers across London.\n\nFrom high-impact reels to consistent social media management, the results speak for themselves. Footfall is up, engagement is higher than ever, and our brand finally looks the way it deserves to.',
      rating: 5,
      image: '/images/partners/shayona-restaurant.jpg',
      isPublished: true,
      sortOrder: 1,
    },
    {
      name: 'Tushar Patel',
      company: 'Owner, HK Furniture',
      quote: 'Working with Artish was one of the best marketing decisions we made this year. They took the time to understand our bespoke furniture business and created content that truly showcases the quality of our craftsmanship.\n\nOur enquiries have significantly increased, and customers regularly mention seeing our videos before visiting the showroom. Professional, reliable and exceptionally talented.',
      rating: 5,
      image: null,
      isPublished: true,
      sortOrder: 2,
    },
    {
      name: 'Priya Patel',
      company: 'Shayona Restaurant',
      quote: 'Artish transformed our online presence. Reels they made for us went viral and brought a packed restaurant every weekend.',
      rating: 5,
      image: '/images/partners/shayona-restaurant.jpg',
      isPublished: true,
      sortOrder: 3,
    },
    {
      name: 'Marcus Vance',
      company: 'Soundwave Studio',
      quote: 'The podcast production quality is outstanding. Our engagement multiplied by 3x within two months of working with Artish UK.',
      rating: 5,
      image: null,
      isPublished: true,
      sortOrder: 4,
    },
    {
      name: 'Rahul Sharma',
      company: 'Rajdhani Express',
      quote: 'Fast, creative, and extremely results-driven. They understand food marketing better than anyone else in the UK.',
      rating: 5,
      image: '/images/partners/rajdhani-express.jpg',
      isPublished: true,
      sortOrder: 5,
    },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name, company: t.company } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log('✅ Testimonials seeded.');

  // 7. Seed FAQs
  const faqs = [
    {
      question: 'How much does content creation cost?',
      answer: "Our packages start from £350/month and scale based on volume, locations and turnaround. After a free consultation we'll send a clear, fixed quote.",
      sortOrder: 1,
    },
    {
      question: 'Do you work with small businesses?',
      answer: 'Absolutely — small and independent businesses are our specialty. We have packages designed specifically for cafes, takeaways and local brands.',
      sortOrder: 2,
    },
    {
      question: 'Do you offer monthly packages?',
      answer: 'Yes. Most clients sit on a monthly retainer covering shoots, edits and posting. We also offer one-off projects for events and launches.',
      sortOrder: 3,
    },
    {
      question: 'Can you manage our social media?',
      answer: 'Yes. We can handle strategy, posting, captions, hashtags, engagement and reporting end-to-end.',
      sortOrder: 4,
    },
    {
      question: 'Do you travel across the UK?',
      answer: 'We do. We regularly travel for events, restaurants and clients across England — travel costs are always agreed up front.',
      sortOrder: 5,
    },
    {
      question: 'How quickly can projects be completed?',
      answer: 'Most reels and social content are delivered within 5 working days. Events and podcasts within 7-10 days. Rush turnaround available on request.',
      sortOrder: 6,
    },
  ];

  for (const f of faqs) {
    const existing = await prisma.faq.findFirst({ where: { question: f.question } });
    if (!existing) {
      await prisma.faq.create({ data: f });
    }
  }
  console.log('✅ FAQs seeded.');

  // 8. Seed Videos / Reels
  const initialVideos = [
    {
      title: 'Shayona Restaurant',
      category: 'Restaurants',
      videoUrl: '/videos/shayona-first.mp4',
      thumbnailUrl: null,
      videoType: 'MP4',
      status: 'PUBLISHED',
      displayOrder: 1,
      featured: true,
    },
    {
      title: 'Harsh & Jatin',
      category: 'Events',
      videoUrl: '/videos/harsh-jatin.mp4',
      thumbnailUrl: null,
      videoType: 'MP4',
      status: 'PUBLISHED',
      displayOrder: 2,
      featured: false,
    },
    {
      title: 'GJ 05',
      category: 'Restaurants',
      videoUrl: '/videos/gj05.mp4',
      thumbnailUrl: null,
      videoType: 'MP4',
      status: 'PUBLISHED',
      displayOrder: 3,
      featured: false,
    },
    {
      title: 'Om Nom Event',
      category: 'Events',
      videoUrl: '/videos/om-nom-event.mp4',
      thumbnailUrl: null,
      videoType: 'MP4',
      status: 'PUBLISHED',
      displayOrder: 4,
      featured: false,
    },
    {
      title: 'Gujarat No Rankar',
      category: 'Business Promotions',
      videoUrl: '/videos/gujrat-no-rankar.mp4',
      thumbnailUrl: null,
      videoType: 'MP4',
      status: 'PUBLISHED',
      displayOrder: 5,
      featured: false,
    },
    {
      title: 'Asmita Reel',
      category: 'Podcasts',
      videoUrl: '/videos/asmita-reel.mp4',
      thumbnailUrl: null,
      videoType: 'MP4',
      status: 'PUBLISHED',
      displayOrder: 6,
      featured: false,
    },
    {
      title: 'Panchmasi Event',
      category: 'Events',
      videoUrl: '/videos/panchmasi.mp4',
      thumbnailUrl: null,
      videoType: 'MP4',
      status: 'PUBLISHED',
      displayOrder: 7,
      featured: false,
    },
    {
      title: 'Jatin Woodman',
      category: 'Business Promotions',
      videoUrl: '/videos/IMG_2382.mp4',
      thumbnailUrl: '/videos/IMG_2382-thumb.jpg',
      videoType: 'MP4',
      status: 'PUBLISHED',
      displayOrder: 8,
      featured: true,
    },
    {
      title: 'Royals Handi Restaurant',
      category: 'Restaurants',
      videoUrl: '/videos/royals-handi.mp4',
      thumbnailUrl: null,
      videoType: 'MP4',
      status: 'PUBLISHED',
      displayOrder: 9,
      featured: false,
    },
  ];

  for (const v of initialVideos) {
    const existing = await prisma.video.findFirst({ where: { title: v.title } });
    if (!existing) {
      await prisma.video.create({ data: v });
    }
  }
  console.log('✅ Videos / Reels seeded.');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
