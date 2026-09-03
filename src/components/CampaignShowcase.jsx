import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function CampaignShowcase() {
  const { setCurrentRoute, setActiveCategory } = useStore();

  const handleNav = (category) => {
    setCurrentRoute('shop');
    setActiveCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="campaign-duo-section">
      <div className="campaign-duo-grid">
        {/* Campaign 1 */}
        <div className="campaign-tile" onClick={() => handleNav('outerwear')}>
          <img 
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=90" 
            alt="Abuja Manor Capsule" 
            className="campaign-tile-img"
            loading="lazy"
          />
          <div className="campaign-tile-overlay">
            <div className="campaign-tile-top">
              <span className="campaign-tile-pill">
                <Sparkles size={11} style={{ color: 'var(--accent-gold)' }} />
                SS26 Drop
              </span>
            </div>
            <div className="campaign-tile-bottom">
              <span className="campaign-tile-sub">Atelier Maitama</span>
              <h2 className="campaign-tile-title">ABUJA MANOR CAPSULE</h2>
              <button className="campaign-tile-btn">
                <span>Shop Outerwear</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Campaign 2 */}
        <div className="campaign-tile" onClick={() => handleNav('tops')}>
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=90" 
            alt="The Artisanal Summer Edition" 
            className="campaign-tile-img"
            loading="lazy"
          />
          <div className="campaign-tile-overlay">
            <div className="campaign-tile-top">
              <span className="campaign-tile-pill">
                <Sparkles size={11} style={{ color: 'var(--accent-gold)' }} />
                Exclusive
              </span>
            </div>
            <div className="campaign-tile-bottom">
              <span className="campaign-tile-sub">Hand-Crochet & Knits</span>
              <h2 className="campaign-tile-title">ARTISANAL ESSENTIALS</h2>
              <button className="campaign-tile-btn">
                <span>Explore Tops</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
