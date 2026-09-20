import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Heart, Truck, Ruler, Minus, Plus, 
  ChevronDown, Share2 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';

export default function ProductDetailPage() {
  const { 
    activeProduct, 
    products, 
    setCurrentRoute, 
    formatPrice, 
    addToCart, 
    wishlist, 
    toggleWishlist,
    showToast,
    logInquiry,
    getPriceInUSD,
    getPriceInNGN
  } = useStore();

  const product = activeProduct;

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [openAccordions, setOpenAccordions] = useState({
    shipping: true,
    details: false,
    description: false
  });
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Sync state whenever activeProduct changes
  useEffect(() => {
    if (product) {
      setSelectedImgIndex(0);
      setSelectedColor(product.colors && product.colors[0] ? product.colors[0].name : 'Standard');
      setSelectedSize(product.sizes && product.sizes[0] ? product.sizes[0] : 'M');
      setQty(1);
      document.title = `${product.title} — TINNY Flagship Studio`;
    }
    return () => {
      document.title = 'TINNY — Timeless Style. Modern You';
    };
  }, [product]);

  if (!product) {
    return (
      <main className="pdp-wrapper" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>Piece Not Found</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            The requested design may have ended its limited seasonal run.
          </p>
          <button 
            className="btn btn-primary" 
            onClick={() => { setCurrentRoute('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <ArrowLeft size={14} />
            <span>Explore Atelier Collection</span>
          </button>
        </div>
      </main>
    );
  }

  const isSaved = wishlist.includes(product.id);
  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85'];
  const currentImage = images[selectedImgIndex] || images[0];

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, qty);
  };

  const handleBuyItNow = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const itemPriceNGN = getPriceInNGN(product.price) * qty;
    const shortId = product.sku || product.id;
    const productWebLink = origin ? `${origin}/product/${shortId}` : '';

    const message = `*INSTANT ORDER - TINNY ABUJA*\n\n1. *${product.title}* (x${qty})\n   Size: ${selectedSize} | Color: ${selectedColor}\n   Subtotal: ${formatPrice(itemPriceNGN)}${productWebLink ? `\n   Link: ${productWebLink}` : ''}\n\n*Total:* ${formatPrice(itemPriceNGN)}\n*Delivery:* Free Same-Day Dispatch (Abuja & Environs)\n\nHi TINNY, I would like to complete my purchase for this piece right away.`;

    // Log inquiry to backend
    logInquiry({
      buyerLocation: 'Abuja Flagship Direct',
      items: [{
        title: product.title,
        size: selectedSize,
        color: selectedColor,
        qty: qty,
        priceNGN: getPriceInNGN(product.price),
        priceUSD: Math.round(getPriceInUSD(product.price)),
        productLink: productWebLink,
        image: currentImage
      }],
      totalNGN: Math.round(itemPriceNGN),
      totalUSD: Math.round(itemPriceNGN / 1480)
    });

    showToast('Redirecting to WhatsApp checkout...', 'success');
    const waUrl = `https://wa.me/2348102764430?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on TINNY Abuja`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard', 'info');
    }
  };

  // Recommended complementary pieces (excluding current product)
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.isBestSeller))
    .slice(0, 4);

  return (
    <main className="pdp-page-container">
      {/* Main PDP Grid (ZTTW Style) */}
      <section className="pdp-main-section">
        <div className="pdp-layout-grid">
          
          {/* LEFT COLUMN: Gallery */}
          <div className="pdp-media-column">
            <div className="pdp-hero-image-wrap">
              <img 
                src={currentImage} 
                alt={product.title} 
                className="pdp-hero-image" 
              />

              {product.badge && (
                <span className={`card-badge badge-${product.badgeType || 'black'} pdp-badge-pos`}>
                  {product.badge}
                </span>
              )}

              <div className="pdp-media-actions">
                <button 
                  type="button"
                  className={`card-heart-btn ${isSaved ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product.id)}
                  title={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
                >
                  <Heart size={15} fill={isSaved ? 'currentColor' : 'none'} />
                </button>

                <button 
                  type="button"
                  className="card-heart-btn"
                  onClick={handleShare}
                  title="Share Piece"
                >
                  <Share2 size={14} />
                </button>
              </div>
            </div>

            {/* Thumbnail Row (below hero image, matching ZTTW) */}
            {images.length > 1 && (
              <div className="pdp-thumbnails-strip">
                {images.map((img, idx) => (
                  <button
                    type="button"
                    key={idx}
                    className={`pdp-thumb-card ${selectedImgIndex === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImgIndex(idx)}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <img src={img} alt={`${product.title} thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Buy Box */}
          <div className="pdp-details-column">
            <div className="pdp-product-header">
              <h1 className="pdp-title">{product.title}</h1>
              <div className="pdp-price-tag">{formatPrice(product.price)}</div>
              <div className="pdp-shipping-note">
                <button 
                  type="button" 
                  onClick={() => setOpenAccordions(prev => ({ ...prev, shipping: true }))}
                  className="pdp-shipping-note-link"
                >
                  Shipping
                </button>{' '}
                Calculated At Checkout.
              </div>
            </div>

            {/* Color Selector (if colors exist) */}
            {product.colors && product.colors.length > 0 && (
              <div className="pdp-option-group">
                <div className="pdp-option-label-row">
                  <span className="pdp-option-title">Color:</span>
                  <span className="pdp-option-selected-val">{selectedColor}</span>
                </div>
                <div className="pdp-swatches-row">
                  {product.colors.map(c => (
                    <button
                      type="button"
                      key={c.name}
                      className={`pdp-color-swatch ${selectedColor === c.name ? 'active' : ''}`}
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                    >
                      <span className="pdp-swatch-circle" style={{ backgroundColor: c.hex }} />
                      <span className="pdp-swatch-text">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector (matching ZTTW: "Size [ruler icon] \n S \n [S][M][L]...") */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="pdp-option-group">
                <div className="pdp-size-header-row">
                  <div className="pdp-size-title-wrap">
                    <span className="pdp-option-title">Size</span>
                    <button 
                      type="button"
                      className="pdp-size-guide-btn"
                      onClick={() => setIsSizeGuideOpen(!isSizeGuideOpen)}
                      title="View size measurement table"
                    >
                      <Ruler size={13} />
                    </button>
                  </div>
                </div>

                <div className="pdp-selected-size-text">{selectedSize}</div>

                <div className="pdp-size-grid-row">
                  {product.sizes.map(size => (
                    <button
                      type="button"
                      key={size}
                      className={`pdp-size-box-pill ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Inline Size Guide modal / dropdown */}
                {isSizeGuideOpen && (
                  <div className="pdp-size-guide-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Atelier Sizing Guide (Inches)</strong>
                      <button 
                        type="button"
                        onClick={() => setIsSizeGuideOpen(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        ✕
                      </button>
                    </div>
                    <table className="pdp-size-table">
                      <thead>
                        <tr>
                          <th>Size</th>
                          <th>Chest</th>
                          <th>Shoulder</th>
                          <th>Length</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td>S</td><td>40"</td><td>18.5"</td><td>27.5"</td></tr>
                        <tr><td>M</td><td>42"</td><td>19.0"</td><td>28.5"</td></tr>
                        <tr><td>L</td><td>44"</td><td>19.5"</td><td>29.5"</td></tr>
                        <tr><td>XL</td><td>46"</td><td>20.0"</td><td>30.5"</td></tr>
                        <tr><td>2XL</td><td>48"</td><td>20.5"</td><td>31.5"</td></tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons: Quantity Stepper + ADD TO CART, followed by BUY IT NOW */}
            <div className="pdp-action-cluster">
              <div className="pdp-add-row">
                <div className="pdp-qty-stepper">
                  <button 
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    aria-label="Decrease quantity"
                    className="pdp-qty-btn"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="pdp-qty-number">{qty}</span>
                  <button 
                    type="button"
                    onClick={() => setQty(qty + 1)}
                    aria-label="Increase quantity"
                    className="pdp-qty-btn"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <button 
                  type="button"
                  onClick={handleAddToCart}
                  className="pdp-add-to-cart-btn"
                >
                  ADD TO CART
                </button>
              </div>

              {/* Full Width Buy It Now Button */}
              <button 
                type="button"
                onClick={handleBuyItNow}
                className="pdp-buy-it-now-btn"
              >
                BUY IT NOW
              </button>
            </div>

            {/* Value Props & Shipping Perk Line */}
            <div className="pdp-perk-item">
              <Truck size={16} className="pdp-perk-icon" />
              <span>Free Shipping On Orders Over ₦500,000</span>
            </div>

            {/* Accordions (ZTTW Style) */}
            <div className="pdp-accordions-group">
              {/* Accordion 1: Shipping And Returns */}
              <div className="pdp-accordion-item">
                <button 
                  type="button"
                  className="pdp-accordion-header"
                  onClick={() => toggleAccordion('shipping')}
                  aria-expanded={openAccordions.shipping}
                >
                  <span>Shipping And Returns</span>
                  <ChevronDown 
                    size={15} 
                    className={`pdp-chevron ${openAccordions.shipping ? 'open' : ''}`} 
                  />
                </button>
                {openAccordions.shipping && (
                  <div className="pdp-accordion-body">
                    <p>
                      <strong>Abuja Metropolitan Dispatch:</strong> Same-day doorstep delivery for orders placed before 3:00 PM. Complimentary on all orders over ₦500,000.
                    </p>
                    <p style={{ marginTop: '0.5rem' }}>
                      <strong>Nationwide & International:</strong> 1–3 business days via DHL Express / GIG Logistics.
                    </p>
                    <p style={{ marginTop: '0.5rem' }}>
                      <strong>14-Day Atelier Exchanges:</strong> Items must be returned unworn with signature tags intact.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Fabrication & Atelier Specifications */}
              <div className="pdp-accordion-item">
                <button 
                  type="button"
                  className="pdp-accordion-header"
                  onClick={() => toggleAccordion('details')}
                  aria-expanded={openAccordions.details}
                >
                  <span>Fabrication & Details</span>
                  <ChevronDown 
                    size={15} 
                    className={`pdp-chevron ${openAccordions.details ? 'open' : ''}`} 
                  />
                </button>
                {openAccordions.details && (
                  <div className="pdp-accordion-body">
                    {product.details && product.details.length > 0 ? (
                      <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {product.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>Handcrafted limited production run constructed in Abuja with premium custom hardware.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 3: Product Description */}
              <div className="pdp-accordion-item">
                <button 
                  type="button"
                  className="pdp-accordion-header"
                  onClick={() => toggleAccordion('description')}
                  aria-expanded={openAccordions.description}
                >
                  <span>Product Description</span>
                  <ChevronDown 
                    size={15} 
                    className={`pdp-chevron ${openAccordions.description ? 'open' : ''}`} 
                  />
                </button>
                {openAccordions.description && (
                  <div className="pdp-accordion-body">
                    <p>{product.description || 'Precision-tailored luxury streetwear piece from the TINNY Flagship Atelier in Abuja.'}</p>
                    <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#666' }}>
                      <span>SKU: <strong>{product.sku || product.id}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Recommended Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section className="pdp-related-section">
          <div className="pdp-related-inner">
            <div className="pdp-related-header">
              <span className="section-eyebrow">Curated Drops</span>
              <h2 className="pdp-related-title">Complete The Look</h2>
            </div>
            <div className="products-grid">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
