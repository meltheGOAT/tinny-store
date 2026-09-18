import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useStore } from "../context/StoreContext";
import campaignImg1 from "../assets/KITH STWR.webp";
import campaignImg2 from "../assets/NIKE TOP1.avif";

export default function CampaignShowcase() {
  const { setCurrentRoute, setActiveCategory } = useStore();

  const handleNav = category => {
    setCurrentRoute("shop");
    setActiveCategory(category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="campaign-duo-section">
      <div className="campaign-duo-grid">
        {/* Campaign 1 */}
        <div className="campaign-tile" onClick={() => handleNav("all")}>
          <img
            src={campaignImg1}
            alt="STREETWEARS"
            className="campaign-tile-img"
            loading="lazy"
          />
          <div className="campaign-tile-overlay">
            <div className="campaign-tile-top"></div>
            <div className="campaign-tile-bottom">
              <h2 className="campaign-tile-title"> OUTERWEAR CAPSULE</h2>
              <button className="campaign-tile-btn">
                <span>Shop Streetwear</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Campaign 2 */}
        <div className="campaign-tile" onClick={() => handleNav("tops")}>
          <img
            src={campaignImg2}
            alt="The Artisanal Summer Edition"
            className="campaign-tile-img"
            loading="lazy"
          />
          <div className="campaign-tile-overlay">
            <div className="campaign-tile-top">
              <span className="campaign-tile-pill"> Exclusive</span>
            </div>
            <div className="campaign-tile-bottom">
              <h2 className="campaign-tile-title">ARTISANAL ESSENTIALS</h2>
              <button className="campaign-tile-btn">
                <span>Explore Tops</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
