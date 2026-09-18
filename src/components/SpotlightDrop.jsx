import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Dumbbell,
  Tag,
  Copy,
  Check,
  Flame,
} from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function SpotlightDrop() {
  const { setCurrentRoute, setActiveCategory, showToast } = useStore();
  const [copied, setCopied] = useState(false);

  const discountCode = "PUMP20";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(discountCode);
    setCopied(true);
    showToast("Code PUMP20 copied! 20% Off at checkout", "success");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShopGym = () => {
    setCurrentRoute("shop");
    setActiveCategory("tops");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="spotlight-section">
      <div className="spotlight-card">
        {/* Media 1: Action Model Shot */}
        <div className="spotlight-media-wrap">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=90"
            alt="Tinny Kinetic Gym & Performance Wear"
            className="spotlight-media-img"
            loading="lazy"
          />
        </div>

        {/* Media 2: Texture & On-Body Detail */}
        <div className="spotlight-media-wrap secondary-spotlight-media">
          <img
            src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=90"
            alt="Kinetic Pump Cover Detail"
            className="spotlight-media-img"
            loading="lazy"
          />
        </div>

        {/* Content Side with Minimal Text & Ashluxe Styling */}
        <div className="spotlight-content-wrap">
          <div className="spotlight-eyebrow">
            <span>PERFORMANCE CAPSULE</span>
          </div>

          <h2 className="spotlight-heading">GYM APPAREL DROP</h2>

          <p className="spotlight-body-text">
            Performance ready essentials, from training tees and shorts to
            joggers and gym sets.
          </p>

          <ul className="spotlight-features-list">
            <li>
              <CheckCircle2 size={15} style={{ color: "var(--accent-gold)" }} />
              <span>All-day Comfort & Lightweight Feel</span>
            </li>
            <li>
              <CheckCircle2 size={15} style={{ color: "var(--accent-gold)" }} />
              <span>Anti-Odor Breathable Fabric</span>
            </li>
            <li>
              <CheckCircle2 size={15} style={{ color: "var(--accent-gold)" }} />
              <span>Free Same-Day Delivery in Abuja</span>
            </li>
          </ul>

          {/* CTAs */}
          <div className="spotlight-cta-row">
            <button className="btn btn-primary" onClick={handleShopGym}>
              <span>Shop Gym Drop</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
