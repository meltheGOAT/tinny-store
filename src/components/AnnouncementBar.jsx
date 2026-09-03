import React from 'react';

export default function AnnouncementBar() {
  const announcements = [
    'TIMELESS STYLE. MODERN YOU • TINNY STORE ABUJA',
    'FREE SAME-DAY DELIVERY FOR ABUJA RESIDENTS & ENVIRONS (MAITAMA, WUSE 2, GARKI, JABI)',
    'FLAGSHIP ATELIER: MAITAMA, ABUJA, FCT',
    'AUTUMN / WINTER 2026 DROP NOW LIVE',
    'FREE NATIONWIDE & WORLDWIDE EXPRESS OVER ₦370,000 / $250',
    '100% AUTHENTIC ABUJA LUXURY STREETWEAR'
  ];

  return (
    <div className="announcement-bar" role="region" aria-label="Store Announcement">
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
