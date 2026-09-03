import React from "react";

export default function AnnouncementBar() {
  const announcements = [
    "TIMELESS STYLE. MODERN YOU • TINNY STORE ABUJA",
    "SAME-DAY DELIVERY FOR ABUJA RESIDENTS & ENVIRONS (KUBWA, GWARIMPA, WUSE 2, JABI, MAITAMA AND MORE)",
    "FLAGSHIP ATELIER: KUBWA, ABUJA, FCT",
    "DISCOVER OUR NEW & LATEST COLECTION",
    "FREE SHIPPING ON ORDERS ABOVE ₦100,000",
    "CONVINIENT SHOPPING. FAST DELIVERY",
  ];

  return (
    <div
      className="announcement-bar"
      role="region"
      aria-label="Store Announcement"
    >
      <div className="marquee-container">
        {[...announcements, ...announcements].map((text, idx) => (
          <span key={idx} className="marquee-item">
            <span className="marquee-dot"></span>
            <span>{text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
