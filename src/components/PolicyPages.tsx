import React from 'react';
import { ViewMode } from '../types';
import { ShieldCheck, Heart, Truck, RotateCcw, Mail, Phone, MapPin, CheckCircle2, Lock, FileText } from 'lucide-react';

interface PolicyPagesProps {
  view: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onToast: (msg: string) => void;
}

export const PolicyPages: React.FC<PolicyPagesProps> = ({ view, onNavigate, onToast }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Return to Home link */}
      <button
        onClick={() => onNavigate('home')}
        className="mb-8 text-xs font-bold text-[#2D4F2D] hover:underline flex items-center gap-1 cursor-pointer"
      >
        ← Return to Harvest Home
      </button>

      {/* 🔒 PRIVACY POLICY SECTION */}
      {view === 'privacy' && (
        <div className="bg-[#FDFCF9] border border-[#F0EBE0] rounded-3xl p-8 md:p-12 shadow-sm space-y-6 text-xs md:text-sm text-[#4A5D4A] leading-relaxed">
          <div className="flex items-center gap-3 pb-2 border-b border-[#E2DCC8]">
            <div className="p-3 bg-[#E9F0E9] rounded-2xl text-[#2D4F2D]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
                Customer Protection & Data Privacy
              </span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1A2F1A]">
                Privacy & Data Security Policy
              </h1>
            </div>
          </div>

          <p className="text-[#8B9A8B] text-xs">Last updated: February 2026 • Valid for Pan-India Patrons</p>

          <p>
            At <strong>EBINESAR HARVEST</strong> (accessible from <code>ebinesarharvest.com</code>), the privacy, security, and trust of our patron community are paramount. This Privacy Policy details how we collect, safeguard, and utilize customer information.
          </p>

          <div className="space-y-4 pt-2">
            <div className="p-4 bg-white rounded-2xl border border-[#E2DCC8] space-y-2">
              <h3 className="font-bold text-sm text-[#1A2F1A] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D4F2D]" />
                1. Information We Collect
              </h3>
              <p className="text-xs text-[#6B7C6B]">
                When you create an account, place an order, or subscribe to harvest bulletins, we collect your name, email, delivery postal address, and contact telephone number strictly for order fulfillment, courier transit updates, and automated email receipts.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E2DCC8] space-y-2">
              <h3 className="font-bold text-sm text-[#1A2F1A] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                2. PCI-DSS Certified Digital Payments
              </h3>
              <p className="text-xs text-[#6B7C6B]">
                We do not store your credit card numbers, debit PINs, or UPI passwords on our servers. All digital monetary settlements are processed through Razorpay's bank-grade 256-bit encrypted gateway.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E2DCC8] space-y-2">
              <h3 className="font-bold text-sm text-[#1A2F1A] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#2D4F2D]" />
                3. Zero Third-Party Data Selling
              </h3>
              <p className="text-xs text-[#6B7C6B]">
                We will never sell, lease, or monetize your contact records. Your address and phone details are provided only to authorized logistics carriers (BlueDart, DTDC, India Post) to execute doorstep delivery.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#FAF0D7] rounded-2xl border border-[#D4AF37] text-xs text-[#735100]">
            <strong>Privacy Questions?</strong> Email our compliance team directly at <a href="mailto:privacy@ebinesarharvest.com" className="underline font-bold">privacy@ebinesarharvest.com</a>.
          </div>
        </div>
      )}

      {/* 📜 TERMS OF SERVICE SECTION */}
      {view === 'terms' && (
        <div className="bg-[#FDFCF9] border border-[#F0EBE0] rounded-3xl p-8 md:p-12 shadow-sm space-y-6 text-xs md:text-sm text-[#4A5D4A] leading-relaxed">
          <div className="flex items-center gap-3 pb-2 border-b border-[#E2DCC8]">
            <div className="p-3 bg-[#FAF0D7] rounded-2xl text-[#D4AF37]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
                Patron Agreement
              </span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1A2F1A]">
                Terms & Conditions of Service
              </h1>
            </div>
          </div>

          <p className="text-[#8B9A8B] text-xs">Last updated: February 2026</p>

          <p>
            Welcome to EBINESAR HARVEST. By accessing our platform, placing orders, or utilizing our Agronomist AI services, you agree to comply with the terms and practices stated herein.
          </p>

          <div className="space-y-4 pt-2">
            <div className="p-4 bg-white rounded-2xl border border-[#E2DCC8] space-y-2">
              <h3 className="font-bold text-sm text-[#1A2F1A]">1. Natural Agricultural Variations</h3>
              <p className="text-xs text-[#6B7C6B]">
                Because our organic harvests are 100% natural, unbleached, and free from synthetic preservatives, subtle seasonal variations in color, golden hue, crystallization (in raw honey), and aroma naturally occur across weather flushes.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E2DCC8] space-y-2">
              <h3 className="font-bold text-sm text-[#1A2F1A]">2. Transparent Pricing & Taxes</h3>
              <p className="text-xs text-[#6B7C6B]">
                All catalog prices are listed in Indian National Rupees (INR) and are inclusive of agricultural GST and local levies. We reserve the right to revise seasonal prices based on farm yields.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E2DCC8] space-y-2">
              <h3 className="font-bold text-sm text-[#1A2F1A]">3. AI Agronomist Guidance Disclaimer</h3>
              <p className="text-xs text-[#6B7C6B]">
                Our Gemini-powered Agronomist AI provides nutritional knowledge, storage guidance, and traditional organic farming tips for informational purposes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 🚚 SHIPPING & DELIVERY POLICY SECTION */}
      {view === 'shipping-policy' && (
        <div className="bg-[#FDFCF9] border border-[#F0EBE0] rounded-3xl p-8 md:p-12 shadow-sm space-y-6 text-xs md:text-sm text-[#4A5D4A] leading-relaxed">
          <div className="flex items-center gap-3 pb-2 border-b border-[#E2DCC8]">
            <div className="p-3 bg-[#E9F0E9] rounded-2xl text-[#2D4F2D]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
                Pan-India Agricultural Logistics
              </span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1A2F1A]">
                Shipping & Delivery Guide
              </h1>
            </div>
          </div>

          <p>
            We take pride in packaging our cold-pressed oils, grains, and forest honeys in food-grade, shock-absorbing materials to ensure pristine arrival at your kitchen doorstep.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            <div className="p-5 bg-white rounded-2xl border border-[#E2DCC8] space-y-2">
              <h4 className="font-bold text-sm text-[#1A2F1A]">South India Express (1–2 Days)</h4>
              <p className="text-xs text-[#6B7C6B]">
                Direct dispatches across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh & Telangana via BlueDart Air and priority surface logistics.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#E2DCC8] space-y-2">
              <h4 className="font-bold text-sm text-[#1A2F1A]">Rest of India (3–4 Days)</h4>
              <p className="text-xs text-[#6B7C6B]">
                Air express service to Mumbai, Delhi NCR, Kolkata, Hyderabad, Pune, Ahmedabad and all other major pin codes across India.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#E9F0E9] rounded-2xl border border-[#D4E9D4] text-xs text-[#2D4F2D] space-y-1">
            <strong>Free Shipping Privilege:</strong> All orders above <strong>₹999</strong> automatically receive 100% complimentary express shipping. A nominal ₹80 fee applies on orders below ₹999.
          </div>
        </div>
      )}

      {/* 🔄 CANCELLATION & REFUND POLICY SECTION */}
      {view === 'refund-policy' && (
        <div className="bg-[#FDFCF9] border border-[#F0EBE0] rounded-3xl p-8 md:p-12 shadow-sm space-y-6 text-xs md:text-sm text-[#4A5D4A] leading-relaxed">
          <div className="flex items-center gap-3 pb-2 border-b border-[#E2DCC8]">
            <div className="p-3 bg-[#FAF0D7] rounded-2xl text-[#D4AF37]">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
                100% Freshness Guarantee
              </span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1A2F1A]">
                Cancellation & Refund Policy
              </h1>
            </div>
          </div>

          <p>
            We stand unreservedly behind the quality of every harvest item. If you receive a damaged jar, unsealed packaging, or incorrect harvest item:
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-4 bg-white rounded-2xl border border-[#E2DCC8] flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#2D4F2D] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <p className="text-xs text-[#4A5D4A]">
                Notify our team within 48 hours of delivery at <strong>support@ebinesarharvest.com</strong> with your order number and a photo of the package.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E2DCC8] flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#2D4F2D] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <p className="text-xs text-[#4A5D4A]">
                We will dispatch an immediate free express replacement or initiate a 100% full refund directly to your original payment method within 3–5 business days.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E2DCC8] flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#2D4F2D] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <p className="text-xs text-[#4A5D4A]">
                Orders may also be cancelled before parcel dispatch for an instant 100% refund without any deduction.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
