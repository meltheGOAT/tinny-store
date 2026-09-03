import React from 'react';
import { ArrowUpRight, Camera } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function CommunityGallery() {
  const { setCurrentRoute, setActiveCategory } = useStore();

  const posts = [
    {
      id: 1,
      tag: '#TinnyAbuja',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=85',
      category: 'outerwear'
    },
    {
      id: 2,
      tag: '#TheWorldIsYours',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85',
      category: 'tops'
    },
    {
      id: 3,
      tag: '#TinnyAthletics',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=85',
      category: 'tops'
    },
    {
      id: 4,
      tag: '#AbujaManor',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=85',
      category: 'outerwear'
    },
    {
      id: 5,
      tag: '#ApexSnapback',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=85',
      category: 'headwear'
    },
    {
      id: 6,
      tag: '#TinnyArtisanal',
      image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=85',
      category: 'tops'
    }
  ];

  const handlePostClick = (cat) => {
    setCurrentRoute('shop');
    setActiveCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="community-section">
      <div className="section-header-minimal">
        <div className="section-header-left">
          <span className="section-eyebrow-clean">
            <Camera size={12} style={{ color: 'var(--accent-gold)' }} />
            @TINNYSTORE
          </span>
          <h2 className="section-title-clean">TAGGED IN ABUJA</h2>
        </div>
        <span className="section-side-note">#TINNYSTREETWEAR</span>
      </div>

      <div className="community-grid">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="community-card"
            onClick={() => handlePostClick(post.category)}
          >
            <img 
              src={post.image} 
              alt={post.tag} 
              className="community-img"
              loading="lazy"
            />
            <div className="community-overlay">
              <span className="community-tag">{post.tag}</span>
              <div className="community-shop-pill">
                <span>Shop Look</span>
                <ArrowUpRight size={13} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
