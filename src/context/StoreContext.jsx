import React, { useState, useEffect } from 'react';
import { StoreContext } from './store-core';
import { PRODUCTS, CURRENCIES } from '../data/products';

function getInitialRoute() {
  if (typeof window === 'undefined') return 'storefront';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  if (path === '/admin' || hash === '#admin') return 'admin';
  if (path === '/shop' || hash === '#shop') return 'shop';
  return 'storefront';
}

export function StoreProvider({ children }) {
  const [currentRoute, setCurrentRouteState] = useState(getInitialRoute);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currency, setCurrency] = useState('NGN');
  const [wishlist, setWishlist] = useState(['zttw-01', 'zttw-03']);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const setCurrentRoute = (route) => {
    setCurrentRouteState(route);
    const path = route === 'admin' ? '/admin' : route === 'shop' ? '/shop' : '/';
    if (window.location.pathname !== path) {
      window.history.pushState({ route }, '', path);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRouteState(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const getPriceInUSD = (priceVal) => {
    if (!priceVal) return 0;
    return priceVal >= 1000 ? priceVal / 1480 : priceVal;
  };

  const getPriceInNGN = (priceVal) => {
    if (!priceVal) return 0;
    return priceVal >= 1000 ? priceVal : Math.round(priceVal * 1480);
  };

  const formatPrice = (rawPrice) => {
    if (!rawPrice && rawPrice !== 0) return '₦0';
    const cur = CURRENCIES[currency] || CURRENCIES.NGN;
    if (cur.code === 'NGN') {
      const ngnVal = getPriceInNGN(rawPrice);
      return `₦${Math.round(ngnVal).toLocaleString()}`;
    }
    const usdVal = getPriceInUSD(rawPrice);
    const converted = Math.round(usdVal * cur.rate);
    return `${cur.symbol}${converted.toLocaleString()}`;
  };

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3200);
  };

  const addToCart = (product, selectedColor = null, selectedSize = null, quantity = 1) => {
    const color = selectedColor || (product.colors && product.colors[0]?.name) || 'Standard';
    const size = selectedSize || (product.sizes && product.sizes[0]) || 'M';
    const cartItemId = `${product.id}-${color}-${size}`;
    setCart(prevCart => {
      const existing = prevCart.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prevCart.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { cartItemId, product, color, size, quantity }];
    });
    showToast(`Added ${product.title} to Bag`, 'success');
    setIsCartOpen(true);
  };

  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) { removeFromCart(cartItemId); return; }
    setCart(prev => prev.map(item =>
      item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
    ));
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast('Removed from bag', 'info');
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter(id => id !== productId);
      }
      showToast('Added to Wishlist', 'success');
      return [...prev, productId];
    });
  };

  // Dynamic Products State with LocalStorage Persistence
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('tinny_products');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // Admin Authentication State
  const [adminAuth, setAdminAuth] = useState(() => {
    try {
      const saved = localStorage.getItem('tinny_admin_auth');
      if (!saved) return { isAuthenticated: false, user: null, token: null };
      const parsed = JSON.parse(saved);
      if (parsed?.token && (parsed.token.includes('_local') || !parsed.token.includes('.'))) {
        localStorage.removeItem('tinny_admin_auth');
        return { isAuthenticated: false, user: null, token: null };
      }
      return parsed;
    } catch {
      return { isAuthenticated: false, user: null, token: null };
    }
  });

  // WhatsApp Checkout Inquiries Tracker
  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('tinny_inquiries');
      return saved ? JSON.parse(saved) : [
        {
          id: 'inq-101',
          date: '2026-09-05T14:20:00Z',
          buyerLocation: 'Maitama, Abuja',
          items: [{ title: 'Tinny 7-Star Dominion Tracksuit Top', size: 'L', color: 'Pitch Black', qty: 1, priceUSD: 260 }],
          totalNGN: 390000,
          totalUSD: 260,
          status: 'Direct Message Sent'
        },
        {
          id: 'inq-102',
          date: '2026-09-04T18:45:00Z',
          buyerLocation: 'Wuse 2, Abuja',
          items: [{ title: 'Tinny Kinetic Carded Heavyweight Tee', size: 'XL', color: 'Mineral Slate', qty: 2, priceUSD: 85 }],
          totalNGN: 255000,
          totalUSD: 170,
          status: 'Completed Order'
        }
      ];
    } catch {
      return [];
    }
  });

  // Express Backend API Base URL (Supports dynamic Vercel / production URL)
  const API_BASE = import.meta.env.VITE_API_URL || 'https://tinny-api.onrender.com/api';

  // Load products from API on mount with local fallback
  useEffect(() => {
    async function loadProductsFromApi() {
      try {
        const res = await fetch(`${API_BASE}/products`);
        if (res.ok) {
          const apiProducts = await res.json();
          if (Array.isArray(apiProducts) && apiProducts.length > 0) {
            setProducts(apiProducts);
            localStorage.setItem('tinny_products', JSON.stringify(apiProducts));
          }
        }
      } catch (err) {
        console.info('Storefront running with local storage cache (backend offline or starting):', err.message);
      }
    }
    loadProductsFromApi();
  }, []);

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tinny_products', JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to persist products to localStorage:', e);
    }
  }, [products]);

  // Handle direct product link from WhatsApp (e.g. /shop?product=TNY-JKT-001 or ?product=...)
  useEffect(() => {
    if (typeof window === 'undefined' || !products || products.length === 0) return;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const targetParam = urlParams.get('product');
      const hash = window.location.hash.replace(/^#product-/, '');
      const lookup = targetParam || (hash && hash !== '#admin' && hash !== '#shop' ? hash : null);

      if (lookup) {
        const match = products.find(
          p => p.id === lookup || 
               p.sku?.toLowerCase() === lookup.toLowerCase() ||
               p.title?.toLowerCase().includes(lookup.toLowerCase())
        );
        if (match) {
          setQuickViewProduct(match);
        }
      }
    } catch (e) {
      console.warn('Error reading product deep-link param:', e);
    }
  }, [products]);

  // Sync adminAuth to localStorage
  useEffect(() => {
    try {
      if (adminAuth.isAuthenticated) {
        localStorage.setItem('tinny_admin_auth', JSON.stringify(adminAuth));
      } else {
        localStorage.removeItem('tinny_admin_auth');
      }
    } catch (e) {
      console.warn('Failed to persist admin auth:', e);
    }
  }, [adminAuth]);

  // Sync inquiries to localStorage and fetch from backend if authenticated
  useEffect(() => {
    try {
      localStorage.setItem('tinny_inquiries', JSON.stringify(inquiries));
    } catch (e) {
      console.warn('Failed to persist inquiries:', e);
    }
  }, [inquiries]);

  const adminLogin = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.token) {
        const authData = {
          isAuthenticated: true,
          token: data.token,
          user: data.user
        };
        setAdminAuth(authData);
        showToast('Welcome to TINNY Admin Studio (Connected to Database)', 'success');
        return { success: true };
      } else {
        const errorMsg = data.error || 'Invalid admin credentials.';
        showToast(errorMsg, 'error');
        return { success: false, message: errorMsg };
      }
    } catch (err) {
      console.error('Backend auth request error:', err);
      showToast('Could not reach backend API. Please check your internet connection.', 'error');
      return { success: false, message: err.message };
    }
  };

  const adminLogout = () => {
    setAdminAuth({ isAuthenticated: false, user: null, token: null });
    localStorage.removeItem('tinny_admin_auth');
    showToast('Signed out of Admin Studio', 'info');
  };

  const addProduct = async (newProduct) => {
    if (!adminAuth.token || adminAuth.token.includes('_local')) {
      setAdminAuth({ isAuthenticated: false, user: null, token: null });
      localStorage.removeItem('tinny_admin_auth');
      showToast('Session expired or unauthorized. Please log in again to publish.', 'error');
      return false;
    }

    try {
      const res = await fetch(`${API_BASE}/products/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminAuth.token}`
        },
        body: JSON.stringify(newProduct)
      });

      if (res.status === 401 || res.status === 403) {
        setAdminAuth({ isAuthenticated: false, user: null, token: null });
        localStorage.removeItem('tinny_admin_auth');
        showToast('Admin session expired. Please log in again.', 'error');
        return false;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        showToast(`Failed to publish product: ${errorData.error || res.statusText}`, 'error');
        return false;
      }

      const saved = await res.json();
      setProducts(prev => {
        const next = [saved, ...prev.filter(p => p.id !== saved.id)];
        localStorage.setItem('tinny_products', JSON.stringify(next));
        return next;
      });

      showToast(`Published "${saved.title}" to catalog`, 'success');
      return true;
    } catch (err) {
      console.error('Failed to sync new product:', err);
      showToast(`Error publishing product: ${err.message}`, 'error');
      return false;
    }
  };

  const updateProduct = async (productId, updatedFields) => {
    if (!adminAuth.token || adminAuth.token.includes('_local')) {
      setAdminAuth({ isAuthenticated: false, user: null, token: null });
      localStorage.removeItem('tinny_admin_auth');
      showToast('Session expired. Please log in again to update.', 'error');
      return false;
    }

    try {
      const res = await fetch(`${API_BASE}/products/admin/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminAuth.token}`
        },
        body: JSON.stringify(updatedFields)
      });

      if (res.status === 401 || res.status === 403) {
        setAdminAuth({ isAuthenticated: false, user: null, token: null });
        localStorage.removeItem('tinny_admin_auth');
        showToast('Admin session expired. Please log in again.', 'error');
        return false;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        showToast(`Failed to update product: ${errorData.error || res.statusText}`, 'error');
        return false;
      }

      const saved = await res.json();
      setProducts(prev => {
        const next = prev.map(p => (p.id === productId ? saved : p));
        localStorage.setItem('tinny_products', JSON.stringify(next));
        return next;
      });

      showToast(`Updated "${saved.title || 'Product'}"`, 'success');
      return true;
    } catch (err) {
      console.error('Failed to sync updated product:', err);
      showToast(`Error updating product: ${err.message}`, 'error');
      return false;
    }
  };

  const deleteProduct = async (productId) => {
    if (!adminAuth.token || adminAuth.token.includes('_local')) {
      setAdminAuth({ isAuthenticated: false, user: null, token: null });
      localStorage.removeItem('tinny_admin_auth');
      showToast('Session expired. Please log in again to delete.', 'error');
      return false;
    }

    try {
      const res = await fetch(`${API_BASE}/products/admin/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminAuth.token}`
        }
      });

      if (res.status === 401 || res.status === 403) {
        setAdminAuth({ isAuthenticated: false, user: null, token: null });
        localStorage.removeItem('tinny_admin_auth');
        showToast('Admin session expired. Please log in again.', 'error');
        return false;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        showToast(`Failed to remove product: ${errorData.error || res.statusText}`, 'error');
        return false;
      }

      const productToDelete = products.find(p => p.id === productId);
      setProducts(prev => {
        const next = prev.filter(p => p.id !== productId);
        localStorage.setItem('tinny_products', JSON.stringify(next));
        return next;
      });

      showToast(`Removed "${productToDelete?.title || 'Product'}" from catalog`, 'info');
      return true;
    } catch (err) {
      console.error('Failed to sync product deletion:', err);
      showToast(`Error deleting product: ${err.message}`, 'error');
      return false;
    }
  };

  const toggleProductStock = async (productId) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;
    const nextStock = !target.inStock;

    if (!adminAuth.token || adminAuth.token.includes('_local')) {
      showToast('Please log in with admin credentials to toggle stock.', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/products/admin/${productId}/stock`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminAuth.token}`
        }
      });

      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => {
          const next = prev.map(p => (p.id === productId ? updated : p));
          localStorage.setItem('tinny_products', JSON.stringify(next));
          return next;
        });
        showToast(`"${target.title}" marked as ${nextStock ? 'In Stock' : 'Sold Out'}`, 'info');
      } else {
        showToast('Failed to toggle stock status on server.', 'error');
      }
    } catch (err) {
      console.error('Failed to toggle stock:', err);
      showToast(`Stock toggle error: ${err.message}`, 'error');
    }
  };

  const toggleProductBestSeller = async (productId) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;
    const nextVal = !target.isBestSeller;

    if (!adminAuth.token || adminAuth.token.includes('_local')) {
      showToast('Please log in with admin credentials to toggle Best Seller.', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/products/admin/${productId}/bestseller`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminAuth.token}`
        }
      });

      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => {
          const next = prev.map(p => (p.id === productId ? updated : p));
          localStorage.setItem('tinny_products', JSON.stringify(next));
          return next;
        });
        showToast(`"${target.title}" ${nextVal ? 'added to' : 'removed from'} Best Sellers`, 'info');
      } else {
        showToast('Failed to toggle Best Seller on server.', 'error');
      }
    } catch (err) {
      console.error('Failed to toggle Best Seller:', err);
      showToast(`Best Seller toggle error: ${err.message}`, 'error');
    }
  };

  const resetProductsToDefault = () => {
    setProducts(PRODUCTS);
    try {
      localStorage.setItem('tinny_products', JSON.stringify(PRODUCTS));
    } catch {}
    showToast('Reset catalog to official TINNY drops', 'success');
  };

  const logInquiry = async (orderSummary) => {
    const newInquiry = {
      id: `inq-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString(),
      ...orderSummary,
      status: 'Direct Message Sent'
    };
    setInquiries(prev => [newInquiry, ...prev]);

    // Send to Express API in background
    try {
      await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderSummary)
      });
    } catch (err) {
      console.warn('Inquiry logged locally (API offline):', err.message);
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotalNGN = cart.reduce((sum, item) => sum + (getPriceInNGN(item.product.price) * item.quantity), 0);
  const cartSubtotal = cartSubtotalNGN; // Primary base is Nigerian Naira (₦)
  const cartSubtotalUSD = Math.round(cartSubtotalNGN / 1480);
  const freeShippingThresholdNGN = 350000; // ₦350,000 threshold for complimentary express delivery
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotalNGN / freeShippingThresholdNGN) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThresholdNGN - cartSubtotalNGN);

  const value = {
    currentRoute, setCurrentRoute,
    products, cart, isCartOpen, setIsCartOpen,
    currency, setCurrency, formatPrice,
    getPriceInUSD, getPriceInNGN,
    wishlist, toggleWishlist, quickViewProduct, setQuickViewProduct,
    toast, showToast, activeCategory, setActiveCategory,
    searchQuery, setSearchQuery, sortBy, setSortBy,
    addToCart, updateCartQuantity, removeFromCart,
    cartCount, cartSubtotal, cartSubtotalNGN, cartSubtotalUSD,
    freeShippingThresholdNGN, freeShippingProgress, remainingForFreeShipping,
    // Admin state and actions
    adminAuth, adminLogin, adminLogout,
    addProduct, updateProduct, deleteProduct,
    toggleProductStock, toggleProductBestSeller,
    resetProductsToDefault,
    inquiries, logInquiry
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export { useStore } from './useStore';
