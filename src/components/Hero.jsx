import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Hero() {
  const { setCurrentRoute, setActiveCategory } = useStore();

  const handleShopDrop = () => {
    setCurrentRoute('shop');
    setActiveCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="tinny-hero">
      <div
        className="hero-banner-frame"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2200&q=90')`
        }}
      >
        <div className="hero-banner-overlay"></div>
        <div className="hero-banner-content">
          <div className="hero-tagline-badge">
            <Sparkles size={11} style={{ color: 'var(--accent-gold)' }} />
            <span>SPRING / SUMMER 2026 • ABUJA</span>
          </div>

          <h1 className="hero-headline">
            THE WORLD<br />IS YOURS
          </h1>

          <p className="hero-desc-text">
            Bespoke African luxury streetwear. Handcrafted in Maitama atelier with Free Same-Day Delivery in Abuja.
          </p>

          <div className="hero-buttons-row">
            <button className="btn btn-primary" onClick={handleShopDrop}>
              <span>Explore Collection</span>
              <ArrowRight size={14} />
            </button>
            <a 
              href="#lookbook-section" 
              className="btn btn-secondary hero-lookbook-btn"
            >
              <span>View Lookbook</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
