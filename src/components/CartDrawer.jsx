import React, { useState } from "react";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  Tag,
} from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    formatPrice,
    cartCount,
    cartSubtotalUSD,
    freeShippingProgress,
    remainingForFreeShipping,
    showToast,
    setCurrentRoute,
    setActiveCategory,
  } = useStore();

  const handleShopAll = () => {
    setIsCartOpen(false);
    setCurrentRoute("shop");
    setActiveCategory("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null); // { code: 'PUMP20', percent: 20 }

  const handleApplyPromo = e => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === "PUMP20") {
      setAppliedPromo({ code: "PUMP20", percent: 20 });
      showToast("TINNY Gym Drop Discount Applied (20% Off)", "success");
    } else if (
      cleanCode === "TINNY10" ||
      cleanCode === "WORLD" ||
      cleanCode === "ABUJA"
    ) {
      setAppliedPromo({ code: cleanCode, percent: 10 });
      showToast("TINNY VIP Discount Applied (10% Off)", "success");
    } else {
      showToast('Invalid code. Try "PUMP20" or "TINNY10"', "error");
    }
  };

  const discountPercent = appliedPromo ? appliedPromo.percent : 0;
  const discountAmountUSD =
    discountPercent > 0
      ? Math.round(cartSubtotalUSD * (discountPercent / 100))
      : 0;
  const finalSubtotalUSD = cartSubtotalUSD - discountAmountUSD;

  return (
    <div
      className={`cart-drawer-overlay ${isCartOpen ? "open" : ""}`}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="cart-drawer"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Bag"
      >
        {/* Cart Header */}
        <div className="cart-header-row">
          <div className="cart-header-title">
            <ShoppingBag size={17} />
            <span>Your Bag ({cartCount})</span>
          </div>
          <button
            className="btn-icon"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Bag"
          >
            <X size={17} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator (Abuja Focused) */}
        <div className="free-shipping-container">
          <div className="shipping-status-text">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                color: "var(--accent-gold-hover)",
                marginBottom: "0.2rem",
              }}
            >
              <Sparkles size={13} />
              <span>
                <strong> Same-Day Delivery</strong> for Abuja residents &
                environs
              </span>
            </div>
            {remainingForFreeShipping === 0 ? (
              <span style={{ fontSize: "0.7rem", color: "#444" }}>
                You also qualify for <strong>FREE Global Express</strong>!
              </span>
            ) : (
              <span style={{ fontSize: "0.7rem", color: "#666" }}>
                Worldwide delivery: Add{" "}
                <strong>{formatPrice(remainingForFreeShipping)}</strong> more
                for free express
              </span>
            )}
          </div>
          <div className="shipping-track-bar">
            <div
              className="shipping-fill-bar"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        {cart.length > 0 ? (
          <div className="cart-items-scroll">
            {cart.map(item => (
              <div key={item.cartItemId} className="cart-item-row">
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="cart-item-thumbnail"
                />

                <div className="cart-item-info">
                  <h4 className="cart-item-heading">{item.product.title}</h4>
                  <div className="cart-item-variant">
                    {item.color} • Size {item.size}
                  </div>

                  <div className="cart-item-ctrls">
                    <div className="qty-counter-box">
                      <button
                        className="qty-counter-btn"
                        onClick={() =>
                          updateCartQuantity(item.cartItemId, item.quantity - 1)
                        }
                        aria-label="Decrease"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="qty-counter-val">{item.quantity}</span>
                      <button
                        className="qty-counter-btn"
                        onClick={() =>
                          updateCartQuantity(item.cartItemId, item.quantity + 1)
                        }
                        aria-label="Increase"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span className="cart-item-cost">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <button
                        className="cart-item-remove-btn"
                        onClick={() => removeFromCart(item.cartItemId)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo Code Input */}
            <form
              onSubmit={handleApplyPromo}
              style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem" }}
            >
              <input
                type="text"
                placeholder="Discount Code (e.g. PUMP20)"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                style={{
                  flex: 1,
                  padding: "0.55rem 0.75rem",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-xs)",
                  color: "#212121",
                  fontSize: "0.78rem",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                className="btn btn-secondary"
                style={{ padding: "0.55rem 0.85rem", fontSize: "0.74rem" }}
              >
                Apply
              </button>
            </form>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "3.5rem 1.5rem",
              color: "var(--text-muted)",
            }}
          >
            <ShoppingBag
              size={38}
              style={{ margin: "0 auto 0.75rem", opacity: 0.25 }}
            />
            <h3
              style={{
                fontSize: "1rem",
                marginBottom: "0.35rem",
                color: "#212121",
              }}
            >
              Your Bag is Empty
            </h3>
            <p
              style={{
                fontSize: "0.8rem",
                marginBottom: "1.25rem",
                color: "#666",
              }}
            >
              Explore the latest drop and select items to add to your bag.
            </p>
            <button
              className="btn btn-primary"
              onClick={handleShopAll}
            >
              Shop The Drop
            </button>
          </div>
        )}

        {/* Footer Checkout */}
        {cart.length > 0 && (
          <div className="cart-footer-box">
            {appliedPromo && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.35rem",
                  fontSize: "0.8rem",
                  color: "var(--accent-gold-hover)",
                  fontWeight: 700,
                }}
              >
                <span>
                  Code {appliedPromo.code} ({appliedPromo.percent}% Off)
                </span>
                <span>-{formatPrice(discountAmountUSD)}</span>
              </div>
            )}

            <div className="cart-subtotal-line">
              <span>Estimated Subtotal</span>
              <span style={{ fontFamily: "var(--font-mono)" }}>
                {formatPrice(finalSubtotalUSD)}
              </span>
            </div>

            <p
              style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                marginBottom: "0.85rem",
              }}
            >
              Free Same-Day Delivery applied for Abuja. Secure encrypted
              checkout.
            </p>

            <button
              className="btn btn-primary checkout-action-btn"
              onClick={() =>
                showToast(
                  "Redirecting to 256-Bit Encrypted Checkout...",
                  "success",
                )
              }
            >
              <span>Checkout • {formatPrice(finalSubtotalUSD)}</span>
              <ArrowRight size={15} />
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem",
                marginTop: "0.75rem",
                color: "#777",
                fontSize: "0.7rem",
              }}
            >
              <ShieldCheck
                size={12}
                style={{ color: "var(--accent-emerald)" }}
              />
              <span>Abuja Same-Day Dispatch • 100% Guaranteed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
