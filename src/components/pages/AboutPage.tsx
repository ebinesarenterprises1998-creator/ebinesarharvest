import React from 'react';
import { ViewMode } from '../../types';
import {
  ShieldCheck,
  Heart,
  Truck,
  Wheat,
  Leaf,
  Sun,
  Droplets,
  Award,
  Sparkles,
  ArrowRight,
  MapPin,
  Users
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (view: ViewMode) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-0 min-h-screen bg-[#F9F7F2]">
      {/* 🌾 SECTION 1: HERO & BIBLICAL INSPIRATION */}
      <section className="bg-gradient-to-r from-[#2D4F2D] via-[#1E3A1E] to-[#14281A] text-white py-16 px-6 md:px-12 border-b border-[#1E3A1E]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-[#F5E6AB] text-xs font-bold uppercase tracking-widest border border-[#D4AF37]/30">
            Faith-Rooted Agricultural Legacy
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#FAF8F5]">
            The EBINESAR HARVEST Story
          </h1>
          <p className="text-sm sm:text-base text-[#D4E9D4] max-w-2xl mx-auto leading-relaxed italic font-serif">
            "Then Samuel took a stone and set it up between Mizpah and Shen. He named it Ebenezer, saying, 'Thus far the Lord has helped us.'" — 1 Samuel 7:12
          </p>
        </div>
      </section>

      {/* 🛡️ SECTION 2: THE THREE SACRED AGRICULTURAL PILLARS */}
      <section className="px-6 md:px-12 py-16 bg-white border-b border-[#E2DCC8]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
              Uncompromising Foundations
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#1A2F1A]">
              Our Three Sacred Pillars
            </h2>
            <p className="text-xs text-[#6B7C6B]">
              Every seed planted, honey harvested, and oil churned is guided by timeless stewardship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#E2DCC8] shadow-xs space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E9F0E9] flex items-center justify-center text-[#2D4F2D]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#1A2F1A]">
                1. Zero Chemical Adulteration
              </h3>
              <p className="text-xs sm:text-sm text-[#4A5D4A] leading-relaxed">
                We reject all synthetic pesticides, glyphosate, chemical growth hormones, and artificial ripening agents. Our soil is nourished strictly with vermicompost, Jeevamrutham, and beneficial green leaf manure.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#E2DCC8] shadow-xs space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF0D7] flex items-center justify-center text-[#D4AF37]">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#1A2F1A]">
                2. Direct Farmer Collective Blessings
              </h3>
              <p className="text-xs sm:text-sm text-[#4A5D4A] leading-relaxed">
                We work directly with over 120 traditional smallholder families across Tamil Nadu and the Western Ghats, guaranteeing fair, upfront prices and ethical stewardship that blesses both grower and consumer.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#E2DCC8] shadow-xs space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E9F0E9] flex items-center justify-center text-[#2D4F2D]">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#1A2F1A]">
                3. Pure Farm-to-Table Cold Transit
              </h3>
              <p className="text-xs sm:text-sm text-[#4A5D4A] leading-relaxed">
                No middleman warehouses. Our harvests are batched in hygienic food-grade containers, packed in shock-proof corrugated boxes, and shipped via express logistics directly to your kitchen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 📜 SECTION 3: ESTATE HERITAGE & HISTORICAL TIMELINE */}
      <section className="px-6 md:px-12 py-16 bg-[#F9F7F2] border-b border-[#E2DCC8]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
              Our Journey of Faith
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#1A2F1A]">
              From a Humble Acre to a Movement
            </h2>
            <p className="text-xs text-[#6B7C6B]">
              Tracing the path of blessings through generations of sustainable cultivation.
            </p>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:left-8 md:before:left-1/2 before:w-0.5 before:bg-[#E2DCC8]">
            {/* Timeline Item 1 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="md:w-5/12 text-left md:text-right space-y-1 pl-16 md:pl-0">
                <span className="text-xs font-bold text-[#D4AF37] uppercase">The Genesis • 2012</span>
                <h4 className="font-serif font-bold text-lg text-[#1A2F1A]">Restoration of Barren Soil</h4>
                <p className="text-xs text-[#4A5D4A]">
                  Acquired 5 acres of neglected soil in the foothills. Spent 3 years planting nitrogen-fixing legumes and restoring earthworm biodiversity naturally.
                </p>
              </div>
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#2D4F2D] text-white flex items-center justify-center text-xs font-bold border-4 border-[#FAF8F5] shadow-xs">
                🌾
              </div>
              <div className="md:w-5/12 hidden md:block" />
            </div>

            {/* Timeline Item 2 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="md:w-5/12 hidden md:block" />
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#D4AF37] text-white flex items-center justify-center text-xs font-bold border-4 border-[#FAF8F5] shadow-xs">
                🫒
              </div>
              <div className="md:w-5/12 text-left space-y-1 pl-16 md:pl-0">
                <span className="text-xs font-bold text-[#D4AF37] uppercase">Revival of Ancient Ghani • 2016</span>
                <h4 className="font-serif font-bold text-lg text-[#1A2F1A]">Traditional Vagai Wood Pestles</h4>
                <p className="text-xs text-[#4A5D4A]">
                  Commissioned artisanal woodworkers to craft slow-speed Ghani presses to preserve antioxidants without friction heat.
                </p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="md:w-5/12 text-left md:text-right space-y-1 pl-16 md:pl-0">
                <span className="text-xs font-bold text-[#D4AF37] uppercase">Tribal Collective Partnership • 2020</span>
                <h4 className="font-serif font-bold text-lg text-[#1A2F1A]">Western Ghats Honey Alliance</h4>
                <p className="text-xs text-[#4A5D4A]">
                  Partnered with indigenous forest honey collectors, establishing cruelty-free non-destructive comb harvesting standards.
                </p>
              </div>
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#2D4F2D] text-white flex items-center justify-center text-xs font-bold border-4 border-[#FAF8F5] shadow-xs">
                🍯
              </div>
              <div className="md:w-5/12 hidden md:block" />
            </div>

            {/* Timeline Item 4 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="md:w-5/12 hidden md:block" />
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#D4AF37] text-white flex items-center justify-center text-xs font-bold border-4 border-[#FAF8F5] shadow-xs">
                ✨
              </div>
              <div className="md:w-5/12 text-left space-y-1 pl-16 md:pl-0">
                <span className="text-xs font-bold text-[#D4AF37] uppercase">Nationwide Digital Delivery • Present</span>
                <h4 className="font-serif font-bold text-lg text-[#1A2F1A]">EBINESAR HARVEST Platform</h4>
                <p className="text-xs text-[#4A5D4A]">
                  Delivering direct to thousands of health-conscious families with automated email tracking, AI agronomist support, and secure digital checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌿 SECTION 4: SOIL STEWARDSHIP & ZERO-CHEMICAL PROTOCOLS */}
      <section className="px-6 md:px-12 py-16 bg-white border-b border-[#E2DCC8]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
              Microbial Soil Health
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#1A2F1A]">
              We Feed the Soil, Not Just the Plant
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5D4A] leading-relaxed">
              Industrial agriculture strips the land of its natural microbiome. At Ebinesar Harvest, we follow Vedic and regenerative principles to ensure our soil remains teeming with beneficial fungi, earthworms, and trace minerals.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 bg-[#FAF8F5] rounded-2xl border border-[#E2DCC8]">
                <Sun className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-[#1A2F1A]">Sunlight Solarization</h4>
                  <p className="text-[11px] text-[#6B7C6B]">Natural pathogen control using summer sun without toxic chemical fumigation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#FAF8F5] rounded-2xl border border-[#E2DCC8]">
                <Droplets className="w-5 h-5 text-[#2D4F2D] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-[#1A2F1A]">Living Jeevamrutham Inoculation</h4>
                  <p className="text-[11px] text-[#6B7C6B]">Fermented microbial tea applied weekly to boost nitrogen fixation naturally.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#FAF8F5] rounded-2xl border border-[#E2DCC8]">
                <Leaf className="w-5 h-5 text-[#2D4F2D] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-[#1A2F1A]">Heirloom Seed Preservation</h4>
                  <p className="text-[11px] text-[#6B7C6B]">Saving open-pollinated seed varieties that have adapted to our soil for centuries.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-[#E2DCC8] shadow-lg relative h-96">
            <img
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1000"
              alt="Regenerative Soil Agriculture"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A2F1A]/85 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs font-bold text-[#F5E6AB] uppercase tracking-wider">
                100% Traceable Farming
              </span>
              <h3 className="font-serif text-lg font-bold">
                From Our Hands to Your Table
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* 🤝 SECTION 5: CALL TO ACTION */}
      <section className="px-6 md:px-12 py-14 bg-[#2D4F2D] text-white text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="font-serif text-3xl font-bold">
            Taste the Blessing of Pure Harvest
          </h2>
          <p className="text-xs text-[#D4E9D4]">
            Experience cold-pressed oils, wild honey, and ancient grains crafted with prayer, care, and organic integrity.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('shop')}
              className="px-8 py-3 bg-[#D4AF37] text-[#1A2F1A] rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#c49f27] transition-colors cursor-pointer shadow-md"
            >
              Shop All Products
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-7 py-3 border border-white/40 text-white rounded-full text-xs font-bold hover:bg-white/10 transition-colors cursor-pointer"
            >
              Contact Harvest Office
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
