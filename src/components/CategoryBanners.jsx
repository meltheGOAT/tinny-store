import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function CategoryBanners() {
  const { setCurrentRoute, setActiveCategory } = useStore();

  const categories = [
    {
      id: 'tops',
      title: 'Shirts & Tops',
      subtitle: 'Heavyweight Cotton & Crochet',
      itemCount: '12 Styles',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85'
    },
    {
      id: 'outerwear',
      title: 'Jackets & Hoodies',
      subtitle: 'Double-Knit & Bouclé',
      itemCount: '8 Styles',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85'
    },
    {
      id: 'bottoms',
      title: 'Bottoms & Shorts',
      subtitle: 'Pinched Pleat Tapers',
      itemCount: '6 Styles',
      image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1000&q=85'
    },
    {
      id: 'headwear',
      title: 'Headwear & Caps',
      subtitle: 'Structured Cavalry Twill',
      itemCount: '5 Styles',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=85'
    }
  ];

  const handleTileClick = (catId) => {
    setCurrentRoute('shop');
    setActiveCategory(catId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="category-banners-section">
      <div className="section-header-minimal">
        <div className="section-header-left">
          <span className="section-eyebrow-clean">
            <Sparkles size={12} style={{ color: 'var(--accent-gold)' }} />
            Curated Categories
          </span>
          <h2 className="section-title-clean">EXPLORE DEPARTMENTS</h2>
        </div>
        <button className="view-all-link-btn" onClick={() => handleTileClick('all')}>
          <span>View All Categories</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="category-banners-grid">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="category-banner-card"
            onClick={() => handleTileClick(cat.id)}
          >
            <img 
              src={cat.image} 
              alt={cat.title} 
              className="category-banner-img"
              loading="lazy"
            />
            <div className="category-banner-overlay">
              <div className="category-banner-meta">
                <span className="category-banner-count">{cat.itemCount}</span>
                <span className="category-banner-subtitle">{cat.subtitle}</span>
              </div>
              <div className="category-banner-title-row">
                <h3 className="category-banner-title">{cat.title}</h3>
                <div className="category-banner-arrow-btn">
                  <ArrowUpRight size={15} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
