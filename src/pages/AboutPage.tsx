import React from 'react';
import { Sparkles, HeartHandshake, Sprout, Sun, Award, ShieldCheck, Compass } from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Hero Narrative */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B3D2E]/10 text-[#0B3D2E] text-xs font-bold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#C99A2E]" />
          <span>OUR STORY & HERITAGE</span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl text-[#0B3D2E] leading-tight">
          Rooted in Faith, <br />
          <span className="gold-gradient-text">Nurtured by Grace.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#1B2A22]/80 font-serif-sub italic leading-relaxed">
          &ldquo;Then Samuel took a stone and set it up between Mizpah and Shen. He named it Ebenezer, saying, &apos;Thus far the Lord has helped us.&apos;&rdquo; — 1 Samuel 7:12
        </p>
      </div>

      {/* Brand Identity Emblem */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#0B3D2E]/10 shadow-lg flex flex-col md:flex-row items-center gap-10">
        <div className="shrink-0">
          <BrandLogo size="xl" showTagline={true} />
        </div>
        <div className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-[#0B3D2E]">
            The Symbolism of Ebinesar Harvest
          </h2>
          <p className="text-sm text-[#1B2A22]/80 leading-relaxed">
            Our identity unites the sacred <strong>Christian Cross</strong> representing God&apos;s grace and providence, 
            the flourishing <strong>golden wheat sheaves</strong> symbolizing abundance and diligence, and the 
            <strong>fertile furrowed fields</strong> celebrating honest agricultural labor.
          </p>
          <p className="text-sm text-[#1B2A22]/80 leading-relaxed">
            Our motto, <em className="text-[#0B3D2E] font-semibold">&ldquo;From His Grace, We Grow&rdquo;</em>, reminds us that true nourishment is both physical and spiritual.
          </p>
        </div>
      </div>

      {/* Pillars of Stewardship */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#FCFAF5] p-8 rounded-3xl border border-[#C99A2E]/30 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#0B3D2E] text-[#FFDF78] flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#0B3D2E]">Uncompromised Purity</h3>
          <p className="text-xs sm:text-sm text-[#1B2A22]/75 leading-relaxed">
            We reject harmful synthetic chemicals, pesticides, and artificial preservatives. We believe the land yields its best when honored according to natural design.
          </p>
        </div>

        <div className="bg-[#FCFAF5] p-8 rounded-3xl border border-[#C99A2E]/30 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#C99A2E] text-[#063B2D] flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#0B3D2E]">Farmer Empowerment</h3>
          <p className="text-xs sm:text-sm text-[#1B2A22]/75 leading-relaxed">
            Our farming partners and artisan producers receive fair compensation, transparent contracts, and community support to sustain their families with honor.
          </p>
        </div>

        <div className="bg-[#FCFAF5] p-8 rounded-3xl border border-[#C99A2E]/30 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#0B3D2E] text-[#FFDF78] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#0B3D2E]">Faith & Stewardship</h3>
          <p className="text-xs sm:text-sm text-[#1B2A22]/75 leading-relaxed">
            We operate with transparency, treating every customer as an honored guest and every harvest shipment as a blessing delivered into your home.
          </p>
        </div>
      </div>

      {/* Call to Explore */}
      <div className="text-center pt-8">
        <button
          onClick={() => onNavigate('shop')}
          className="px-8 py-3.5 bg-[#0B3D2E] hover:bg-[#063B2D] text-[#FFDF78] font-display font-bold text-sm tracking-wider rounded-2xl shadow-lg transition-transform hover:scale-105"
        >
          EXPLORE THE HARVEST
        </button>
      </div>
    </div>
  );
};
