import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Dumbbell, Tag, Copy, Check, Flame } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function SpotlightDrop() {
  const { setCurrentRoute, setActiveCategory, showToast } = useStore();
  const [copied, setCopied] = useState(false);

  const discountCode = 'PUMP20';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(discountCode);
    setCopied(true);
    showToast('Code PUMP20 copied! 20% Off at checkout', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShopGym = () => {
    setCurrentRoute('shop');
    setActiveCategory('tops');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="spotlight-section">
      <div className="spotlight-card">
        {/* Media 1: Action Model Shot */}
        <div className="spotlight-media-wrap">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=90" 
            alt="Tinny Kinetic Gym & Performance Wear" 
            className="spotlight-media-img"
            loading="lazy"
          />
          <div className="spotlight-badge-tag">
            <Flame size={12} style={{ color: '#ff5722' }} />
            <span>Abuja Kinetic Drop</span>
          </div>
        </div>

        {/* Media 2: Texture & On-Body Detail */}
        <div className="spotlight-media-wrap secondary-spotlight-media">
          <img 
            src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=90" 
            alt="Kinetic Pump Cover Detail" 
            className="spotlight-media-img"
            loading="lazy"
          />
        </div>

        {/* Content Side with Minimal Text & Ashluxe Styling */}
        <div className="spotlight-content-wrap">
          <div className="spotlight-eyebrow">
            <Dumbbell size={13} style={{ color: 'var(--accent-gold)' }} />
            <span>PERFORMANCE CAPSULE</span>
          </div>

          <h2 className="spotlight-heading">
            TINNY KINETIC <br />GYM APPAREL
          </h2>

          <p className="spotlight-body-text">
            320GSM breathable carded pump covers and 4-way compression knits engineered for Abuja lifters.
          </p>

          <ul className="spotlight-features-list">
            <li>
              <CheckCircle2 size={15} style={{ color: 'var(--accent-gold)' }} />
              <span>320GSM Heavyweight Carded Cotton</span>
            </li>
            <li>
              <CheckCircle2 size={15} style={{ color: 'var(--accent-gold)' }} />
              <span>Anti-Odor Thermal Breathable Yarn</span>
            </li>
            <li>
              <CheckCircle2 size={15} style={{ color: 'var(--accent-gold)' }} />
              <span>Free Same-Day Delivery in Abuja</span>
            </li>
          </ul>

          {/* Discount Gimmick Widget */}
          <div className="discount-gimmick-box">
            <div className="discount-gimmick-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Tag size={14} style={{ color: 'var(--accent-gold)' }} />
                <span className="discount-gimmick-title">GYM LAUNCH OFFER</span>
              </div>
              <span className="discount-gimmick-badge">20% OFF</span>
            </div>

            <div className="discount-code-pill-row">
              <div className="discount-code-display">
                <code>{discountCode}</code>
              </div>
              <button 
                type="button"
                className="btn btn-secondary discount-copy-btn" 
                onClick={handleCopyCode}
                title="Copy Promo Code"
              >
                {copied ? <Check size={13} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={13} />}
                <span>{copied ? 'COPIED!' : 'COPY CODE'}</span>
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="spotlight-cta-row">
            <button className="btn btn-primary" onClick={handleShopGym}>
              <span>Shop Gym Drop</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
