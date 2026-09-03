import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, Truck, RefreshCw } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function QuickViewModal() {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    formatPrice, 
    addToCart, 
    wishlist, 
    toggleWishlist 
  } = useStore();

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImgIndex(0);
      setSelectedColor(quickViewProduct.colors[0]?.name || '');
      setSelectedSize(quickViewProduct.sizes[0] || '');
      setQty(1);
    }
  }, [quickViewProduct]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setQuickViewProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setQuickViewProduct]);

  if (!quickViewProduct) return null;

  const isSaved = wishlist.includes(quickViewProduct.id);

  const handleAdd = () => {
    addToCart(quickViewProduct, selectedColor, selectedSize, qty);
    setQuickViewProduct(null);
  };

  return (
    <div 
      className={`modal-overlay ${quickViewProduct ? 'open' : ''}`}
      onClick={() => setQuickViewProduct(null)}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="quickview-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="btn-icon"
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid var(--border-light)'
          }}
        >
          <X size={18} />
        </button>

        {/* Gallery */}
        <div className="quickview-img-side">
          <img 
            src={quickViewProduct.images[selectedImgIndex] || quickViewProduct.images[0]} 
            alt={quickViewProduct.title}
            className="quickview-main-image"
          />

          {quickViewProduct.images.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              display: 'flex',
              gap: '6px'
            }}>
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  style={{
                    width: '44px',
                    height: '56px',
                    padding: 0,
                    borderRadius: '2px',
                    overflow: 'hidden',
                    border: selectedImgIndex === idx ? '2px solid #111111' : '1px solid #ddd',
                    cursor: 'pointer',
                    background: '#fff'
                  }}
                >
                  <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="quickview-info-side">
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: '0.25rem' }}>
            {quickViewProduct.categoryLabel}
          </span>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.25 }}>
            {quickViewProduct.title}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: '#111111' }}>
              {formatPrice(quickViewProduct.price)}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#888' }}>
              SKU: {quickViewProduct.sku}
            </span>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#444', marginBottom: '1.25rem', lineHeight: 1.55 }}>
            {quickViewProduct.description}
          </p>

          {/* Color Selector */}
          {quickViewProduct.colors && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.4rem', color: '#222' }}>
                Color: <strong>{selectedColor}</strong>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {quickViewProduct.colors.map(c => (
                  <span 
                    key={c.name}
                    className={`card-swatch-dot ${selectedColor === c.name ? 'active' : ''}`}
                    style={{ backgroundColor: c.hex, width: '22px', height: '22px' }}
                    onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {quickViewProduct.sizes && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.4rem', color: '#222' }}>
                Select Size:
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {quickViewProduct.sizes.map(s => (
                  <button 
                    key={s}
                    className="card-size-pill"
                    style={{
                      padding: '0.45rem 0.85rem',
                      background: selectedSize === s ? '#111111' : '#ffffff',
                      color: selectedSize === s ? '#ffffff' : '#111111',
                      borderColor: selectedSize === s ? '#111111' : '#ddd',
                      fontSize: '0.8rem'
                    }}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Bag Action */}
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: 'auto', marginBottom: '1.25rem' }}>
            <button 
              className="btn btn-primary" 
              style={{ flex: 1, padding: '0.85rem' }}
              onClick={handleAdd}
            >
              <ShoppingBag size={16} />
              <span>Add to Bag • {formatPrice(quickViewProduct.price * qty)}</span>
            </button>

            <button 
              className={`btn-icon ${isSaved ? 'btn-primary' : 'btn-secondary'}`}
              style={{ width: '46px', height: '46px' }}
              onClick={() => toggleWishlist(quickViewProduct.id)}
              title={isSaved ? 'Remove from Saved' : 'Save to Wishlist'}
            >
              <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '0.6rem', 
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-light)',
            fontSize: '0.75rem',
            color: '#666'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Truck size={14} style={{ color: 'var(--accent-gold)' }} />
              <span>Worldwide Delivery</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <RefreshCw size={14} style={{ color: 'var(--accent-gold)' }} />
              <span>14-Day Boutique Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
