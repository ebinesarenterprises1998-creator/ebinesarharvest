import React, { useState, useEffect } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  onSearchOpen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onSearchOpen }) => {
  const { user, isAdmin, signOut } = useAuth();
  const { cartCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Categories', id: 'categories' },
    { name: 'Shop', id: 'shop' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F8F4EA]/90 backdrop-blur-md shadow-md py-2 border-b border-[#0B3D2E]/10'
          : 'bg-[#F8F4EA]/80 backdrop-blur-md py-3.5 border-b border-[#0B3D2E]/10'
      }`}
    >
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#0B3D2E] text-[#F8F4EA] text-[11px] py-1.5 px-4 text-center font-medium tracking-widest uppercase flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C99A2E] animate-pulse"></span>
        <span>
          Harvest Announcement: Use code <strong className="text-[#FFDF78] font-bold">GRACE10</strong> for 10% off your farm-fresh order
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between mt-1">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="text-left focus:outline-none transition-transform hover:scale-[1.01]"
          aria-label="Ebinesar Harvest Home"
        >
          <BrandLogo size={isScrolled ? 'sm' : 'md'} showTagline={true} />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold uppercase tracking-widest" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`transition-colors duration-200 ${
                  isActive
                    ? 'text-[#0B3D2E] font-bold border-b-2 border-[#C99A2E] pb-1'
                    : 'text-[#0B3D2E]/80 hover:text-[#C99A2E]'
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </nav>

        {/* Action Controls (Search, Wishlist, Cart, Account) */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Search Button */}
          <button
            onClick={onSearchOpen}
            className="p-2 text-[#0B3D2E] hover:text-[#C99A2E] hover:bg-[#0B3D2E]/5 rounded-full transition-colors"
            aria-label="Search harvest products"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => onNavigate('wishlist')}
            className="relative p-2 text-[#0B3D2E] hover:text-[#C99A2E] hover:bg-[#0B3D2E]/5 rounded-full transition-colors"
            aria-label="View wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#C99A2E] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={openCartDrawer}
            className="relative p-2 text-[#0B3D2E] hover:text-[#C99A2E] hover:bg-[#0B3D2E]/5 rounded-full transition-colors"
            aria-label="Open shopping cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-0 right-0 bg-[#C99A2E] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {cartCount}
            </span>
          </button>

          {/* User Account / Profile Menu */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-full border border-[#0B3D2E]/20 bg-white/80 hover:bg-white text-xs font-semibold text-[#0B3D2E] transition-all shadow-sm"
              >
                <span>{user.full_name.split(' ')[0]}</span>
                {isAdmin && (
                  <span className="bg-[#C99A2E] text-[#063B2D] text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">
                    Admin
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-[#1B2A22]/60" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#0B3D2E] hover:bg-[#0B3D2E]/5 border border-[#0B3D2E]/20 rounded-full transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Dropdown Menu */}
            {isUserDropdownOpen && user && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#0B3D2E]/10 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500">Signed in as</p>
                  <p className="text-sm font-bold text-[#0B3D2E] truncate">{user.email}</p>
                </div>

                {isAdmin ? (
                  <>
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        onNavigate('admin');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#0B3D2E] hover:bg-[#0B3D2E]/5 font-medium flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#C99A2E]" />
                      Admin Portal
                    </button>
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        onNavigate('admin-products');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#0B3D2E] hover:bg-[#0B3D2E]/5 flex items-center gap-2"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-[#0B3D2E]" />
                      Manage Products
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        onNavigate('account');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#0B3D2E] hover:bg-[#0B3D2E]/5 font-medium"
                    >
                      My Harvest Account
                    </button>
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        onNavigate('orders');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#0B3D2E] hover:bg-[#0B3D2E]/5"
                    >
                      My Orders
                    </button>
                  </>
                )}

                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#0B3D2E] hover:bg-[#0B3D2E]/5 rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FCFAF5] border-t border-[#0B3D2E]/10 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate(link.id);
              }}
              className={`block w-full text-left py-2 px-3 rounded-lg font-medium text-base ${
                currentPage === link.id
                  ? 'bg-[#0B3D2E] text-white'
                  : 'text-[#1B2A22] hover:bg-[#0B3D2E]/5'
              }`}
            >
              {link.name}
            </button>
          ))}

          <div className="pt-3 border-t border-gray-200">
            {user ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate(isAdmin ? 'admin' : 'account');
                  }}
                  className="w-full text-center py-2.5 bg-[#0B3D2E] text-[#FFDF78] font-bold rounded-xl text-sm"
                >
                  {isAdmin ? 'Admin Dashboard' : 'My Account'}
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut();
                  }}
                  className="w-full text-center py-2 text-sm text-red-600 font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('login');
                  }}
                  className="w-full py-2.5 border border-[#0B3D2E] text-[#0B3D2E] font-bold rounded-xl text-sm"
                >
                  Customer Sign In
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('admin-login');
                  }}
                  className="w-full py-2.5 bg-[#0B3D2E] text-[#FFDF78] font-bold rounded-xl text-sm"
                >
                  Admin Portal
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
