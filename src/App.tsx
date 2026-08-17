import React, { useState, useEffect } from 'react';
import { Product, ViewMode } from './types';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider, useWishlist } from './context/WishlistContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Dedicated Page Section Components
import { HomePage } from './components/pages/HomePage';
import { ShopPage } from './components/pages/ShopPage';
import { CategoriesPage } from './components/pages/CategoriesPage';
import { OrderTrackingPage } from './components/pages/OrderTrackingPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { PolicyPages } from './components/PolicyPages';
import { AdminPortal } from './components/AdminPortal';

// Modals & Navigation
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AIAdvisorModal } from './components/AIAdvisorModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

import {
  Sparkles,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Bot,
  Truck,
  Leaf
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { isCartOpen, setIsCartOpen, totalItems } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();

  // Navigation & View State
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Products Data
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch products from server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch {
        console.error('Error fetching products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromNav = (cat: string) => {
    setSelectedCategory(cat);
    handleNavigate('shop');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2] font-sans text-[#1A2F1A] antialiased selection:bg-[#2D4F2D] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A2F1A] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#D4AF37]/40 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner: Faith Tagline & Free Shipping */}
      <div className="bg-[#14281A] text-[#F5E6AB] text-xs py-2 px-4 border-b border-[#2D5A36]/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left font-medium">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-[#2D5A36] text-[#FAF8F5] text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full tracking-wider border border-[#D4AF37]/30">
              <Leaf className="w-3 h-3 text-[#D4AF37]" /> Faithful Harvest
            </span>
            <span className="font-serif italic text-white/90">
              "The Lord has done great things for us, and we are filled with joy." — Psalm 126:3
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-white/80">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#D4AF37]" /> Free Pan-India Delivery above ₹999
            </span>
            <span className="hidden md:inline">|</span>
            <button
              onClick={() => setIsAIAdvisorOpen(true)}
              className="hidden md:flex items-center gap-1 text-[#D4AF37] hover:underline cursor-pointer font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" /> Ask Agronomist AI
            </button>
          </div>
        </div>
      </div>

      {/* Frosted Glass Top Navigation Bar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-3.5 bg-white/70 backdrop-blur-md border-b border-[#E2DCC8] sticky top-0 z-40 transition-all">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-[#2D4F2D] rounded-full flex items-center justify-center text-[#D4AF37] shadow-sm transition-transform duration-300 group-hover:scale-105">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.2A7 7 0 0 1 11 20z" />
              <path d="M11 20c-1-3-4-3-4-3" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight uppercase font-brand">
            EBINESAR <span className="text-[#2D4F2D]">HARVEST</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-7 text-sm font-medium">
          {[
            { label: 'Home', view: 'home' },
            { label: 'Shop Harvest', view: 'shop' },
            { label: 'Categories', view: 'categories' },
            { label: 'Track Order', view: 'orders' },
            { label: 'About', view: 'about' },
            { label: 'Contact', view: 'contact' },
          ].map((item) => (
            <button
              key={item.view}
              onClick={() => handleNavigate(item.view as ViewMode)}
              className={`transition-all cursor-pointer text-xs uppercase tracking-wider font-semibold py-1 ${
                currentView === item.view
                  ? 'text-[#2D4F2D] font-bold border-b-2 border-[#D4AF37]'
                  : 'hover:text-[#2D4F2D] text-[#4A5D4A]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* AI Advisor Button */}
          <button
            onClick={() => setIsAIAdvisorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E9F0E9] hover:bg-[#D4E9D4] text-[#2D4F2D] text-xs font-bold transition-all border border-[#D4E9D4] cursor-pointer"
            title="Ask Harvest AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Wishlist */}
          <button
            onClick={() => setIsWishlistModalOpen(true)}
            className="p-2 hover:bg-[#EAE7DC] rounded-full transition-colors relative cursor-pointer"
            title="Wishlist"
          >
            <Heart className="w-5 h-5 text-[#1A2F1A]" />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#D4AF37] text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* User Profile */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="p-2 hover:bg-[#EAE7DC] rounded-full transition-colors cursor-pointer relative"
            title={isAuthenticated ? user?.name : 'Sign In'}
          >
            <User className="w-5 h-5 text-[#1A2F1A]" />
            {isAuthenticated && (
              <span className="absolute bottom-1 right-1 w-2 h-2 bg-green-500 rounded-full border border-white" />
            )}
          </button>

          {/* Cart Icon with Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 hover:bg-[#EAE7DC] rounded-full transition-colors relative cursor-pointer"
            title="Harvest Basket"
          >
            <ShoppingBag className="w-5 h-5 text-[#1A2F1A]" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#D4AF37] text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-[#EAE7DC] rounded-full text-[#1A2F1A]"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-[#E2DCC8] px-6 py-4 space-y-3 z-30 animate-in slide-in-from-top duration-200">
          {[
            { label: 'Home', view: 'home' },
            { label: 'Shop Harvest Catalog', view: 'shop' },
            { label: 'Explore Categories', view: 'categories' },
            { label: 'Track Orders & Delivery', view: 'orders' },
            { label: 'Our Story & Faith', view: 'about' },
            { label: 'Contact Estate Office', view: 'contact' },
          ].map((link) => (
            <button
              key={link.view}
              onClick={() => handleNavigate(link.view as ViewMode)}
              className="block w-full text-left font-medium text-sm text-[#1A2F1A] py-1"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNavigate('admin')}
            className="block w-full text-left font-medium text-xs text-[#D4AF37] py-1 pt-2 border-t border-stone-200"
          >
            🔒 Admin & Dropshipping Console
          </button>
        </div>
      )}

      {/* PRIMARY SEPARATE SECTIONS ROUTER */}
      <main className="flex-grow flex flex-col">
        {currentView === 'home' && (
          <HomePage
            products={products}
            loading={loading}
            onSelectProduct={setSelectedProduct}
            onNavigate={handleNavigate}
            onSelectCategory={handleSelectCategoryFromNav}
            onToast={showToast}
            onOpenAdvisor={() => setIsAIAdvisorOpen(true)}
          />
        )}

        {currentView === 'shop' && (
          <ShopPage
            products={products}
            loading={loading}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectProduct={setSelectedProduct}
            onNavigate={handleNavigate}
            onToast={showToast}
          />
        )}

        {currentView === 'categories' && (
          <CategoriesPage
            products={products}
            onSelectCategory={handleSelectCategoryFromNav}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'orders' && (
          <OrderTrackingPage
            onNavigate={handleNavigate}
            onToast={showToast}
          />
        )}

        {currentView === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'contact' && (
          <ContactPage
            onNavigate={handleNavigate}
            onToast={showToast}
          />
        )}

        {(currentView === 'privacy' ||
          currentView === 'terms' ||
          currentView === 'shipping-policy' ||
          currentView === 'refund-policy') && (
          <PolicyPages
            view={currentView}
            onNavigate={handleNavigate}
            onToast={showToast}
          />
        )}

        {currentView === 'admin' && (
          <AdminPortal
            onToast={showToast}
            onClose={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Floating AI Agronomist Trigger */}
      <button
        onClick={() => setIsAIAdvisorOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-[#2D4F2D] text-white p-3.5 rounded-full shadow-2xl hover:bg-[#1E3A1E] transition-all transform hover:scale-110 flex items-center gap-2 border border-[#D4AF37]/50 cursor-pointer"
        title="Consult AI Agronomist"
      >
        <Bot className="w-5 h-5 text-[#D4AF37]" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          Ask Agronomist
        </span>
      </button>

      {/* Wishlist Modal */}
      {isWishlistModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsWishlistModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[85vh] bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E2DCC8] p-6 overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center pb-4 border-b border-[#E2DCC8]">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#D4AF37] fill-current" />
                <h3 className="font-serif font-bold text-lg text-[#1A2F1A]">Harvest Wishlist ({wishlist.length})</h3>
              </div>
              <button
                onClick={() => setIsWishlistModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-200 text-[#1A2F1A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {wishlist.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <Heart className="w-10 h-10 text-[#8B9A8B] mx-auto opacity-40" />
                  <p className="text-xs text-[#6B7C6B]">Your wishlist is currently empty.</p>
                </div>
              ) : (
                wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-2xl border border-[#E2DCC8] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.images[0] || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=150'}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-[#1A2F1A]">{item.name}</h4>
                        <span className="text-xs font-bold text-[#2D4F2D]">₹{item.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(item);
                          setIsWishlistModalOpen(false);
                        }}
                        className="px-3 py-1.5 bg-[#2D4F2D] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#1E3A1E]"
                      >
                        View
                      </button>
                      <button
                        onClick={() => toggleWishlist(item)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onToast={showToast}
      />

      {/* Cart Drawer */}
      <CartDrawer
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onContinueShopping={() => handleNavigate('shop')}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(orderId) => {
          setIsCheckoutOpen(false);
          showToast(`Blessed Order #${orderId} confirmed! Check your email for delivery tracking.`);
          handleNavigate('orders');
        }}
        onToast={showToast}
      />

      {/* AI Advisor Modal */}
      <AIAdvisorModal
        isOpen={isAIAdvisorOpen}
        onClose={() => setIsAIAdvisorOpen(false)}
      />

      {/* Customer Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onToast={showToast}
      />

      {/* Footer Component */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <MainAppContent />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
