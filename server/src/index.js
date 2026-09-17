require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const inquiryRoutes = require('./routes/inquiries');
const uploadRoutes = require('./routes/upload');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration (allow Vite frontend, localhost, Vercel deployments)
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server) or any matching domain
    if (!origin) return callback(null, true);
    callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

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
