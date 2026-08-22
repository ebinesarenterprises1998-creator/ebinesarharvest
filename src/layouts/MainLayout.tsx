import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { SearchModal } from '../components/common/SearchModal';

interface MainLayoutProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentPage,
  onNavigate,
  children,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4EA] text-[#1B2A22] antialiased selection:bg-[#C99A2E] selection:text-[#063B2D] relative">
      {/* Global Agricultural Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.035] z-0" 
        style={{
          backgroundImage: `radial-gradient(#0B3D2E 1px, transparent 1px), radial-gradient(#C99A2E 1px, #F8F4EA 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
        }}
        aria-hidden="true"
      />

      {/* Sticky Header Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={onNavigate}
        onSearchOpen={() => setIsSearchOpen(true)}
      />

      {/* Main Page Area */}
      <main className="flex-1 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />

      {/* Global Interactive Drawers & Modals */}
      <CartDrawer onNavigate={onNavigate} />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
