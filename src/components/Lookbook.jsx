import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Lookbook() {
  const { setCurrentRoute, setActiveCategory } = useStore();

  const lookbooks = [
    {
      id: 1, 
      title: 'Dominion Tracksuit Capsule', 
      tag: 'Heavyweight Cotton',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
      category: 'outerwear'
    },
    {
      id: 2, 
      title: 'Artisanal Crochet & Knits', 
      tag: 'Hand-Crafted',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
      category: 'tops'
    },
    {
      id: 3, 
      title: 'Apex Twill & Headwear', 
      tag: 'Core Essentials',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
      category: 'headwear'
    },
    {
      id: 4, 
      title: 'Kinetic Performance Sets', 
      tag: 'Abuja Athleisure',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=85',
      category: 'bottoms'
    }
  ];

  const handleClick = (cat) => {
    setCurrentRoute('shop');
    setActiveCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="lookbook-section" className="lookbook-section">
      <div className="section-header-minimal">
        <div className="section-header-left">
          <span className="section-eyebrow-clean">
            <Sparkles size={12} style={{ color: 'var(--accent-gold)' }} />
            SS26 Campaign
          </span>
          <h2 className="section-title-clean">EDITORIAL LOOKBOOK</h2>
        </div>
        <button className="view-all-link-btn" onClick={() => handleClick('all')}>
          <span>View All Series</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="lookbook-gallery-grid">
        {lookbooks.map(item => (
          <div key={item.id} className="lookbook-item-box" onClick={() => handleClick(item.category)}>
            <img src={item.image} alt={item.title} className="lookbook-item-img" loading="lazy" />
            <div className="lookbook-item-overlay">
              <span className="lookbook-item-tag">{item.tag}</span>
              <h3 className="lookbook-item-title">{item.title}</h3>
              <div className="lookbook-item-link">
                <span>Explore Series</span>
                <ArrowRight size={12} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
