import React, { useEffect } from "react";
import { StoreProvider } from "./context/StoreContext";
import { useStore } from "./context/useStore";
import AnnouncementBar from "./components/AnnouncementBar";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BestSellers from "./components/BestSellers";
import BrandPhilosophy from "./components/BrandPhilosophy";
import CampaignShowcase from "./components/CampaignShowcase";
import CategoryBanners from "./components/CategoryBanners";
import SpotlightDrop from "./components/SpotlightDrop";
import Lookbook from "./components/Lookbook";
import ShopAllPage from "./components/ShopAllPage";
import ProductDetailPage from "./components/ProductDetailPage";
import AdminPortal from "./components/AdminPortal";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import Toast from "./components/Toast";

function StorefrontApp() {
  const { currentRoute } = useStore();

  // Dismiss the HTML loading screen once all resources are loaded
  useEffect(() => {
    const dismiss = () => {
      const el = document.getElementById('loading-screen');
      if (el) {
        el.classList.add('loading-fade-out');
        setTimeout(() => el.remove(), 600);
      }
    };

    if (document.readyState === 'complete') {
      dismiss();
    } else {
      window.addEventListener('load', dismiss);
      return () => window.removeEventListener('load', dismiss);
    }
  }, []);

  return (
    <div className="store-app-root">
      {currentRoute === "storefront" && <AnnouncementBar />}
      {currentRoute !== "admin" && <Navbar />}

      {currentRoute === "storefront" && (
        <main>
          <Hero />
          <BestSellers />
          <CampaignShowcase />
          <BrandPhilosophy />
          <CategoryBanners />
          <SpotlightDrop />
          <Lookbook />
        </main>
      )}

      {currentRoute === "shop" && (
        <main>
          <ShopAllPage />
        </main>
      )}

      {currentRoute === "product" && <ProductDetailPage />}

      {currentRoute === "admin" && <AdminPortal />}

      {currentRoute !== "admin" && <Footer />}
      <CartDrawer />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StorefrontApp />
    </StoreProvider>
  );
}
