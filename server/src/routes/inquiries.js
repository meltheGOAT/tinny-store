const express = require('express');
const { PrismaClient } = require('@prisma/client');
const verifyAdminToken = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/inquiries (Logged when customer clicks "Checkout via WhatsApp")
router.post('/', async (req, res) => {
  try {
    const { items, totalNGN, totalUSD, buyerLocation } = req.body;

    const inquiry = await prisma.orderInquiry.create({
      data: {
        buyerLocation: buyerLocation || 'Abuja Flagship Direct',
        itemsSummary: typeof items === 'string' ? items : JSON.stringify(items || []),
        totalNGN: parseFloat(totalNGN) || 0,
        totalUSD: parseFloat(totalUSD) || 0,
        status: 'Direct Message Sent'
      }
    });

    res.status(201).json({
      ...inquiry,
      items: typeof inquiry.itemsSummary === 'string' ? JSON.parse(inquiry.itemsSummary) : inquiry.itemsSummary
    });
  } catch (err) {
    console.error('Error logging inquiry:', err);
    res.status(500).json({ error: 'Failed to record checkout inquiry.' });
  }
});

// GET /api/inquiries (Protected - Admin Inquiries Tab)
router.get('/admin', verifyAdminToken, async (req, res) => {
  try {
    const inquiries = await prisma.orderInquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(inquiries.map(inq => ({
      ...inq,
      items: typeof inq.itemsSummary === 'string' ? JSON.parse(inq.itemsSummary) : inq.itemsSummary
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve inquiries.' });
  }
});

module.exports = router;
