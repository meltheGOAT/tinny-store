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

  const formatPrice = (basePriceUSD) => {
    const cur = CURRENCIES[currency] || CURRENCIES.NGN;
    const converted = Math.round(basePriceUSD * cur.rate);
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

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotalUSD = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const freeShippingThresholdUSD = 250;
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotalUSD / freeShippingThresholdUSD) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThresholdUSD - cartSubtotalUSD);

  const value = {
    currentRoute, setCurrentRoute,
    products: PRODUCTS, cart, isCartOpen, setIsCartOpen,
    currency, setCurrency, formatPrice,
    wishlist, toggleWishlist, quickViewProduct, setQuickViewProduct,
    toast, showToast, activeCategory, setActiveCategory,
    searchQuery, setSearchQuery, sortBy, setSortBy,
    addToCart, updateCartQuantity, removeFromCart,
    cartCount, cartSubtotalUSD, freeShippingThresholdUSD,
    freeShippingProgress, remainingForFreeShipping
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export { useStore } from './useStore';
