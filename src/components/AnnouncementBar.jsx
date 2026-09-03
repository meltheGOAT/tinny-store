import React from "react";

export default function AnnouncementBar() {
  const announcements = [
    "TIMELESS STYLE. MODERN YOU • TINNY STORE ABUJA",
    "FREE SAME-DAY DELIVERY IN ABUJA & ENVIRONS",
    "FLAGSHIP ATELIER: KUBWA, ABUJA, FCT",
    "DISCOVER OUR LATEST COLLECTION",
    "FREE SHIPPING ON ORDERS ABOVE ₦100,000",
    "CONVENIENT SHOPPING. FAST DELIVERY",
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
