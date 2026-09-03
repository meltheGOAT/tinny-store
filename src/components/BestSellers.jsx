import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';

export default function BestSellers() {
  const { products, setCurrentRoute, setActiveCategory } = useStore();

  const bestSellers = products.filter(p => p.isBestSeller);

  const handleViewAll = () => {
    setCurrentRoute('shop');
    setActiveCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="bestsellers-section">
      <div className="section-header-minimal">
        <div className="section-header-left">
          <span className="section-eyebrow-clean">
            <Flame size={12} style={{ color: 'var(--accent-gold)' }} />
            Trending In Abuja
          </span>
          <h2 className="section-title-clean">BEST SELLERS</h2>
        </div>
        <button className="view-all-link-btn" onClick={handleViewAll}>
          <span>Shop All Products ({products.length})</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="products-grid">
        {bestSellers.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
