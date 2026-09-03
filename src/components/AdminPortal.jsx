import React, { useState } from 'react';
import {
  LayoutDashboard, Store, PlusCircle, AlertCircle,
  CheckCircle2, Upload, ArrowLeft
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, CATEGORIES } from '../data/products';

export default function AdminPortal() {
  const { setCurrentRoute, showToast } = useStore();

  const [productTitle, setProductTitle] = useState('');
  const [productCategory, setProductCategory] = useState('tops');
  const [productPrice, setProductPrice] = useState('');
  const [productBadge, setProductBadge] = useState('New Arrival');
  const [productDescription, setProductDescription] = useState('');

  const handleMockPublish = (e) => {
    e.preventDefault();
    showToast('Product draft queued. (Backend sync coming soon)', 'info');
  };

  return (
    <main className="admin-view-wrap">
      {/* Header */}
      <div className="admin-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button
            onClick={() => { setCurrentRoute('storefront'); window.scrollTo({ top: 0 }); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 700,
              color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em',
              marginBottom: '0.65rem', padding: 0
            }}
          >
            <ArrowLeft size={12} />
            <span>Back to Storefront</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
            <LayoutDashboard size={13} />
            <span>Tinny Studio Management</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase' }}>Admin Product Studio</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Manage drops, configure pricing, and push new garments to the storefront.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setCurrentRoute('storefront'); window.scrollTo({ top: 0 }); }}>
          <Store size={14} />
          <span>View Storefront</span>
        </button>
      </div>

      {/* Stats */}
      <div className="admin-grid-stats">
        <div className="admin-stat-card">
          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#777', marginBottom: '0.3rem' }}>Live Products</div>
          <div className="admin-stat-num">{PRODUCTS.length}</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--accent-emerald)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <CheckCircle2 size={11} /><span>Active</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#777', marginBottom: '0.3rem' }}>Collections</div>
          <div className="admin-stat-num">3</div>
          <div style={{ fontSize: '0.68rem', color: '#555', marginTop: '0.2rem' }}>AW '26</div>
        </div>
        <div className="admin-stat-card">
          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#777', marginBottom: '0.3rem' }}>Currencies</div>
          <div className="admin-stat-num">4</div>
          <div style={{ fontSize: '0.68rem', color: '#555', marginTop: '0.2rem' }}>NGN, USD, GBP, EUR</div>
        </div>
        <div className="admin-stat-card">
          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#777', marginBottom: '0.3rem' }}>Satisfaction</div>
          <div className="admin-stat-num">4.9 ★</div>
          <div style={{ fontSize: '0.68rem', color: '#555', marginTop: '0.2rem' }}>Verified</div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="admin-box" style={{ borderColor: 'var(--accent-gold)' }}>
        <div style={{
          background: 'var(--accent-gold-light)', border: '1px solid var(--accent-gold)',
          borderRadius: 'var(--radius-xs)', padding: '0.85rem 1rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem'
        }}>
          <AlertCircle size={20} style={{ color: 'var(--accent-gold-hover)', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#212121', textTransform: 'uppercase' }}>
              Admin Engine — Coming Soon
            </div>
            <div style={{ fontSize: '0.76rem', color: '#555' }}>
              Frontend is the priority. Preview the product creation form below.
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <PlusCircle size={16} style={{ color: 'var(--accent-gold)' }} />
          <span>Create New Garment</span>
        </h2>

        <form onSubmit={handleMockPublish}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Title</label>
              <input type="text" placeholder="e.g. Tinny Heavyweight Tee" value={productTitle} onChange={(e) => setProductTitle(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xs)', fontSize: '0.8rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Category</label>
              <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xs)', fontSize: '0.8rem', outline: 'none' }}>
                {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Price (USD)</label>
              <input type="number" placeholder="150" value={productPrice} onChange={(e) => setProductPrice(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xs)', fontSize: '0.8rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Badge</label>
              <select value={productBadge} onChange={(e) => setProductBadge(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xs)', fontSize: '0.8rem', outline: 'none' }}>
                <option value="New Arrival">New Arrival</option>
                <option value="Limited Edition">Limited Edition</option>
                <option value="Best Seller">Best Seller</option>
                <option value="Pre-Order">Pre-Order</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Description</label>
            <textarea rows={3} placeholder="Describe fabric, fit, stitching..." value={productDescription} onChange={(e) => setProductDescription(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.75rem', background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xs)', fontSize: '0.8rem', outline: 'none', resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button type="submit" className="btn btn-primary">
              <Upload size={14} /><span>Save (Coming Soon)</span>
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => { setCurrentRoute('storefront'); window.scrollTo({ top: 0 }); }}>
              Back to Storefront
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
