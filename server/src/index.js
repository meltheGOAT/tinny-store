require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const inquiryRoutes = require('./routes/inquiries');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxy (Render, AWS, Cloudflare) for correct client IP detection in rate limiting
app.set('trust proxy', 1);

// HTTP Security Headers (Helmet)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows cross-origin CDN media loading
  crossOriginEmbedderPolicy: false
}));

// Allowed frontend origins for CORS
const configuredOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(u => u.trim().replace(/\/$/, ''))
  : [];

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...configuredOrigins])];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const isExplicitlyAllowed = allowedOrigins.includes(origin);
    const isVercelPreview = origin.endsWith('.vercel.app');
    const isRenderDomain = origin.endsWith('.onrender.com');
    const isDev = process.env.NODE_ENV !== 'production';

    if (isExplicitlyAllowed || isVercelPreview || isRenderDomain || isDev) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy blocked access from origin: ${origin}`));
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

// 2MB JSON body limit (prevents memory exhaustion DoS; file uploads go through Multer)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Static uploads directory (for local media storage fallback)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', studio: 'TINNY Abuja Flagship API', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin/upload', uploadRoutes);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`✨ TINNY Express Studio API listening on http://localhost:${PORT}`);
});
