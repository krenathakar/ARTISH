const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const clientRoutes = require('./routes/clientRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const faqRoutes = require('./routes/faqRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const settingRoutes = require('./routes/settingRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const videoRoutes = require('./routes/videoRoutes');

const app = express();

// Security & Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
].filter(Boolean).map((url) => url.replace(/\/+$/, ''));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/+$/, '');
    const isAllowed =
      allowedOrigins.includes(cleanOrigin) ||
      /^http:\/\/localhost:(5173|5174|5000|3000)$/.test(cleanOrigin) ||
      /^http:\/\/127\.0\.0\.1:(5173|5174|5000|3000)$/.test(cleanOrigin);

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS Warning] Origin ${origin} not explicitly in allowed list, but allowing for dev`);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/videos', express.static(path.join(__dirname, '../../client/public/videos')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Artish UK Server is running', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/videos', videoRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Artish UK Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

