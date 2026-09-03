import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Award, MapPin } from 'lucide-react';

export default function BrandPillars() {
  const pillars = [
    {
      icon: Truck,
      title: 'Free Abuja Delivery',
      description: 'Complimentary same-day express delivery for all residents in Maitama, Wuse 2, Garki, Jabi, Gwarinpa & environs.'
    },
    {
      icon: Award,
      title: 'Bespoke Tailoring',
      description: 'Engineered with custom-woven 420GSM cottons, technical 4-way stretch fabrics, and palladium hardware.'
    },
    {
      icon: RefreshCw,
      title: '14-Day Exchanges',
      description: 'Hassle-free door-to-door size exchanges and returns across Abuja and nationwide.'
    },
    {
      icon: ShieldCheck,
      title: '100% Authentic',
      description: 'Verified genuine luxury apparel crafted directly in our flagship Maitama, Abuja atelier.'
    }
  ];

  return (
    <section className="pillars-section">
      <div className="pillars-container">
        <div className="pillars-grid">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="pillar-item">
                <div className="pillar-icon-box">
                  <Icon size={20} style={{ color: 'var(--accent-gold)' }} />
                </div>
                <div className="pillar-content">
                  <h3 className="pillar-title">{pillar.title}</h3>
                  <p className="pillar-desc">{pillar.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
