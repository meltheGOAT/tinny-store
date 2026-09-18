import React, { useState, useRef } from 'react';
import {
  LayoutDashboard, Store, PlusCircle, AlertCircle,
  CheckCircle2, Upload, ArrowLeft, LogOut, Lock,
  Eye, EyeOff, Search, Edit3, Trash2, Tag,
  ShoppingBag, Flame, Sparkles, X, Check, RefreshCw,
  SlidersHorizontal, MessageSquare, ExternalLink, ShieldCheck,
  Image as ImageIcon, MoveLeft, MoveRight, CloudUpload, HelpCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';

// Default empty product template mirroring the exact UI contract
const EMPTY_PRODUCT = {
  id: '',
  sku: '',
  title: '',
  category: 'tops',
  categoryLabel: 'Shirts & Tops',
  price: 185000,
  badge: 'New Arrival',
  badgeType: 'black',
  rating: 5.0,
  reviewsCount: 1,
  isBestSeller: false,
  inStock: true,
  images: [],
  colors: [
    { name: 'Pitch Black', hex: '#111111' },
    { name: 'Bone White', hex: '#f2eee6' }
  ],
  sizes: ['S', 'M', 'L', 'XL'],
  description: 'Precision-tailored piece handcrafted in Abuja with custom luxury hardware and breathable heavyweight materials.',
  details: [
    '320GSM Heavyweight Luxury Fabrication',
    'Signature TINNY bespoke hardware detailing',
    'Handcrafted in limited batches in Abuja, FCT'
  ]
};

// Comprehensive size presets grouped by department
const SIZE_PRESETS = {
  apparel: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'],
  shoesEU: ['EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45', 'EU 46'],
  shoesUS: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
  waist: ['28', '30', '32', '34', '36', '38']
};

export default function AdminPortal() {
  const {
    setCurrentRoute, showToast, formatPrice,
    products, addProduct, updateProduct, deleteProduct,
    toggleProductStock, toggleProductBestSeller, resetProductsToDefault,
    adminAuth, adminLogin, adminLogout, inquiries
  } = useStore();

  const API_BASE = import.meta.env.VITE_API_URL || 'https://tinny-api.onrender.com/api';
  const [mediaProviderInfo, setMediaProviderInfo] = useState({ provider: 'local', status: 'ready', cloudName: null });

  // Auth form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Check backend media pipeline provider on mount
  React.useEffect(() => {
    async function checkMediaStatus() {
      try {
        const res = await fetch(`${API_BASE}/admin/upload/status`);
        if (res.ok) {
          const info = await res.json();
          setMediaProviderInfo(info);
        }
      } catch (e) {
        // Backend offline or local preview
      }
    }
    checkMediaStatus();
  }, []);

  // Admin view states
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'inquiries'
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState('all');

  // Modal states for Create / Edit
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null); // null = new product, string = editing
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Media uploader states
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(100);
  const [isUploading, setIsUploading] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState(null);
  const [manualImageUrl, setManualImageUrl] = useState('');
  const fileInputRef = useRef(null);

  // Color adder input states
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#111111');

  // Size preset tab in modal
  const [activeSizeTab, setActiveSizeTab] = useState('apparel'); // 'apparel' | 'shoesEU' | 'shoesUS' | 'waist'
  const [customSizeInput, setCustomSizeInput] = useState('');

  // Detail bullet adder state
  const [newDetailText, setNewDetailText] = useState('');

  // Handle Admin Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await adminLogin(loginEmail, loginPassword);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleFillDemoCreds = () => {
    setLoginEmail('admin@tinny.store');
    setLoginPassword('tinny2026');
  };

  // Open modal to add new product
  const handleOpenAddModal = () => {
    const newSku = `TNY-${productForm.category.toUpperCase().slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`;
    setProductForm({
      ...EMPTY_PRODUCT,
      id: `tny-${Date.now().toString().slice(-4)}`,
      sku: newSku,
      price: 185000
    });
    setEditingProductId(null);
    setUploadProgress(100);
    setIsUploading(false);
    setIsProductModalOpen(true);
  };

  // Open modal to edit existing product
  const handleOpenEditModal = (product) => {
    setProductForm({
      ...product,
      price: product.price ? Number(product.price) : ''
    });
    setEditingProductId(product.id);
    setUploadProgress(100);
    setIsUploading(false);
    setIsProductModalOpen(true);
  };

  // Handle category change in form and sync categoryLabel
  const handleFormCategoryChange = (e) => {
    const cat = e.target.value;
    const catObj = CATEGORIES.find(c => c.id === cat);
    setProductForm(prev => ({
      ...prev,
      category: cat,
      categoryLabel: catObj ? (catObj.name || catObj.label) : cat.toUpperCase()
    }));

    // Auto switch size tabs if shoes category is chosen
    if (cat === 'shoes') {
      setActiveSizeTab('shoesEU');
    } else if (cat === 'bottoms') {
      setActiveSizeTab('waist');
    } else {
      setActiveSizeTab('apparel');
    }
  };

  // =========================================================================
  // DRAG & DROP MEDIA UPLOADER HANDLERS (CLOUDINARY & DIRECT BACKEND STREAM)
  // =========================================================================

  const processFiles = async (files) => {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      showToast('Please select valid image files (JPG, PNG, WebP)', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    // 1. Create immediate client previews
    const tempPreviews = validFiles.map(file => URL.createObjectURL(file));

    // Append previews into form
    setProductForm(prev => ({
      ...prev,
      images: [...prev.images, ...tempPreviews]
    }));
    setUploadProgress(40);

    // 2. Upload concurrently to backend API (Cloudinary CDN)
    try {
      if (!adminAuth?.token) {
        showToast('Please login with admin credentials to upload images', 'error');
        // Clean up previews
        setProductForm(prev => ({
          ...prev,
          images: prev.images.filter(img => !tempPreviews.includes(img))
        }));
        tempPreviews.forEach(blob => URL.revokeObjectURL(blob));
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      validFiles.forEach(file => {
        formData.append('images', file);
      });

      setUploadProgress(60);
      const res = await fetch(`${API_BASE}/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminAuth.token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        if (data.urls && data.urls.length > 0) {
          // Replace each temporary blob URL directly with its permanent Cloudinary CDN URL
          setProductForm(prev => {
            const updated = [...prev.images];
            tempPreviews.forEach((blobUrl, i) => {
              const uploadedUrl = data.urls[i];
              if (uploadedUrl) {
                const targetIdx = updated.indexOf(blobUrl);
                if (targetIdx !== -1) {
                  updated[targetIdx] = uploadedUrl;
                } else {
                  updated.push(uploadedUrl);
                }
              }
              // Clean up blob URL memory
              URL.revokeObjectURL(blobUrl);
            });
            return { ...prev, images: updated };
          });

          setUploadProgress(100);
          setIsUploading(false);
          const provText = data.provider === 'cloudinary' ? 'Cloudinary CDN' : 'TINNY Media Server';
          showToast(`Uploaded ${data.urls.length} photo(s) to ${provText}`, 'success');
          return;
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Server rejected image upload');
      }
    } catch (err) {
      console.warn('Image upload failed:', err.message);
      showToast(`Upload failed: ${err.message}`, 'error');
      // Clean up failed blob previews so broken URLs are not saved
      setProductForm(prev => ({
        ...prev,
        images: prev.images.filter(img => !tempPreviews.includes(img))
      }));
      tempPreviews.forEach(blob => URL.revokeObjectURL(blob));
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleAddManualUrl = () => {
    if (!manualImageUrl.trim()) return;
    setProductForm(prev => ({
      ...prev,
      images: [...prev.images, manualImageUrl.trim()]
    }));
    setManualImageUrl('');
    showToast('Image URL added to gallery', 'info');
  };

  const handleRemoveImage = (indexToRemove) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Drag-to-reorder between image preview cards
  const handleCardDragStart = (e, index) => {
    setDraggedImageIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCardDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleCardDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedImageIndex === null || draggedImageIndex === targetIndex) return;

    setProductForm(prev => {
      const updated = [...prev.images];
      const [draggedItem] = updated.splice(draggedImageIndex, 1);
      updated.splice(targetIndex, 0, draggedItem);
      return { ...prev, images: updated };
    });
    setDraggedImageIndex(null);
    showToast('Image order updated', 'info');
  };

  const handleMoveImage = (fromIndex, direction) => {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= productForm.images.length) return;

    setProductForm(prev => {
      const updated = [...prev.images];
      const temp = updated[fromIndex];
      updated[fromIndex] = updated[toIndex];
      updated[toIndex] = temp;
      return { ...prev, images: updated };
    });
  };

  // Color management
  const handleAddColor = () => {
    if (!newColorName.trim()) {
      showToast('Please enter a color name', 'info');
      return;
    }
    setProductForm(prev => ({
      ...prev,
      colors: [...prev.colors, { name: newColorName.trim(), hex: newColorHex }]
    }));
    setNewColorName('');
  };

  const handleRemoveColor = (indexToRemove) => {
    setProductForm(prev => ({
      ...prev,
      colors: prev.colors.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Size pill toggle
  const handleToggleSize = (size) => {
    setProductForm(prev => {
      const exists = prev.sizes.includes(size);
      const nextSizes = exists
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: nextSizes };
    });
  };

  const handleAddCustomSize = () => {
    if (!customSizeInput.trim()) return;
    const cleanSize = customSizeInput.trim();
    if (!productForm.sizes.includes(cleanSize)) {
      setProductForm(prev => ({
        ...prev,
        sizes: [...prev.sizes, cleanSize]
      }));
    }
    setCustomSizeInput('');
  };

  // Detail bullet management
  const handleAddDetail = () => {
    if (!newDetailText.trim()) return;
    setProductForm(prev => ({
      ...prev,
      details: [...prev.details, newDetailText.trim()]
    }));
    setNewDetailText('');
  };

  const handleRemoveDetail = (idxToRemove) => {
    setProductForm(prev => ({
      ...prev,
      details: prev.details.filter((_, idx) => idx !== idxToRemove)
    }));
  };

  // Form Save
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (isUploading) {
      showToast('Please wait for photos to finish uploading before saving', 'error');
      return;
    }
    if (!productForm.title.trim()) {
      showToast('Please provide a product title', 'error');
      return;
    }
    if (productForm.price === '' || Number(productForm.price) <= 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }
    if (!productForm.images || productForm.images.length === 0) {
      showToast('Please add at least one product image before publishing', 'error');
      return;
    }
    const hasUnsavedBlobs = productForm.images.some(img => typeof img === 'string' && img.startsWith('blob:'));
    if (hasUnsavedBlobs) {
      showToast('Some photos are still uploading or failed. Please wait or remove them before saving.', 'error');
      return;
    }

    const payload = {
      ...productForm,
      price: Number(productForm.price)
    };

    setIsUploading(true);
    let ok = false;
    try {
      if (editingProductId) {
        ok = await updateProduct(editingProductId, payload);
      } else {
        ok = await addProduct(payload);
      }
      if (ok) {
        setIsProductModalOpen(false);
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Filtered products for table
  const filteredProducts = products.filter(p => {
    const matchCat = catalogCategory === 'all' || p.category === catalogCategory;
    const matchQuery = !catalogSearch.trim() ||
      p.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(catalogSearch.toLowerCase()));
    return matchCat && matchQuery;
  });

  // =========================================================================
  // 1. GATED AUTHENTICATION SCREEN (When user is not logged in)
  // =========================================================================
  if (!adminAuth.isAuthenticated) {
    return (
      <main className="admin-login-screen">
        <div className="admin-login-card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="tinny-logo-text" style={{ fontSize: '1.8rem', letterSpacing: '0.22em' }}>TINNY</span>
            <div style={{
              fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.24em',
              color: 'var(--accent-gold)', textTransform: 'uppercase', marginTop: '0.35rem'
            }}>
              Atelier Management Studio
            </div>
          </div>

          <div style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-xs)', padding: '0.85rem 1rem', marginBottom: '1.75rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem'
          }}>
            <Lock size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
            <div style={{ fontSize: '0.74rem', color: '#555', lineHeight: 1.4 }}>
              <strong>Restricted Access</strong>: Sign in with authorized administrator credentials to manage catalog drops, pricing, and orders.
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@tinny.store"
                className="admin-form-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="admin-form-input"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 0
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', justifyContent: 'center' }}
            >
              {loginLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Enter Studio Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleFillDemoCreds}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '0.72rem', color: 'var(--accent-gold-hover)', textDecoration: 'underline', fontWeight: 700
              }}
            >
              Quick Test: Auto-fill Demo Credentials (admin@tinny.store)
            </button>

            <button
              type="button"
              onClick={() => { setCurrentRoute('storefront'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '0.74rem', color: '#777', display: 'flex', alignItems: 'center', gap: '0.35rem'
              }}
            >
              <ArrowLeft size={13} />
              <span>Return to Customer Storefront</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================================
  // 2. AUTHENTICATED ADMIN STUDIO DASHBOARD
  // =========================================================================
  const inStockCount = products.filter(p => p.inStock).length;
  const bestSellerCount = products.filter(p => p.isBestSeller).length;

  return (
    <main className="admin-view-wrap">
      {/* Top Header Bar */}
      <header className="admin-box" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span className="tinny-logo-text" style={{ fontSize: '1.3rem' }}>TINNY</span>
              <span style={{
                background: 'var(--accent-gold-light)', color: 'var(--accent-gold-hover)',
                fontSize: '0.62rem', fontWeight: 800, padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-xs)', textTransform: 'uppercase', letterSpacing: '0.08em'
              }}>
                Abuja Flagship Studio
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>Authenticated as: <strong>{adminAuth.user?.email || 'admin@tinny.store'}</strong></span>
              <span>•</span>
              <span style={{ color: 'var(--accent-emerald)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                <CheckCircle2 size={12} /> Live Sync Active
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary"
              onClick={() => { setCurrentRoute('storefront'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{ padding: '0.65rem 1rem', fontSize: '0.74rem' }}
            >
              <Store size={14} />
              <span>View Storefront</span>
            </button>

            <button
              className="btn btn-primary"
              onClick={handleOpenAddModal}
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.74rem' }}
            >
              <PlusCircle size={15} />
              <span>Add New Product</span>
            </button>

            <button
              className="btn-icon"
              title="Sign Out"
              onClick={adminLogout}
              style={{ border: '1px solid var(--border-light)', width: '38px', height: '38px' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Metrics Row */}
      <section className="admin-grid-stats">
        <div className="admin-stat-card">
          <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#777', marginBottom: '0.25rem' }}>
            Total Products
          </div>
          <div className="admin-stat-num">{products.length}</div>
          <div style={{ fontSize: '0.7rem', color: '#555', marginTop: '0.25rem' }}>
            Active in catalog
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#777', marginBottom: '0.25rem' }}>
            Availability
          </div>
          <div className="admin-stat-num">{inStockCount} / {products.length}</div>
          <div style={{ fontSize: '0.7rem', color: inStockCount === products.length ? 'var(--accent-emerald)' : '#ab8c52', marginTop: '0.25rem' }}>
            {products.length - inStockCount} items currently Sold Out
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#777', marginBottom: '0.25rem' }}>
            Best Sellers Active
          </div>
          <div className="admin-stat-num">{bestSellerCount}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold-hover)', marginTop: '0.25rem' }}>
            Featured on homepage
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#777', marginBottom: '0.25rem' }}>
            WhatsApp Inquiries
          </div>
          <div className="admin-stat-num">{inquiries.length}</div>
          <div style={{ fontSize: '0.7rem', color: '#555', marginTop: '0.25rem' }}>
            Customer checkout leads
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('products')}
          style={{
            background: activeTab === 'products' ? '#181818' : 'none',
            color: activeTab === 'products' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-xs)',
            fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em'
          }}
        >
          <ShoppingBag size={14} />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          style={{
            background: activeTab === 'inquiries' ? '#181818' : 'none',
            color: activeTab === 'inquiries' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-xs)',
            fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em'
          }}
        >
          <MessageSquare size={14} />
          <span>WhatsApp Inquiries ({inquiries.length})</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: PRODUCT CATALOG MANAGER
          ===================================================================== */}
      {activeTab === 'products' && (
        <section className="admin-box">
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
              {/* Search */}
              <div style={{ position: 'relative', minWidth: '240px' }}>
                <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                <input
                  type="text"
                  placeholder="Search products or SKU..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="admin-form-input"
                  style={{ paddingLeft: '2.2rem', paddingRight: '0.75rem' }}
                />
              </div>

              {/* Category Filter */}
              <select
                value={catalogCategory}
                onChange={(e) => setCatalogCategory(e.target.value)}
                className="admin-form-input"
                style={{ width: 'auto', padding: '0.55rem 1rem' }}
              >
                <option value="all">All Categories ({products.length})</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name || c.label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary"
                onClick={resetProductsToDefault}
                title="Restores the official curated TINNY collection"
                style={{ fontSize: '0.72rem', padding: '0.55rem 0.85rem' }}
              >
                <RefreshCw size={13} />
                <span>Reset to Factory Drops</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Badge</th>
                  <th>Best Seller</th>
                  <th>Stock Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#888' }}>
                      No products match your current search or category filter.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(product => (
                    <tr key={product.id}>
                      {/* Product Thumbnail & Title */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img
                            src={product.images && product.images[0]}
                            alt={product.title}
                            style={{ width: '46px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-xs)', background: '#f0f0f0' }}
                          />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#181818' }}>
                              {product.title}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#777', display: 'flex', gap: '0.35rem', marginTop: '0.15rem' }}>
                              <span>{product.sizes?.length || 0} Sizes</span>
                              <span>•</span>
                              <span>{product.colors?.length || 0} Colors</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#666' }}>
                        {product.sku || 'TNY-000'}
                      </td>

                      {/* Category */}
                      <td>
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem',
                          background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xs)', textTransform: 'uppercase'
                        }}>
                          {product.categoryLabel || product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>
                          {formatPrice(product.price)}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#777' }}>
                          {product.price >= 1000
                            ? `≈ $${Math.round(product.price / 1480)} USD`
                            : `≈ $${product.price} USD`}
                        </div>
                      </td>

                      {/* Badge */}
                      <td>
                        {product.badge ? (
                          <span className={`card-badge card-badge-${product.badgeType || 'black'}`} style={{ position: 'static', display: 'inline-block' }}>
                            {product.badge}
                          </span>
                        ) : (
                          <span style={{ color: '#aaa', fontSize: '0.7rem' }}>—</span>
                        )}
                      </td>

                      {/* Best Seller Toggle */}
                      <td>
                        <button
                          type="button"
                          onClick={() => toggleProductBestSeller(product.id)}
                          style={{
                            background: product.isBestSeller ? 'var(--accent-gold-light)' : '#f3f3f3',
                            border: `1px solid ${product.isBestSeller ? 'var(--accent-gold)' : '#ddd'}`,
                            color: product.isBestSeller ? 'var(--accent-gold-hover)' : '#777',
                            padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-xs)',
                            fontSize: '0.68rem', fontWeight: 800, cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                          }}
                        >
                          <Flame size={12} />
                          <span>{product.isBestSeller ? 'Best Seller' : 'Normal'}</span>
                        </button>
                      </td>

                      {/* In Stock Toggle */}
                      <td>
                        <button
                          type="button"
                          onClick={() => toggleProductStock(product.id)}
                          style={{
                            background: product.inStock ? 'rgba(46,125,50,0.1)' : 'rgba(211,47,47,0.1)',
                            border: `1px solid ${product.inStock ? '#2e7d32' : '#d32f2f'}`,
                            color: product.inStock ? '#2e7d32' : '#d32f2f',
                            padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-xs)',
                            fontSize: '0.68rem', fontWeight: 800, cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                          }}
                        >
                          {product.inStock ? <Check size={11} /> : <X size={11} />}
                          <span>{product.inStock ? 'In Stock' : 'Sold Out'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            className="btn-icon"
                            title="Edit Product"
                            onClick={() => handleOpenEditModal(product)}
                            style={{ width: '32px', height: '32px', border: '1px solid var(--border-light)' }}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            className="btn-icon"
                            title="Delete Product"
                            onClick={() => setProductToDelete(product)}
                            style={{ width: '32px', height: '32px', border: '1px solid #ffcdd2', color: '#d32f2f' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =====================================================================
          TAB 2: WHATSAPP CHECKOUT INQUIRIES
          ===================================================================== */}
      {activeTab === 'inquiries' && (
        <section className="admin-box">
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              WhatsApp Checkout Inquiries
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#666' }}>
              Every time a customer clicks "Checkout via WhatsApp" in the bag drawer, an order intent is logged here for sales tracking.
            </p>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Inquiry ID</th>
                  <th>Date & Time</th>
                  <th>Customer Location</th>
                  <th>Items Summary</th>
                  <th>Order Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#888' }}>
                      No checkout inquiries logged yet.
                    </td>
                  </tr>
                ) : (
                  inquiries.map(inq => (
                    <tr key={inq.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.74rem' }}>
                        {inq.id}
                      </td>
                      <td style={{ fontSize: '0.74rem', color: '#555' }}>
                        {new Date(inq.date).toLocaleString()}
                      </td>
                      <td style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                        {inq.buyerLocation || 'Abuja, FCT'}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.75rem' }}>
                          {inq.items?.map((it, idx) => (
                            <div key={idx} style={{ marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {it.image && (
                                <img
                                  src={it.image}
                                  alt={it.title}
                                  style={{ width: '28px', height: '34px', objectFit: 'cover', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-light)' }}
                                />
                              )}
                              <div>
                                <div><strong>{it.qty}x</strong> {it.title} ({it.size || 'M'} • {it.color || 'Standard'})</div>
                                {it.productLink && (
                                  <a
                                    href={it.productLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontSize: '0.66rem', color: 'var(--accent-gold-hover)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                                  >
                                    <span>View Piece Details</span>
                                    <ExternalLink size={10} />
                                  </a>
                                )}
                              </div>
                            </div>
                          )) || '1x Item'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, fontSize: '0.82rem' }}>
                          ₦{inq.totalNGN?.toLocaleString() || '0'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#777' }}>
                          (${inq.totalUSD || 0})
                        </div>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.68rem', fontWeight: 800, padding: '0.25rem 0.6rem',
                          borderRadius: 'var(--radius-xs)', background: 'rgba(46,125,50,0.1)', color: '#2e7d32'
                        }}>
                          {inq.status || 'Received'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =====================================================================
          3. CREATE / EDIT PRODUCT MODAL
          ===================================================================== */}
      {isProductModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsProductModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase' }}>
                  {editingProductId ? 'Edit Product Details' : 'Publish New Product Drop'}
                </h3>
                <div style={{ fontSize: '0.72rem', color: '#777' }}>
                  Fields mirror the exact storefront UI schema in <code>src/data/products.js</code>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setIsProductModalOpen(false)} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveProduct} style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: '78vh' }}>

              {/* STEP 1: DRAG & DROP MEDIA UPLOADER (FIRST STEP AS REQUESTED) */}
              <div style={{
                marginBottom: '2rem', padding: '1.25rem',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-xs)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{
                      background: '#181818', color: '#fff', fontSize: '0.62rem',
                      fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-xs)',
                      textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: '0.5rem'
                    }}>
                      Step 1
                    </span>
                    <strong style={{ fontSize: '0.85rem', textTransform: 'uppercase' }}>
                      Drag & Drop Product Gallery
                    </strong>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#666', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CloudUpload size={14} style={{ color: mediaProviderInfo.provider === 'cloudinary' ? 'var(--accent-emerald)' : 'var(--accent-gold)' }} />
                    <span>Pipeline: <strong>{mediaProviderInfo.provider === 'cloudinary' ? `Cloudinary CDN (${mediaProviderInfo.cloudName})` : 'TINNY Media Server (Auto-WebP Ready)'}</strong></span>
                  </div>
                </div>

                {/* Dropzone Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${isDraggingOver ? 'var(--accent-gold)' : '#ccc'}`,
                    background: isDraggingOver ? 'rgba(171, 140, 82, 0.08)' : '#ffffff',
                    borderRadius: 'var(--radius-xs)',
                    padding: '1.75rem 1rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    marginBottom: '1rem'
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  <CloudUpload size={32} style={{ color: isDraggingOver ? 'var(--accent-gold)' : '#888', margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#212121', marginBottom: '0.2rem' }}>
                    Drag & Drop high-res product photos here, or <span style={{ color: 'var(--accent-gold-hover)', textDecoration: 'underline' }}>Browse Files</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#777' }}>
                    Supports PNG, JPG, WEBP. Drag multiple images at once. Drag tiles below to reorder primary vs hover shots.
                  </div>
                </div>

                {/* Progress Bar */}
                {isUploading && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                      <span>Optimizing & preparing Cloudinary upload...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div style={{ height: '4px', background: '#e0e0e0', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${uploadProgress}%`, background: 'var(--accent-gold)', transition: 'width 200ms ease' }} />
                    </div>
                  </div>
                )}

                {/* Drag-to-Reorder Gallery Cards */}
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#666', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Active Product Image Sequence ({productForm.images.length})</span>
                    <span style={{ color: '#888', fontWeight: 600 }}>Tip: Drag cards or use arrows to change sequence</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                    {productForm.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        draggable
                        onDragStart={(e) => handleCardDragStart(e, idx)}
                        onDragOver={handleCardDragOver}
                        onDrop={(e) => handleCardDrop(e, idx)}
                        style={{
                          background: '#ffffff',
                          border: `1.5px solid ${idx === 0 ? 'var(--accent-gold)' : idx === 1 ? '#181818' : 'var(--border-light)'}`,
                          borderRadius: 'var(--radius-xs)',
                          overflow: 'hidden',
                          boxShadow: 'var(--shadow-subtle)',
                          cursor: 'grab',
                          position: 'relative',
                          transition: 'transform 150ms ease'
                        }}
                      >
                        {/* Slot Badge */}
                        <div style={{
                          position: 'absolute', top: '6px', left: '6px', zIndex: 2,
                          background: idx === 0 ? 'var(--accent-gold)' : idx === 1 ? '#181818' : 'rgba(0,0,0,0.6)',
                          color: '#fff', fontSize: '0.55rem', fontWeight: 800,
                          padding: '0.15rem 0.4rem', borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '0.04em'
                        }}>
                          {idx === 0 ? '★ Primary' : idx === 1 ? '↻ Hover' : `#${idx + 1}`}
                        </div>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          style={{
                            position: 'absolute', top: '6px', right: '6px', zIndex: 2,
                            background: 'rgba(0,0,0,0.65)', color: '#fff', border: 'none',
                            borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                          }}
                          title="Remove image"
                        >
                          ×
                        </button>

                        {/* Thumbnail */}
                        <div style={{ height: '120px', background: '#f5f5f5', overflow: 'hidden' }}>
                          <img
                            src={imgUrl}
                            alt={`Preview ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>

                        {/* Controls (Move Left / Right) */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0.5rem', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveImage(idx, -1)}
                            style={{
                              background: 'none', border: 'none', cursor: idx === 0 ? 'default' : 'pointer',
                              color: idx === 0 ? '#ccc' : '#444', padding: 0
                            }}
                            title="Move closer to Primary"
                          >
                            <MoveLeft size={13} />
                          </button>
                          <span style={{ fontSize: '0.62rem', color: '#777', fontWeight: 700 }}>
                            {idx === 0 ? 'Front' : idx === 1 ? 'Hover' : `Pos ${idx + 1}`}
                          </span>
                          <button
                            type="button"
                            disabled={idx === productForm.images.length - 1}
                            onClick={() => handleMoveImage(idx, 1)}
                            style={{
                              background: 'none', border: 'none', cursor: idx === productForm.images.length - 1 ? 'default' : 'pointer',
                              color: idx === productForm.images.length - 1 ? '#ccc' : '#444', padding: 0
                            }}
                            title="Move down"
                          >
                            <MoveRight size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optional Manual URL Fallback */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', alignItems: 'center' }}>
                  <input
                    type="url"
                    placeholder="Or paste an image web URL..."
                    value={manualImageUrl}
                    onChange={(e) => setManualImageUrl(e.target.value)}
                    className="admin-form-input"
                    style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.76rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddManualUrl}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 0.85rem', fontSize: '0.72rem' }}
                  >
                    + Add URL
                  </button>
                </div>
              </div>

              {/* STEP 2: PRODUCT CORE DETAILS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {/* Title */}
                <div>
                  <label className="admin-field-label">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    placeholder="e.g. Tinny Atelier Calfskin Molded Mule Slides"
                    className="admin-form-input"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="admin-field-label">SKU / Code</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="e.g. TNY-SHOE-009"
                    className="admin-form-input"
                  />
                </div>

                {/* Category Dropdown (Updated with Shoes & Slides) */}
                <div>
                  <label className="admin-field-label">Collection Category *</label>
                  <select
                    value={productForm.category}
                    onChange={handleFormCategoryChange}
                    className="admin-form-input"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name || c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Base Price (Naira ₦) */}
                <div>
                  <label className="admin-field-label">Base Price (Naira ₦) *</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <span style={{
                        position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                        fontWeight: 800, color: '#555', fontSize: '0.85rem'
                      }}>
                        ₦
                      </span>
                      <input
                        type="number"
                        required
                        min="0"
                        value={productForm.price === '' ? '' : productForm.price}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProductForm({
                            ...productForm,
                            price: val === '' ? '' : val
                          });
                        }}
                        placeholder="e.g. 185000"
                        className="admin-form-input"
                        style={{ paddingLeft: '1.8rem' }}
                      />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#666', whiteSpace: 'nowrap' }}>
                      ≈ <strong>${productForm.price ? Math.round(Number(productForm.price) / 1480) : 0} USD</strong>
                    </div>
                  </div>
                </div>

                {/* Badge Label */}
                <div>
                  <label className="admin-field-label">Status Badge (Optional)</label>
                  <input
                    type="text"
                    value={productForm.badge || ''}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="e.g. Limited Drop, New Arrival"
                    className="admin-form-input"
                  />
                </div>

                {/* Badge Color Theme */}
                <div>
                  <label className="admin-field-label">Badge Color Theme</label>
                  <select
                    value={productForm.badgeType || 'black'}
                    onChange={(e) => setProductForm({ ...productForm, badgeType: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="black">Obsidian Black (Default)</option>
                    <option value="gold">Warm Gold (Atelier/Special)</option>
                    <option value="emerald">Emerald Green (Discount/Core)</option>
                    <option value="blue">Sapphire Blue (Performance)</option>
                  </select>
                </div>
              </div>

              {/* Toggles (Best Seller, In Stock) */}
              <div style={{ display: 'flex', gap: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xs)', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800 }}>
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller}
                    onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: '#181818' }}
                  />
                  <span>Feature in Landing Page "Best Sellers"</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800 }}>
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: '#181818' }}
                  />
                  <span>Available In Stock (Abuja Dispatch)</span>
                </label>
              </div>

              {/* Color Swatches */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="admin-field-label">Color Variations</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Color name (e.g. Obsidian Black, Bone)"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="admin-form-input"
                    style={{ minWidth: '180px', flex: 1 }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#fff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xs)', padding: '0.2rem 0.5rem' }}>
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      style={{ width: '28px', height: '28px', border: 'none', cursor: 'pointer', background: 'none' }}
                    />
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>{newColorHex}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="btn btn-secondary"
                    style={{ padding: '0.55rem 0.85rem', fontSize: '0.74rem' }}
                  >
                    + Add Color
                  </button>
                </div>

                {/* Live color chips */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {productForm.colors?.map((col, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
                        padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-xs)', fontSize: '0.72rem'
                      }}
                    >
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: col.hex, border: '1px solid #ddd' }} />
                      <span>{col.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(idx)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 0 }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* AVAILABLE SIZES (SUPPORTING APPAREL & SHOES/SLIDES) */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <label className="admin-field-label" style={{ margin: 0 }}>
                    Available Sizes (Supports Apparel, Shoes & Slides)
                  </label>

                  {/* Size group tabs */}
                  <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-secondary)', padding: '0.2rem', borderRadius: 'var(--radius-xs)' }}>
                    <button
                      type="button"
                      onClick={() => setActiveSizeTab('apparel')}
                      style={{
                        background: activeSizeTab === 'apparel' ? '#181818' : 'none',
                        color: activeSizeTab === 'apparel' ? '#fff' : '#666',
                        border: 'none', padding: '0.2rem 0.5rem', borderRadius: '2px',
                        fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      Apparel
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSizeTab('shoesEU')}
                      style={{
                        background: activeSizeTab === 'shoesEU' ? '#181818' : 'none',
                        color: activeSizeTab === 'shoesEU' ? '#fff' : '#666',
                        border: 'none', padding: '0.2rem 0.5rem', borderRadius: '2px',
                        fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      Shoes (EU)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSizeTab('shoesUS')}
                      style={{
                        background: activeSizeTab === 'shoesUS' ? '#181818' : 'none',
                        color: activeSizeTab === 'shoesUS' ? '#fff' : '#666',
                        border: 'none', padding: '0.2rem 0.5rem', borderRadius: '2px',
                        fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      Shoes (US)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSizeTab('waist')}
                      style={{
                        background: activeSizeTab === 'waist' ? '#181818' : 'none',
                        color: activeSizeTab === 'waist' ? '#fff' : '#666',
                        border: 'none', padding: '0.2rem 0.5rem', borderRadius: '2px',
                        fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      Waist
                    </button>
                  </div>
                </div>

                {/* Preset size pills */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {SIZE_PRESETS[activeSizeTab].map(size => {
                    const isSelected = productForm.sizes?.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleToggleSize(size)}
                        style={{
                          background: isSelected ? '#181818' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#181818',
                          border: `1px solid ${isSelected ? '#181818' : 'var(--border-light)'}`,
                          borderRadius: 'var(--radius-xs)', padding: '0.35rem 0.75rem',
                          fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer'
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>

                {/* Custom size adder */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Add custom size (e.g. 42.5 or US 10.5)..."
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    className="admin-form-input"
                    style={{ maxWidth: '240px', padding: '0.4rem 0.65rem', fontSize: '0.75rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSize}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.72rem' }}
                  >
                    + Add Size
                  </button>

                  <div style={{ fontSize: '0.72rem', color: '#666', marginLeft: 'auto' }}>
                    Selected: <strong>{productForm.sizes.join(', ') || 'None'}</strong>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="admin-field-label">Editorial Narrative / Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Describe the silhouette, materials, drape, and occasion..."
                  className="admin-form-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Craftsmanship Details (Bullet Points) */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="admin-field-label">Craftsmanship & Atelier Details</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.65rem' }}>
                  <input
                    type="text"
                    placeholder="e.g. 100% Full-grain Italian calfskin, Ergonomic molded footbed"
                    value={newDetailText}
                    onChange={(e) => setNewDetailText(e.target.value)}
                    className="admin-form-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleAddDetail}
                    className="btn btn-secondary"
                    style={{ padding: '0.55rem 0.85rem', fontSize: '0.74rem' }}
                  >
                    + Add Detail
                  </button>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {productForm.details?.map((det, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: '0.74rem', color: '#444', display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', background: 'var(--bg-secondary)',
                        padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-xs)'
                      }}
                    >
                      <span>• {det}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDetail(idx)}
                        style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Form Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.25rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.5rem', opacity: isUploading ? 0.7 : 1, cursor: isUploading ? 'not-allowed' : 'pointer' }}
                >
                  {isUploading ? <RefreshCw className="animate-spin" size={15} /> : <CheckCircle2 size={15} />}
                  <span>{isUploading ? 'Uploading Photos...' : editingProductId ? 'Update Product' : 'Publish to Catalog'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* =====================================================================
          CUSTOM LUXURY DELETE CONFIRMATION MODAL
          ===================================================================== */}
      {productToDelete && (
        <div
          className="admin-modal-overlay"
          onClick={() => !isDeleting && setProductToDelete(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '1rem'
          }}
        >
          <div
            className="admin-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              maxWidth: '480px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(0, 0, 0, 0.08)'
            }}
          >
            {/* Header with red badge */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '46px', height: '46px', borderRadius: '50%',
                background: '#fee2e2', color: '#dc2626',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <Trash2 size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  Delete Catalog Item
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                  This piece will be permanently removed from the storefront catalog and database.
                </p>
              </div>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Product Item Card Preview */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.85rem',
              background: '#f9fafb',
              padding: '0.85rem 1rem',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              marginBottom: '1.25rem'
            }}>
              {productToDelete.images && productToDelete.images[0] ? (
                <img
                  src={productToDelete.images[0]}
                  alt={productToDelete.title}
                  style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e5e7eb' }}
                />
              ) : (
                <div style={{ width: '56px', height: '56px', background: '#e5e7eb', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ImageIcon size={22} color="#9ca3af" />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {productToDelete.title}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#4b5563', marginTop: '0.2rem' }}>
                  SKU: <strong style={{ color: '#111' }}>{productToDelete.sku || 'N/A'}</strong> • <strong style={{ color: 'var(--accent-gold-hover, #926d2e)' }}>{formatPrice(productToDelete.price)}</strong>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
              Are you sure you want to delete <strong>"{productToDelete.title}"</strong>? Customers will no longer see this piece on the storefront and direct links will be deactivated.
            </p>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
                className="btn btn-secondary"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.8rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    await deleteProduct(productToDelete.id);
                    setProductToDelete(null);
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.65rem 1.4rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  opacity: isDeleting ? 0.7 : 1,
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.35)'
                }}
              >
                {isDeleting ? <RefreshCw className="animate-spin" size={14} /> : <Trash2 size={14} />}
                <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Item'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
