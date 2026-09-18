import React from 'react';
import { Search, Sparkles, ArrowLeft, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import ProductCard from './ProductCard';
import tinnyLogo from '../assets/tinnylogo.PNG';

export default function ShopAllPage() {
  const {
    products, activeCategory, setActiveCategory,
    searchQuery, setSearchQuery, sortBy, setSortBy,
    setCurrentRoute
  } = useStore();

  const trimmedQuery = (searchQuery || '').trim().toLowerCase();

  const matchesSearch = (item, q) => {
    if (!q) return true;
    const title = (item.title || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    const catLabel = (item.categoryLabel || '').toLowerCase();
    const cat = (item.category || '').toLowerCase();
    const sku = (item.sku || '').toLowerCase();
    const badge = (item.badge || '').toLowerCase();

    const colorsMatch = Array.isArray(item.colors) && item.colors.some(c =>
      (typeof c === 'string' ? c : c?.name || '').toLowerCase().includes(q)
    );

    const detailsMatch = Array.isArray(item.details) && item.details.some(d =>
      typeof d === 'string' && d.toLowerCase().includes(q)
    );

    return title.includes(q) ||
      desc.includes(q) ||
      catLabel.includes(q) ||
      cat.includes(q) ||
      sku.includes(q) ||
      badge.includes(q) ||
      colorsMatch ||
      detailsMatch;
  };

  let filteredProducts = products.filter(item => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    return matchesCat && matchesSearch(item, trimmedQuery);
  });

  const globalMatchesCount = trimmedQuery && activeCategory !== 'all'
    ? products.filter(item => matchesSearch(item, trimmedQuery)).length
    : 0;

  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <section className="catalog-container">
      {/* Page Header with TINNY Logo on the left */}
      <div className="catalog-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.85rem' }}>
          <img
            src={tinnyLogo}
            alt="TINNY"
            onClick={() => {
              setCurrentRoute('storefront');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            title="TINNY Abuja - Return to Home"
            style={{
              height: '52px',
              width: 'auto',
              objectFit: 'contain',
              cursor: 'pointer',
              display: 'block',
              transition: 'transform 200ms ease, opacity 200ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.opacity = '0.85';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.opacity = '1';
            }}
          />
          <div>
            <button
              onClick={() => { setCurrentRoute('storefront'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 700,
                color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em',
                marginBottom: '0.2rem', padding: 0
              }}
            >
              <ArrowLeft size={13} />
              <span>Back to Home</span>
            </button>
            <h1 className="catalog-page-title" style={{ margin: 0, lineHeight: 1.15 }}>
              {activeCategory === 'all' ? 'All Products' : CATEGORIES.find(c => c.id === activeCategory)?.label || 'All Products'}
            </h1>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
          {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} available
          {trimmedQuery && ` for "${searchQuery.trim()}"`}
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
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-field"
            style={{ paddingRight: searchQuery ? '2.2rem' : '0.9rem' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
              }}
            >
              <X size={14} />
            </button>
          )}
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

      {/* Cross-Category Search Match Helper */}
      {trimmedQuery && activeCategory !== 'all' && filteredProducts.length === 0 && globalMatchesCount > 0 && (
        <div style={{
          marginBottom: '1.75rem',
          padding: '0.9rem 1.25rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-xs)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            No items in <strong>{CATEGORIES.find(c => c.id === activeCategory)?.label}</strong> match "{searchQuery.trim()}". Found <strong>{globalMatchesCount}</strong> matching in other departments.
          </span>
          <button
            onClick={() => setActiveCategory('all')}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}
          >
            Search All Products
          </button>
        </div>
      )}

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
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>No Items Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {trimmedQuery
              ? `No items match "${searchQuery.trim()}". Try another keyword or clear search.`
              : 'Try choosing another category.'}
          </p>
          <button className="btn btn-primary" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
