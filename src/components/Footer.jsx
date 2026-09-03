import React, { useState } from 'react';
import { ArrowRight, Globe, ShieldCheck, MapPin, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Footer() {
  const { setCurrentRoute, setActiveCategory, showToast } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('Subscribed to TINNY Abuja private drop notifications.', 'success');
      setEmail('');
    }
  };

  const handleCategoryNav = (cat) => {
    setCurrentRoute('shop');
    setActiveCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="tinny-footer">
      <div className="footer-inner-grid">
        {/* Brand Column */}
        <div>
          <div style={{ marginBottom: '0.65rem' }}>
            <span className="tinny-logo-text" style={{ fontSize: '1.35rem' }}>TINNY</span>
            <div className="tinny-logo-slogan" style={{ fontSize: '0.55rem' }}>Timeless Style. Modern You • Abuja</div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '1.25rem', maxWidth: '320px', lineHeight: 1.55 }}>
            Abuja-based luxury streetwear & high-performance athletic apparel. Handcrafted with structural precision and heavyweight organic cottons.
          </p>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.74rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Truck size={13} style={{ color: 'var(--accent-gold)' }} />
              <span>Free Abuja Delivery</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={13} style={{ color: 'var(--accent-gold)' }} />
              <span>Verified Quality</span>
            </span>
          </div>
        </div>

        {/* Collections Links */}
        <div>
          <h4 style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.85rem' }}>
            Collections
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <li>
              <button 
                onClick={() => handleCategoryNav('all')}
                style={{ background: 'none', border: 'none', font: 'inherit', fontSize: '0.78rem', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
              >
                Shop All
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleCategoryNav('tops')}
                style={{ background: 'none', border: 'none', font: 'inherit', fontSize: '0.78rem', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
              >
                Shirts & Tops
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleCategoryNav('bottoms')}
                style={{ background: 'none', border: 'none', font: 'inherit', fontSize: '0.78rem', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
              >
                Bottoms & Shorts
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleCategoryNav('outerwear')}
                style={{ background: 'none', border: 'none', font: 'inherit', fontSize: '0.78rem', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
              >
                Jackets & Hoodies
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleCategoryNav('headwear')}
                style={{ background: 'none', border: 'none', font: 'inherit', fontSize: '0.78rem', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
              >
                Headwear & Accessories
              </button>
            </li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h4 style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.85rem' }}>
            Flagship & Info
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <li><span style={{ fontWeight: 700, color: '#212121' }}>Maitama / Wuse 2, Abuja, FCT</span></li>
            <li><span>Free Same-Day Delivery (Abuja)</span></li>
            <li><a href="#lookbook-section" style={{ color: 'inherit', textDecoration: 'none' }}>Lookbook 2026</a></li>
            <li><span>14-Day Boutique Exchanges</span></li>
            <li><span>Nationwide & Global Courier</span></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>
            Abuja VIP Drop Access
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '0.75rem', lineHeight: 1.45 }}>
            Be first to access limited seasonal releases and members-only restocks in Abuja.
          </p>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.4rem' }}>
            <input 
              type="email" 
              placeholder="Email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '0.55rem 0.75rem',
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.78rem',
                outline: 'none'
              }}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ padding: '0.55rem 0.85rem' }}
              aria-label="Subscribe"
            >
              <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div>
          © {new Date().getFullYear()} TINNY ABUJA. TIMELESS STYLE. MODERN YOU. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <span>Free Abuja Shipping</span>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
