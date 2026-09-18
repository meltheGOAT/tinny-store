import React from "react";
import { Sparkles, Clock, Bell } from "lucide-react";

export default function Lookbook() {
  const lookbooks = [
    {
      id: 1,
      title: "Dominion Tracksuit Capsule",
      tag: "Heavyweight Cotton",
      image:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85",
    },
    {
      id: 2,
      title: "Artisanal Crochet & Knits",
      tag: "Hand-Crafted",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85",
    },
    {
      id: 3,
      title: "Apex Twill & Headwear",
      tag: "Core Essentials",
      image:
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85",
    },
    {
      id: 4,
      title: "Kinetic Performance Sets",
      tag: "Abuja Athleisure",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=85",
    },
  ];

  const handleNotifyScroll = () => {
    const footerEl = document.querySelector(".tinny-footer");
    if (footerEl) {
      footerEl.scrollIntoView({ behavior: "smooth" });
      const emailInput = footerEl.querySelector('input[type="email"]');
      if (emailInput) {
        setTimeout(() => emailInput.focus(), 500);
      }
    }
  };

  return (
    <section id="lookbook-section" className="lookbook-section">
      <div className="section-header-minimal">
        <div className="section-header-left">
          <h2 className="section-title-clean">EDITORIAL LOOKBOOK</h2>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            color: "var(--accent-gold)",
            fontSize: "0.72rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          <Clock size={13} />
          <span>Private Drop Imminent</span>
        </div>
      </div>

      <div className="lookbook-stage">
        {/* Blurred gallery background */}
        <div
          className="lookbook-gallery-grid lookbook-blurred-grid"
          aria-hidden="true"
        >
          {lookbooks.map(item => (
            <div key={item.id} className="lookbook-item-box">
              <img
                src={item.image}
                alt={item.title}
                className="lookbook-item-img"
                loading="lazy"
              />
              <div className="lookbook-item-overlay">
                <span className="lookbook-item-tag">{item.tag}</span>
                <h3 className="lookbook-item-title">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Creative Editorial Coming Soon Card */}
        <div className="lookbook-coming-soon-backdrop">
          <div className="lookbook-coming-soon-card">
            <h3 className="lookbook-coming-soon-title">COMING SOON</h3>

            <div className="lookbook-coming-soon-footer">
              <button
                onClick={handleNotifyScroll}
                className="btn btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  fontSize: "0.74rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "0.65rem 1.35rem",
                  background: "var(--accent-gold)",
                  color: "#ffffff",
                  borderColor: "var(--accent-gold)",
                }}
              >
                <Bell size={13} />
                <span>Get Drop Notification</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
