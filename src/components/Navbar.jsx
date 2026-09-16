import React, { useState } from 'react';
import { ShoppingBag, ChevronDown, Menu, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CURRENCIES } from '../data/products';

export default function Navbar() {
  const {
    currentRoute, setCurrentRoute,
    cartCount, setIsCartOpen,
    currency, setCurrency, setActiveCategory
  } = useStore();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleNavTo = (route, catId) => {
    setCurrentRoute(route);
    if (catId) setActiveCategory(catId);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="tinny-header">
        <div className="header-container">
          {/* Left: Hamburger (mobile) + Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className="hamburger-btn"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <ul className="header-nav-list">
              <li>
                <button className="header-nav-link" onClick={() => handleNavTo('storefront')}>
                  Home
                </button>
              </li>
              <li>
                <button className="header-nav-link" onClick={() => handleNavTo('shop', 'all')}>
                  Shop All
                </button>
              </li>
              <li>
                <button className="header-nav-link" onClick={() => handleNavTo('shop', 'tops')}>
                  Tops
                </button>
              </li>
              <li>
                <button className="header-nav-link" onClick={() => handleNavTo('shop', 'outerwear')}>
                  Outerwear
                </button>
              </li>
              <li>
                <button className="header-nav-link" onClick={() => handleNavTo('shop', 'shoes')}>
                  Shoes & Slides
                </button>
              </li>
              <li>
                <button className="header-nav-link" onClick={() => handleNavTo('shop', 'headwear')}>
                  Headwear
                </button>
              </li>
            </ul>
          </div>

          {/* Center: Logo */}
          <div
            className="tinny-brand-center"
            onClick={() => handleNavTo('storefront')}
          >
            <span className="tinny-logo-text">TINNY</span>
            <span className="tinny-logo-slogan desktop-only-slogan">Timeless Style. Modern You</span>
          </div>

          {/* Right: Actions */}
          <div className="header-actions">
            <div className="currency-select-box">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="currency-dropdown"
                aria-label="Currency"
              >
                {Object.values(CURRENCIES).map(cur => (
                  <option key={cur.code} value={cur.code}>{cur.label}</option>
                ))}
              </select>
              <ChevronDown size={12} className="currency-arrow" />
            </div>

            <button
              className="btn-icon"
              style={{ position: 'relative' }}
              onClick={() => setIsCartOpen(true)}
              aria-label={`Bag (${cartCount})`}
            >
              <ShoppingBag size={17} />
              {cartCount > 0 && (
                <span className="cart-btn-badge">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <div
        className={`mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`}
        onClick={() => setMobileNavOpen(false)}
      >
        <nav
          className="mobile-nav-drawer"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className="mobile-nav-header">
            <div>
              <span className="tinny-logo-text" style={{ fontSize: '1.1rem' }}>TINNY</span>
              <div className="tinny-logo-slogan" style={{ fontSize: '0.48rem' }}>Timeless Style. Modern You</div>
            </div>
            <button className="btn-icon" onClick={() => setMobileNavOpen(false)} aria-label="Close menu">
              <X size={18} />
            </button>
          </div>

          <ul className="mobile-nav-links">
            <li>
              <button className="mobile-nav-link-item" onClick={() => handleNavTo('storefront')}>
                Home
              </button>
            </li>
            <li>
              <button className="mobile-nav-link-item" onClick={() => handleNavTo('shop', 'all')}>
                Shop All
              </button>
            </li>
            <li>
              <button className="mobile-nav-link-item" onClick={() => handleNavTo('shop', 'tops')}>
                Shirts & Tops
              </button>
            </li>
            <li>
              <button className="mobile-nav-link-item" onClick={() => handleNavTo('shop', 'bottoms')}>
                Bottoms & Shorts
              </button>
            </li>
            <li>
              <button className="mobile-nav-link-item" onClick={() => handleNavTo('shop', 'outerwear')}>
                Jackets & Hoodies
              </button>
            </li>
            <li>
              <button className="mobile-nav-link-item" onClick={() => handleNavTo('shop', 'shoes')}>
                Shoes & Slides
              </button>
            </li>
            <li>
              <button className="mobile-nav-link-item" onClick={() => handleNavTo('shop', 'headwear')}>
                Headwear
              </button>
            </li>
            <li>
              <button className="mobile-nav-link-item" onClick={() => handleNavTo('shop', 'accessories')}>
                Bags & Accessories
              </button>
            </li>
          </ul>

          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="currency-dropdown"
                style={{ flex: 1 }}
              >
                {Object.values(CURRENCIES).map(cur => (
                  <option key={cur.code} value={cur.code}>{cur.label}</option>
                ))}
              </select>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
