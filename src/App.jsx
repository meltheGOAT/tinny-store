import React from "react";
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
import CommunityGallery from "./components/CommunityGallery";
import ShopAllPage from "./components/ShopAllPage";
import AdminPortal from "./components/AdminPortal";
import CartDrawer from "./components/CartDrawer";
import QuickViewModal from "./components/QuickViewModal";
import Footer from "./components/Footer";
import Toast from "./components/Toast";

function StorefrontApp() {
  const { currentRoute } = useStore();

  return (
    <div className="store-app-root">
      {currentRoute !== "admin" && <AnnouncementBar />}
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
          <CommunityGallery />
        </main>
      )}

      {currentRoute === "shop" && (
        <main>
          <ShopAllPage />
        </main>
      )}

      {currentRoute === "admin" && <AdminPortal />}

      {currentRoute !== "admin" && <Footer />}
      <CartDrawer />
      <QuickViewModal />
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
