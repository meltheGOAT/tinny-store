const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const verifyAdminToken = require('../middleware/auth');

// Check if Cloudinary credentials are configured
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  console.log(`☁️ Cloudinary configured for cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
} else {
  console.log('📁 Cloudinary credentials not configured. Local media storage active at /public/uploads');
}

// Multer memory storage (allows buffer streaming to Cloudinary or local disk)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max per image
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, AVIF) are supported'), false);
    }
  }
});

// Helper to stream upload to Cloudinary
function uploadToCloudinary(fileBuffer, originalName = 'product') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'tinny/products',
        format: 'webp',
        quality: 'auto:good',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
}

// Helper to save locally when Cloudinary is not configured
function saveLocally(fileBuffer, originalName) {
  const uploadsDir = path.join(__dirname, '../../public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const safeExt = path.extname(originalName) || '.webp';
  const fileName = `tinny-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${safeExt}`;
  const filePath = path.join(uploadsDir, fileName);

  fs.writeFileSync(filePath, fileBuffer);
  return `/uploads/${fileName}`;
}

// GET /api/admin/upload/status - check media pipeline state
router.get('/status', (req, res) => {
  res.json({
    provider: isCloudinaryConfigured ? 'cloudinary' : 'local',
    cloudName: isCloudinaryConfigured ? process.env.CLOUDINARY_CLOUD_NAME : null,
    status: 'ready'
  });
});

// POST /api/admin/upload - upload one or multiple images
router.post('/', verifyAdminToken, upload.any(), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No image files provided for upload.' });
    }

    const uploadedUrls = [];
    const host = req.get('host');
    const protocol = req.protocol;

    for (const file of files) {
      if (isCloudinaryConfigured) {
        const cloudUrl = await uploadToCloudinary(file.buffer, file.originalname);
        uploadedUrls.push(cloudUrl);
      } else {
        const localPath = saveLocally(file.buffer, file.originalname);
        const fullLocalUrl = `${protocol}://${host}${localPath}`;
        uploadedUrls.push(fullLocalUrl);
      }
    }

    return res.json({
      success: true,
      provider: isCloudinaryConfigured ? 'cloudinary' : 'local',
      count: uploadedUrls.length,
      urls: uploadedUrls
    });
  } catch (err) {
    console.error('Media upload error:', err);
    return res.status(500).json({
      error: 'Failed to process media upload.',
      details: err.message
    });
  }
});

module.exports = router;
