import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { formatPrice, addToCart, wishlist, toggleWishlist, openProduct } = useStore();

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [isHovered, setIsHovered] = useState(false);

  const isSaved = wishlist.includes(product.id);
  const activeImage = (isHovered && product.images[1]) ? product.images[1] : product.images[0];

  const handleQuickAddSize = (e, size) => {
    e.stopPropagation();
    addToCart(product, selectedColor, size, 1);
  };

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-media-wrap" onClick={() => openProduct(product)}>
        <img src={activeImage} alt={product.title} className="card-img" loading="lazy" />

        {product.badge && (
          <span className={`card-badge badge-${product.badgeType || 'black'}`}>{product.badge}</span>
        )}

        <button
          className={`card-heart-btn ${isSaved ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          title={isSaved ? 'Remove from Wishlist' : 'Save'}
        >
          <Heart size={13} fill={isSaved ? 'currentColor' : 'none'} />
        </button>

        <div className="card-quick-add" onClick={(e) => e.stopPropagation()}>
          <div style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center', color: '#666' }}>
            Quick Add
          </div>
          <div className="size-btn-row">
            {product.sizes.map(size => (
              <button key={size} className="card-size-pill" onClick={(e) => handleQuickAddSize(e, size)}>
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card-body">
        <span className="card-cat-label">{product.categoryLabel}</span>
        <h3 className="card-product-title" onClick={() => openProduct(product)}>
          {product.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="card-price-text">{formatPrice(product.price)}</span>
          {product.colors && product.colors.length > 0 && (
            <div className="card-swatches">
              {product.colors.map(c => (
                <span
                  key={c.name}
                  className={`card-swatch-dot ${selectedColor === c.name ? 'active' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setSelectedColor(c.name)}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
