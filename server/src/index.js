require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const inquiryRoutes = require('./routes/inquiries');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Trust reverse proxy (Railway, Render, AWS, Cloudflare) for client IP detection
app.set('trust proxy', 1);

// HTTP Security Headers (Helmet)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false
}));

// Allowed frontend origins for CORS (supports ALLOWED_ORIGINS and CLIENT_URL)
const rawConfiguredOrigins = process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || '';
const configuredOrigins = rawConfiguredOrigins
  ? rawConfiguredOrigins.split(',').map(u => u.trim().replace(/\/+$/, '')).filter(Boolean)
  : [];

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:8080'
];

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...configuredOrigins])];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const normalized = origin.replace(/\/+$/, '');
    const isExplicitlyAllowed = allowedOrigins.includes(normalized);
    const isVercel = normalized.endsWith('.vercel.app');
    const isRender = normalized.endsWith('.onrender.com');
    const isRailway = normalized.endsWith('.railway.app') || normalized.endsWith('.up.railway.app');
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalized);
    const isDev = process.env.NODE_ENV !== 'production';

    if (isExplicitlyAllowed || isVercel || isRender || isRailway || isLocalhost || isDev) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked request from unauthorized origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true
}));

// General API Rate Limiting: 300 requests per 15 minutes per IP
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP. Please try again later.' }
});
app.use('/api', generalApiLimiter);

// 2MB JSON body limit
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Static uploads directory (for local media storage fallback)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    studio: 'TINNY Abuja Flagship API',
    port: PORT,
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin/upload', uploadRoutes);

// If Express serves the built frontend (e.g. monorepo deployment on Railway / Render)
const clientDistCandidates = [
  path.resolve(__dirname, '../../dist'),
  path.resolve(__dirname, '../dist')
];
const clientDistPath = clientDistCandidates.find(p => fs.existsSync(p));

if (clientDistPath) {
  app.use(express.static(clientDistPath));

  // Catch-all route returning index.html for direct product and client routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Fallback 404 for unhandled API requests
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, HOST, () => {
  console.log(`✨ TINNY Express Studio API listening on ${HOST}:${PORT} (environment: ${process.env.NODE_ENV || 'development'})`);
});
