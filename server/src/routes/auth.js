const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const verifyAdminToken = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'tinny_luxury_atelier_jwt_secret_2026_abuja';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check in database
    let admin = await prisma.adminUser.findUnique({
      where: { email: cleanEmail }
    });

    // Fallback if not seeded yet or default admin
    if (!admin && cleanEmail === 'admin@tinny.store') {
      const defaultHash = await bcrypt.hash('tinny2026', 10);
      admin = await prisma.adminUser.create({
        data: {
          email: 'admin@tinny.store',
          passwordHash: defaultHash,
          name: 'TINNY Studio Master',
          role: 'Super Admin'
        }
      });
    }

    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid admin password.' });
    }

    // Sign JWT token valid for 7 days
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
});

// GET /api/auth/me (Verify active session)
router.get('/me', verifyAdminToken, async (req, res) => {
  try {
    const admin = await prisma.adminUser.findUnique({
      where: { id: req.admin.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    if (!admin) {
      return res.status(404).json({ error: 'Admin user not found.' });
    }
    res.json({ success: true, user: admin });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify session.' });
  }
});

module.exports = router;
