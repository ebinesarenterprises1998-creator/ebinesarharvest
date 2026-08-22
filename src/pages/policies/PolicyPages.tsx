import React from 'react';
import { ArrowLeft, ShieldCheck, Truck, RotateCcw, Lock, FileText } from 'lucide-react';

interface PolicyProps {
  onNavigate: (page: string) => void;
}

export const ShippingPolicyPage: React.FC<PolicyProps> = ({ onNavigate }) => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
    <button
      onClick={() => onNavigate('home')}
      className="text-xs font-bold text-[#0B3D2E] inline-flex items-center gap-1"
    >
      <ArrowLeft className="w-3.5 h-3.5" /> Return Home
    </button>
    <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#0B3D2E]/10 shadow-sm space-y-4">
      <div className="flex items-center gap-3 text-[#0B3D2E]">
        <Truck className="w-8 h-8 text-[#C99A2E]" />
        <h1 className="font-display font-black text-2xl sm:text-3xl">Shipping & Dispatch Policy</h1>
      </div>
      <div className="prose text-xs sm:text-sm text-[#1B2A22]/80 space-y-4 leading-relaxed pt-4 border-t border-gray-100">
        <p>
          At <strong>Ebinesar Harvest</strong>, we prioritize the fresh, wholesome integrity of every order.
          All farm goods are packed in eco-friendly, moisture-resistant packaging directly from our harvest hubs.
        </p>
        <h3 className="font-bold text-[#0B3D2E] text-base">1. Dispatch Timelines</h3>
        <p>
          Orders placed before 2:00 PM are processed and handed over to our verified courier partners within 24 to 48 hours.
          Transit typically takes 2–5 business days depending on your postal location.
        </p>
        <h3 className="font-bold text-[#0B3D2E] text-base">2. Free Shipping Threshold</h3>
        <p>
          We offer complimentary Standard Shipping on all cart totals exceeding <strong>₹1,000</strong>. Orders below this threshold incur a nominal ₹80 standard flat fee.
        </p>
      </div>
    </div>
  </div>
);

export const ReturnsPolicyPage: React.FC<PolicyProps> = ({ onNavigate }) => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
    <button
      onClick={() => onNavigate('home')}
      className="text-xs font-bold text-[#0B3D2E] inline-flex items-center gap-1"
    >
      <ArrowLeft className="w-3.5 h-3.5" /> Return Home
    </button>
    <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#0B3D2E]/10 shadow-sm space-y-4">
      <div className="flex items-center gap-3 text-[#0B3D2E]">
        <RotateCcw className="w-8 h-8 text-[#C99A2E]" />
        <h1 className="font-display font-black text-2xl sm:text-3xl">Returns & Replacements</h1>
      </div>
      <div className="prose text-xs sm:text-sm text-[#1B2A22]/80 space-y-4 leading-relaxed pt-4 border-t border-gray-100">
        <p>
          Our motto is <em>&ldquo;From His Grace, We Grow&rdquo;</em>, and our goal is your complete satisfaction with every harvest delivery.
        </p>
        <h3 className="font-bold text-[#0B3D2E] text-base">1. Fresh Harvest Replacement</h3>
        <p>
          Due to the perishable nature of agricultural items, we cannot accept returns of opened consumable packages. However, if any product arrives damaged, defective, or spoiled in transit, we will immediately issue a full replacement or prompt refund.
        </p>
        <h3 className="font-bold text-[#0B3D2E] text-base">2. Reporting an Issue</h3>
        <p>
          Please reach out to our stewards at <strong>care@ebinesarharvest.com</strong> within 48 hours of receiving your delivery along with a photo of the parcel.
        </p>
      </div>
    </div>
  </div>
);

export const PrivacyPolicyPage: React.FC<PolicyProps> = ({ onNavigate }) => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
    <button
      onClick={() => onNavigate('home')}
      className="text-xs font-bold text-[#0B3D2E] inline-flex items-center gap-1"
    >
      <ArrowLeft className="w-3.5 h-3.5" /> Return Home
    </button>
    <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#0B3D2E]/10 shadow-sm space-y-4">
      <div className="flex items-center gap-3 text-[#0B3D2E]">
        <Lock className="w-8 h-8 text-[#C99A2E]" />
        <h1 className="font-display font-black text-2xl sm:text-3xl">Privacy & Data Stewardship</h1>
      </div>
      <div className="prose text-xs sm:text-sm text-[#1B2A22]/80 space-y-4 leading-relaxed pt-4 border-t border-gray-100">
        <p>
          We respect your privacy as sacred. Ebinesar Harvest does not sell, rent, or trade your personal information.
        </p>
        <h3 className="font-bold text-[#0B3D2E] text-base">1. Data Storage & Protection</h3>
        <p>
          All account information is protected by Supabase Row Level Security (RLS). You have full control over your saved addresses and personal details.
        </p>
        <h3 className="font-bold text-[#0B3D2E] text-base">2. Secure Payments</h3>
        <p>
          We never store your credit card or banking credentials. All payments are routed through PCI-DSS Level 1 compliant Razorpay gateways.
        </p>
      </div>
    </div>
  </div>
);

export const TermsPage: React.FC<PolicyProps> = ({ onNavigate }) => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
    <button
      onClick={() => onNavigate('home')}
      className="text-xs font-bold text-[#0B3D2E] inline-flex items-center gap-1"
    >
      <ArrowLeft className="w-3.5 h-3.5" /> Return Home
    </button>
    <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#0B3D2E]/10 shadow-sm space-y-4">
      <div className="flex items-center gap-3 text-[#0B3D2E]">
        <FileText className="w-8 h-8 text-[#C99A2E]" />
        <h1 className="font-display font-black text-2xl sm:text-3xl">Terms of Service</h1>
      </div>
      <div className="prose text-xs sm:text-sm text-[#1B2A22]/80 space-y-4 leading-relaxed pt-4 border-t border-gray-100">
        <p>
          By accessing or ordering from Ebinesar Harvest, you agree to these transparent terms of honest service and respectful engagement.
        </p>
        <h3 className="font-bold text-[#0B3D2E] text-base">1. Agricultural Variability</h3>
        <p>
          Natural farm goods may experience subtle variations in color, grain size, or harvest shade depending on the season and climate. This is evidence of genuine organic agriculture without synthetic dyes.
        </p>
      </div>
    </div>
  </div>
);
