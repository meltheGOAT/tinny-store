import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useStore } from "../context/StoreContext";
import heroImg from "../assets/KITH LB.webp";

export default function Hero() {
  const { setCurrentRoute, setActiveCategory } = useStore();

  const handleShopDrop = () => {
    setCurrentRoute("shop");
    setActiveCategory("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="tinny-hero">
      <div className="hero-banner-frame">
        <img
          src={heroImg}
          alt="TINNY hero banner"
          className="hero-banner-img"
          loading="eager"
          fetchpriority="high"
        />
        <div className="hero-banner-overlay"></div>
        <div className="hero-banner-content">
          <h1 className="hero-headline">
            <span className="hero-headline-primary">Timeless Style.</span>
            <span className="hero-headline-cursive">Modern You</span>
          </h1>

          <p className="hero-desc-text">
            From everyday essentials to statement pieces, discover quality
            pieces from brands that help you express your individuality.
          </p>

          <div className="hero-buttons-row">
            <button className="btn btn-primary" onClick={handleShopDrop}>
              <span>Explore Collection</span>
              <ArrowRight size={14} />
            </button>
            <a
              href="#lookbook-section"
              className="btn btn-secondary hero-lookbook-btn"
            >
              <span>View Lookbook</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

