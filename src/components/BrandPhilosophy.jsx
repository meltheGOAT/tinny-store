import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function BrandPhilosophy() {
  const { setCurrentRoute } = useStore();

  return (
    <section className="philosophy-section">
      <div className="philosophy-visual-grid">
        <div className="philosophy-image-col">
          <img 
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=90" 
            alt="Tinny Abuja Atelier Tailoring" 
            className="philosophy-img"
            loading="lazy"
          />
        </div>

        <div className="philosophy-content-col">
          <div className="philosophy-eyebrow">
            <Sparkles size={13} style={{ color: 'var(--accent-gold)' }} />
            <span>TINNY ATELIER • MAITAMA, ABUJA</span>
          </div>

          <h2 className="philosophy-heading">
            REDEFINING <br />AFRICAN LUXURY <br />STREETWEAR
          </h2>

          <p className="philosophy-subtext">
            Precision tailoring. Heavyweight organic cottons. 
            Designed in Abuja for the global vanguard.
          </p>

          <div className="philosophy-badge-row">
            <div className="philosophy-mini-stat">
              <span className="mini-stat-val">420GSM</span>
              <span className="mini-stat-label">Double-Knit</span>
            </div>
            <div className="philosophy-mini-stat">
              <span className="mini-stat-val">FCT</span>
              <span className="mini-stat-label">Abuja Atelier</span>
            </div>
            <div className="philosophy-mini-stat">
              <span className="mini-stat-val">100%</span>
              <span className="mini-stat-label">Bespoke</span>
            </div>
          </div>

          <button 
            className="btn btn-primary philosophy-cta-btn"
            onClick={() => {
              setCurrentRoute('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span>Explore All Pieces</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="philosophy-image-col">
          <img 
            src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=90" 
            alt="Tinny Craftsmanship" 
            className="philosophy-img"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
