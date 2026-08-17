import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  Phone,
  Truck,
  Leaf,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenAdvisor: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenAuth,
  onOpenAdmin,
  onOpenAdvisor,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, signOut } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Shop Harvest', view: 'shop' },
    { label: 'Categories', view: 'categories' },
    { label: 'Track Order', view: 'orders' },
    { label: 'About', view: 'about' },
    { label: 'Contact', view: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
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
            <span className="flex items-center gap-1.5 hover:text-[#F5E6AB] transition-colors">
              <Truck className="w-3.5 h-3.5 text-[#D4AF37]" /> Free Shipping above ₹999
            </span>
            <span className="hidden md:inline">|</span>
            <button
              onClick={onOpenAdvisor}
              className="hidden md:flex items-center gap-1 text-[#D4AF37] hover:underline cursor-pointer font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" /> Ask Agronomist AI
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-md py-3 border-b border-[#E6DECE]'
            : 'bg-[#FAF8F5] py-4 border-b border-[#E6DECE]/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <BrandLogo
            size="md"
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <input
                id="main-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'shop') setCurrentView('shop');
                }}
                placeholder="Search heirloom wheat, cold-pressed oils, seeds, honey..."
                className="w-full pl-10 pr-4 py-2 bg-white text-sm rounded-full border border-[#D5CBB9] focus:outline-none focus:ring-2 focus:ring-[#2D5A36] focus:border-transparent transition-all shadow-inner text-[#1B3C23] placeholder:text-[#8C8270]"
              />
              <Search className="w-4 h-4 text-[#8C8270] absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.view}
                id={`nav-link-${link.view}`}
                onClick={() => {
                  setCurrentView(link.view);
                  setMobileMenuOpen(false);
                }}
                className={`text-sm font-semibold tracking-wide transition-colors relative py-1 cursor-pointer ${
                  currentView === link.view
                    ? 'text-[#1B3C23] font-bold'
                    : 'text-[#4A5D4E] hover:text-[#1B3C23]'
                }`}
              >
                {link.label}
                {currentView === link.view && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF37] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* AI Advisor Trigger (Mobile / Quick) */}
            <button
              id="ai-advisor-nav-btn"
              onClick={onOpenAdvisor}
              title="Agricultural AI Advisor"
              className="flex items-center gap-1.5 bg-[#2D5A36]/10 hover:bg-[#2D5A36]/20 text-[#1B3C23] px-3 py-1.5 rounded-full text-xs font-semibold border border-[#2D5A36]/20 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#B8860B]" />
              <span className="hidden sm:inline">Harvest AI</span>
            </button>

            {/* Wishlist Button */}
            <button
              id="nav-wishlist-btn"
              onClick={() => setCurrentView('account')}
              title="View Wishlist"
              className="relative p-2 text-[#2D5A36] hover:bg-[#EFE9DC] rounded-full transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B8860B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="nav-cart-btn"
              onClick={() => setIsCartOpen(true)}
              title="Shopping Harvest Cart"
              className="relative p-2 bg-[#1B3C23] hover:bg-[#2D5A36] text-[#FAF8F5] rounded-full transition-colors shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-[#F5E6AB]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#1B3C23] text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Account / Admin Portal */}
            <div className="relative">
              {user ? (
                <button
                  id="nav-account-btn"
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-2 p-1.5 hover:bg-[#EFE9DC] rounded-full transition-colors border border-[#D5CBB9]/60"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2D5A36] text-[#F5E6AB] flex items-center justify-center text-xs font-bold uppercase shadow-inner">
                    {user.full_name.charAt(0) || 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#2D5A36] hidden sm:block" />
                </button>
              ) : (
                <button
                  id="nav-login-btn"
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 text-xs font-bold bg-[#FAF8F5] hover:bg-[#EFE9DC] text-[#1B3C23] px-3.5 py-2 rounded-full border border-[#2D5A36] transition-all cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#2D5A36]" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Account Dropdown */}
              {isAccountMenuOpen && user && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E6DECE] py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setIsAccountMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs text-stone-500 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-[#1B3C23] truncate">{user.full_name}</p>
                    <p className="text-xs text-stone-400 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={() => setCurrentView('account')}
                    className="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#2D5A36]" /> My Account & Orders
                  </button>

                  {isAdmin && (
                    <button
                      id="nav-admin-portal-link"
                      onClick={onOpenAdmin}
                      className="w-full px-4 py-2 text-left text-sm font-bold text-[#B8860B] bg-[#FDF8EE] hover:bg-[#F5E6AB]/30 flex items-center gap-2 cursor-pointer border-y border-[#D4AF37]/20"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#B8860B]" /> Admin Dashboard
                    </button>
                  )}

                  <button
                    onClick={signOut}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer mt-1"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1B3C23] hover:bg-[#EFE9DC] rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden px-4 pt-3 pb-1">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== 'shop') setCurrentView('shop');
              }}
              placeholder="Search organic seeds, cold-pressed oils, honey..."
              className="w-full pl-10 pr-4 py-2 bg-white text-sm rounded-full border border-[#D5CBB9] focus:outline-none focus:ring-2 focus:ring-[#2D5A36] text-[#1B3C23]"
            />
            <Search className="w-4 h-4 text-[#8C8270] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF8F5] border-t border-[#E6DECE] px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => {
                  setCurrentView(link.view);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                  currentView === link.view
                    ? 'bg-[#1B3C23] text-white'
                    : 'text-[#1B3C23] hover:bg-[#EFE9DC]'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-2 border-t border-[#E6DECE] flex flex-col gap-2">
              <button
                onClick={() => {
                  setCurrentView('account');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-semibold text-[#2D5A36] hover:bg-[#EFE9DC] rounded-lg flex items-center gap-2"
              >
                <User className="w-4 h-4" /> My Account & Orders
              </button>

              {isAdmin && (
                <button
                  onClick={() => {
                    onOpenAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-bold text-[#B8860B] bg-[#FDF8EE] rounded-lg flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Admin Management Suite
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
