const express = require('express');
const { PrismaClient } = require('@prisma/client');
const verifyAdminToken = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Helper to serialize array/object fields to JSON strings
function serializeProduct(data) {
  return {
    sku: data.sku || `TNY-${(data.category || 'TOP').toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`,
    title: data.title,
    category: data.category || 'tops',
    categoryLabel: data.categoryLabel || 'Shirts & Tops',
    price: parseFloat(data.price) || 0,
    badge: data.badge || null,
    badgeType: data.badgeType || 'black',
    rating: data.rating !== undefined ? parseFloat(data.rating) : 5.0,
    reviewsCount: data.reviewsCount !== undefined ? parseInt(data.reviewsCount, 10) : 12,
    isBestSeller: Boolean(data.isBestSeller),
    inStock: data.inStock !== undefined ? Boolean(data.inStock) : true,
    images: typeof data.images === 'string' ? data.images : JSON.stringify(data.images || []),
    colors: typeof data.colors === 'string' ? data.colors : JSON.stringify(data.colors || []),
    sizes: typeof data.sizes === 'string' ? data.sizes : JSON.stringify(data.sizes || []),
    description: data.description || '',
    details: typeof data.details === 'string' ? data.details : JSON.stringify(data.details || [])
  };
}

// Helper to parse stored JSON strings back into arrays/objects for API consumers
function formatProductResponse(p) {
  return {
    ...p,
    images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : p.images,
    colors: typeof p.colors === 'string' ? JSON.parse(p.colors || '[]') : p.colors,
    sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes || '[]') : p.sizes,
    details: typeof p.details === 'string' ? JSON.parse(p.details || '[]') : p.details
  };
}

// GET /api/products (Public Storefront Catalog)
router.get('/', async (req, res) => {
  try {
    const { category, bestSellers } = req.query;
    const where = {};
    if (category && category !== 'all') {
      where.category = category;
    }
    if (bestSellers === 'true') {
      where.isBestSeller = true;
    }

    const items = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(items.map(formatProductResponse));
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to retrieve products.' });
  }
});

// GET /api/products/:id (Public Single Product)
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(formatProductResponse(product));
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve product details.' });
  }
});

// POST /api/admin/products (Protected - Create Product)
router.post('/admin', verifyAdminToken, async (req, res) => {
  try {
    let payload = serializeProduct(req.body);
    let created;
    try {
      created = await prisma.product.create({
        data: payload
      });
    } catch (createErr) {
      if (createErr.code === 'P2002') {
        // Unique SKU collision, append random suffix and retry
        payload.sku = `${payload.sku}-${Math.floor(100 + Math.random() * 900)}`;
        created = await prisma.product.create({
          data: payload
        });
      } else {
        throw createErr;
      }
    }
    res.status(201).json(formatProductResponse(created));
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Failed to publish new product to catalog: ' + (err.message || err) });
  }
});

// PUT /api/admin/products/:id (Protected - Update Product)
router.put('/admin/:id', verifyAdminToken, async (req, res) => {
  try {
    const payload = serializeProduct(req.body);
    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: payload
    });
    res.json(formatProductResponse(updated));
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product details.' });
  }
});

// PATCH /api/admin/products/:id/stock (Protected - Toggle Stock)
router.patch('/admin/:id/stock', verifyAdminToken, async (req, res) => {
  try {
    const current = await prisma.product.findUnique({
      where: { id: req.params.id },
      select: { inStock: true }
    });
    if (!current) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: { inStock: !current.inStock }
    });
    res.json(formatProductResponse(updated));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update stock status.' });
  }
});

// PATCH /api/admin/products/:id/bestseller (Protected - Toggle Best Seller)
router.patch('/admin/:id/bestseller', verifyAdminToken, async (req, res) => {
  try {
    const current = await prisma.product.findUnique({
      where: { id: req.params.id },
      select: { isBestSeller: true }
    });
    if (!current) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: { isBestSeller: !current.isBestSeller }
    });
    res.json(formatProductResponse(updated));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update best seller status.' });
  }
});

// DELETE /api/admin/products/:id (Protected - Delete Product)
router.delete('/admin/:id', verifyAdminToken, async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Product deleted from catalog.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

module.exports = router;
