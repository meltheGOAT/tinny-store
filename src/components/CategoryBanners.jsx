import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useStore } from "../context/StoreContext";
import topsImg from "../assets/AE SHRT1.webp";
import outerwearImg from "../assets/NIKE JACK1.avif";
import bottomsImg from "../assets/jeans1.webp";
import shoesImg from "../assets/shoe1.webp";
import headwearImg from "../assets/headwear1.webp";

export default function CategoryBanners() {
  const { setCurrentRoute, setActiveCategory } = useStore();

  const categories = [
    {
      id: "tops",
      title: "Shirts & Tops",
      image: topsImg,
    },
    {
      id: "outerwear",
      title: "Jackets & Hoodies",
      image: outerwearImg,
    },
    {
      id: "bottoms",
      title: "Bottoms & Shorts",
      image: bottomsImg,
    },
    {
      id: "shoes",
      title: "Shoes & Slides",
      image: shoesImg,
    },
    {
      id: "headwear",
      title: "Headwear & Caps",
      image: headwearImg,
    },
  ];

  const handleTileClick = catId => {
    setCurrentRoute("shop");
    setActiveCategory(catId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="category-banners-section">
      <div className="section-header-minimal">
        <div className="section-header-left">
          <span className="section-eyebrow-clean">Curated Categories</span>
          <h2 className="section-title-clean">EXPLORE DEPARTMENTS</h2>
        </div>
        <button
          className="view-all-link-btn"
          onClick={() => handleTileClick("all")}
        >
          <span>View All Categories</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="category-banners-grid">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="category-banner-card"
            onClick={() => handleTileClick(cat.id)}
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="category-banner-img"
              loading="lazy"
            />
            <div className="category-banner-overlay">
              <div className="category-banner-meta">
                <span className="category-banner-count">{cat.itemCount}</span>
                <span className="category-banner-subtitle">{cat.subtitle}</span>
              </div>
              <div className="category-banner-title-row">
                <h3 className="category-banner-title">{cat.title}</h3>
                <div className="category-banner-arrow-btn">
                  <ArrowUpRight size={15} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
