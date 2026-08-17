import React from 'react';
import { ViewMode } from '../types';
import { ShieldCheck, Heart, Leaf, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ViewMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#2D4F2D] text-[#D4E9D4] border-t border-[#1E3A1E] transition-colors">
      {/* Top Banner / Scripture */}
      <div className="bg-[#1E3A1E] py-4 px-6 md:px-12 text-center border-b border-[#2D4F2D]">
        <p className="text-xs md:text-sm font-serif italic text-[#F5E6AB]">
          "Then shall the earth yield her increase; and God, even our own God, shall bless us." — Psalm 67:6
        </p>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.2A7 7 0 0 1 11 20z"/>
                <path d="M11 20c-1-3-4-3-4-3"/>
              </svg>
            </div>
            <span className="text-lg font-bold tracking-wider uppercase text-white font-brand">
              EBINESAR <span className="text-[#D4AF37]">HARVEST</span>
            </span>
          </div>
          <p className="text-xs text-[#D4E9D4]/80 leading-relaxed">
            Rooted in Faith. Grown with Care. Premium organic grains, wildflower honeys, and virgin cold-pressed oils delivered directly from sustainable farms.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
            <ShieldCheck className="w-4 h-4" />
            <span>FSSAI Organic Certified & Tested</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="font-serif font-bold text-white text-sm mb-4 tracking-wider uppercase">
            Harvest Collections
          </h4>
          <ul className="space-y-2 text-xs text-[#D4E9D4]/80">
            <li>
              <button onClick={() => onNavigate('shop')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                Organic Highland Grains
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                Wildflower Forest Honeys
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                Cold Pressed Wood-Churned Oils
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                Herbal Teas & Natural Spices
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Care & Policies */}
        <div>
          <h4 className="font-serif font-bold text-white text-sm mb-4 tracking-wider uppercase">
            Trust & Policies
          </h4>
          <ul className="space-y-2 text-xs text-[#D4E9D4]/80">
            <li>
              <button onClick={() => onNavigate('orders')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                Track Live Order & Status
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('about')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                Our Sacred Harvest Story
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('privacy')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('terms')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                Terms of Service
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shipping-policy')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                Shipping & Delivery Guide
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('refund-policy')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                Cancellation & Refund Policy
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Administration */}
        <div>
          <h4 className="font-serif font-bold text-white text-sm mb-4 tracking-wider uppercase">
            Reach Our Farm
          </h4>
          <ul className="space-y-2 text-xs text-[#D4E9D4]/80">
            <li className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>Ebinesar Organic Estates, Tamil Nadu, India</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>+91 98400 12345 / +91 80560 67890</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>care@ebinesarharvest.com</span>
            </li>
          </ul>

          <div className="mt-4 pt-4 border-t border-[#1E3A1E]">
            <button
              onClick={() => onNavigate('admin')}
              className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              🔒 Private Admin & Dropshipping Portal
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar matching design HTML */}
      <div className="bg-[#1E3A1E] text-[#D4E9D4] py-3 px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between text-[11px] font-medium tracking-wide border-t border-[#2D4F2D]/50 gap-2">
        <span>© {new Date().getFullYear()} EBINESAR HARVEST. All Rights Reserved.</span>
        <div className="flex gap-6 uppercase text-[10px]">
          <button onClick={() => onNavigate('privacy')} className="hover:text-[#D4AF37] cursor-pointer">Privacy Policy</button>
          <button onClick={() => onNavigate('terms')} className="hover:text-[#D4AF37] cursor-pointer">Terms of Service</button>
          <button onClick={() => onNavigate('shipping-policy')} className="hover:text-[#D4AF37] cursor-pointer">Shipping Info</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span>Systems Online • Secure Checkout</span>
        </div>
      </div>
    </footer>
  );
};
