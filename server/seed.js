const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const INITIAL_DROPS = [
  {
    sku: 'TNY-JKT-001',
    title: 'Tinny 7-Star Dominion Tracksuit Top',
    category: 'outerwear',
    categoryLabel: 'Hoodies & Outerwear',
    price: 385000,
    badge: 'Limited Drop',
    badgeType: 'black',
    rating: 5.0,
    reviewsCount: 48,
    isBestSeller: true,
    inStock: true,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=85'
    ]),
    colors: JSON.stringify([
      { name: 'Bronze Sand', hex: '#ab8c52' },
      { name: 'Pitch Black', hex: '#111111' },
      { name: 'Bone White', hex: '#f2eee6' }
    ]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    description: 'Structured zip tracksuit jacket engineered from custom 420GSM double-knit cotton with palladium dual-zip hardware.',
    details: JSON.stringify([
      '420GSM Heavyweight Organic Double-Knit Cotton',
      'Embroidered 7-Star emblem',
      'Custom palladium-plated two-way zip pulls',
      'Handcrafted in limited batches in Abuja'
    ])
  },
  {
    sku: 'TNY-PNT-002',
    title: 'Tinny Dragon Pinched Pleat Track Pants',
    category: 'bottoms',
    categoryLabel: 'Bottoms & Shorts',
    price: 310000,
    badge: 'Matching Set',
    badgeType: 'gold',
    rating: 4.9,
    reviewsCount: 36,
    isBestSeller: true,
    inStock: true,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=85'
    ]),
    colors: JSON.stringify([
      { name: 'Bronze Sand', hex: '#ab8c52' },
      { name: 'Pitch Black', hex: '#111111' }
    ]),
    sizes: JSON.stringify(['30', '32', '34', '36', '38']),
    description: 'Relaxed taper silhouette with center pinched pleat detailing and concealed zippered side pockets.',
    details: JSON.stringify([
      '420GSM double-knit cotton poly blend',
      'Concealed ankle gusset zippers',
      'Elasticated waistband with woven drawcord',
      'Tailored in Abuja, FCT'
    ])
  },
  {
    sku: 'TNY-TEE-003',
    title: 'Tinny Kinetic Carded Heavyweight Tee',
    category: 'tops',
    categoryLabel: 'Shirts & Tops',
    price: 125000,
    badge: 'Atelier Core',
    badgeType: 'emerald',
    rating: 4.8,
    reviewsCount: 72,
    isBestSeller: true,
    inStock: true,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85'
    ]),
    colors: JSON.stringify([
      { name: 'Pitch Black', hex: '#111111' },
      { name: 'Mineral Slate', hex: '#5c646b' },
      { name: 'Raw Ecru', hex: '#ebe7df' }
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
    description: 'Boxy drop-shoulder tee cut from 320GSM carded organic cotton with reinforced collar ribbing.',
    details: JSON.stringify([
      '320GSM Carded Heavyweight Cotton',
      'Reinforced 1.25" crewneck collar',
      'Pre-shrunk anti-fade pigment dye',
      'Abuja Flagship Edition'
    ])
  },
  {
    sku: 'TNY-SHOE-009',
    title: 'Tinny Atelier Calfskin Molded Mule Slides',
    category: 'shoes',
    categoryLabel: 'Shoes & Slides',
    price: 290000,
    badge: 'Limited Drop',
    badgeType: 'gold',
    rating: 5.0,
    reviewsCount: 32,
    isBestSeller: true,
    inStock: true,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=85'
    ]),
    colors: JSON.stringify([
      { name: 'Obsidian Black', hex: '#111111' },
      { name: 'Warm Cream', hex: '#e8e0d5' }
    ]),
    sizes: JSON.stringify(['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45']),
    description: 'Sculptural slip-on silhouette engineered with an ergonomic cork-EVA footbed wrapped in supple Italian calfskin.',
    details: JSON.stringify([
      '100% Full-grain Italian calfskin upper',
      'Anatomical shock-absorbing footbed',
      'Embossed TINNY Abuja atelier emblem',
      'Durable textured rubber traction outsole'
    ])
  },
  {
    sku: 'TNY-SHOE-010',
    title: 'Tinny Dominion Low-Top Chunky Runner',
    category: 'shoes',
    categoryLabel: 'Shoes & Slides',
    price: 430000,
    badge: 'New Arrival',
    badgeType: 'black',
    rating: 4.9,
    reviewsCount: 19,
    isBestSeller: false,
    inStock: true,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=85'
    ]),
    colors: JSON.stringify([
      { name: 'Bone & Slate', hex: '#cfc9bd' },
      { name: 'Triple Black', hex: '#111111' }
    ]),
    sizes: JSON.stringify(['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45']),
    description: 'Deconstructed luxury runner featuring layered suede, technical mesh, and custom dual-density EVA platform cushioning.',
    details: JSON.stringify([
      'Supple suede, nappa leather and breathable mesh panels',
      'TINNY engraved palladium lace lock',
      'Cushioned dual-density EVA sole unit',
      'Padded collar and moisture-wicking textile lining'
    ])
  },
  {
    sku: 'TNY-CAP-007',
    title: 'Tinny 7-Star Embroidered Twill Cap',
    category: 'headwear',
    categoryLabel: 'Headwear & Caps',
    price: 95000,
    badge: 'Signature Drop',
    badgeType: 'black',
    rating: 4.9,
    reviewsCount: 65,
    isBestSeller: true,
    inStock: true,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=1200&q=85'
    ]),
    colors: JSON.stringify([
      { name: 'Pitch Black', hex: '#111111' },
      { name: 'Desert Khaki', hex: '#c4b59d' }
    ]),
    sizes: JSON.stringify(['One Size']),
    description: 'Unstructured 6-panel dad cap cut from washed cotton cavalry twill with tonal 7-Star embroidery and brass buckle slider.',
    details: JSON.stringify([
      '100% Washed Cotton Twill',
      'Custom embossed brass slider clasp',
      'Curved peak with tonal stitching',
      'Moisture-absorbent interior sweatband'
    ])
  },
  {
    sku: 'TNY-BAG-008',
    title: 'Tinny Atelier Calfskin Round Crossbody Bag',
    category: 'accessories',
    categoryLabel: 'Bags & Accessories',
    price: 475000,
    badge: 'Handcrafted',
    badgeType: 'gold',
    rating: 5.0,
    reviewsCount: 23,
    isBestSeller: false,
    inStock: true,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85'
    ]),
    colors: JSON.stringify([
      { name: 'Cognac Saddle', hex: '#633d1c' },
      { name: 'Noir Black', hex: '#111111' }
    ]),
    sizes: JSON.stringify(['One Size']),
    description: 'Sculptural circular crossbody bag crafted from vegetable-tanned Italian calfskin leather.',
    details: JSON.stringify([
      '100% Full Grain Vegetable-Tanned Italian Leather',
      'Microfiber suede interior lining',
      'Removable adjustable 120cm leather strap',
      'Hand-burnished wax edges'
    ])
  }
];

async function main() {
  console.log('🌱 Seeding TINNY Flagship Database...');

  // 1. Create Default Super Admin
  const adminEmail = 'admin@tinny.store';
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('tinny2026', 10);
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: 'TINNY Studio Master',
        role: 'Super Admin'
      }
    });
    console.log(`✅ Created Super Admin: ${adminEmail} / tinny2026`);
  } else {
    console.log(`ℹ️ Admin ${adminEmail} already exists.`);
  }

  // 2. Seed Initial Products
  for (const item of INITIAL_DROPS) {
    const existing = await prisma.product.findUnique({ where: { sku: item.sku } });
    if (!existing) {
      await prisma.product.create({ data: item });
      console.log(`  + Seeded Product: ${item.title} (${item.sku}) - ₦${item.price.toLocaleString()}`);
    } else {
      console.log(`  • Existing: ${item.sku}`);
    }
  }

  console.log('🎉 Seeding complete! Database is primed for production.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
