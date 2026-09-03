import React from 'react';
import { Search, Sparkles, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import ProductCard from './ProductCard';

export default function ShopAllPage() {
  const {
    products, activeCategory, setActiveCategory,
    searchQuery, setSearchQuery, sortBy, setSortBy,
    setCurrentRoute
  } = useStore();

  let filteredProducts = products.filter(item => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <section className="catalog-container">
      {/* Page Header */}
      <div className="catalog-page-header">
        <button
          onClick={() => { setCurrentRoute('storefront'); window.scrollTo({ top: 0 }); }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 700,
            color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em',
            marginBottom: '0.75rem', padding: 0
          }}
        >
          <ArrowLeft size={13} />
          <span>Back to Home</span>
        </button>
        <h1 className="catalog-page-title">
          {activeCategory === 'all' ? 'All Products' : CATEGORIES.find(c => c.id === activeCategory)?.label || 'All Products'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          {filteredProducts.length} {filteredProducts.length === 1 ? 'garment' : 'garments'} available
        </p>
      </div>

      {/* Subcategory Navigation Pills */}
      <div className="subcategory-nav">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`subcategory-pill ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search & Sort Controls */}
      <div className="catalog-controls">
        <div className="search-field-wrap">
          <Search size={14} className="search-field-icon" />
          <input
            type="text"
            placeholder="Search garments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-field"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="currency-dropdown"
        >
          <option value="featured">Featured Drops</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center', padding: '3.5rem 1.5rem',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-light)'
        }}>
          <Sparkles size={28} style={{ color: 'var(--accent-gold)', margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>No Garments Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Try resetting your search or choosing another category.
          </p>
          <button className="btn btn-primary" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
