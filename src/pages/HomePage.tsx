import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Sprout,
  Sun,
  Lock,
  Award,
  Users,
  Compass,
  ShoppingBag,
  CookingPot,
  Leaf,
  Home,
  Flower2,
  HeartPulse,
  Dog,
  Gift,
} from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';
import { AgriHeroBackground } from '../components/home/AgriHeroBackground';
import { categoryService } from '../services/supabase/supabaseClient';
import { Category } from '../types';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Sprout: <Sprout className="w-6 h-6 text-[#0B3D2E]" />,
  CookingPot: <CookingPot className="w-6 h-6 text-[#0B3D2E]" />,
  Leaf: <Leaf className="w-6 h-6 text-[#0B3D2E]" />,
  Home: <Home className="w-6 h-6 text-[#0B3D2E]" />,
  Flower2: <Flower2 className="w-6 h-6 text-[#0B3D2E]" />,
  HeartPulse: <HeartPulse className="w-6 h-6 text-[#0B3D2E]" />,
  Dog: <Dog className="w-6 h-6 text-[#0B3D2E]" />,
  Gift: <Gift className="w-6 h-6 text-[#0B3D2E]" />,
};

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoryService.getCategories().then(setCategories);
  }, []);

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ========================================================================= */}
      {/* 1. AGRICULTURAL HERO SECTION                                              */}
      {/* ========================================================================= */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-6 pb-16 bg-[#F8F4EA]">
        {/* Agricultural Landscape Background */}
        <AgriHeroBackground />

        {/* Content Container Overlay */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Official Brand Logo Display */}
          <div className="mb-4 animate-in fade-in zoom-in duration-700">
            <BrandLogo size="hero" showTagline={false} />
          </div>

          {/* Artistic Sub-badge */}
          <span className="text-[#C99A2E] text-xs sm:text-sm uppercase tracking-[0.4em] font-bold mb-3 block">
            Ebinesar Harvest • Est. 2024
          </span>

          {/* Primary Headline */}
          <h1 className="serif font-medium text-4xl sm:text-6xl lg:text-7xl text-[#0B3D2E] tracking-tight leading-[1.1] max-w-4xl drop-shadow-sm">
            FROM HIS GRACE,<br />
            <span className="gold-gradient-text font-bold">WE GROW</span>
          </h1>

          {/* Subheading */}
          <p className="mt-5 text-base sm:text-lg text-[#0B3D2E]/75 max-w-2xl font-serif-sub italic font-medium leading-relaxed">
            Discover quality products brought together with faith, care and purpose.
            Premium agricultural goods from our harvest to your home.
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto px-8 py-4 bg-[#C99A2E] hover:bg-white text-[#0B3D2E] font-bold uppercase tracking-widest text-xs rounded-sm shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 border border-[#C99A2E] group"
            >
              <ShoppingBag className="w-4 h-4 text-[#0B3D2E]" />
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4 text-[#0B3D2E] transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => onNavigate('categories')}
              className="w-full sm:w-auto px-8 py-4 bg-white/90 hover:bg-[#0B3D2E] text-[#0B3D2E] hover:text-[#FFDF78] font-bold uppercase tracking-widest text-xs rounded-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 border border-[#0B3D2E]/20 backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#C99A2E]" />
              <span>EXPLORE HARVEST</span>
            </button>
          </div>

          {/* Artistic Aesthetic Tag */}
          <div className="mt-8 flex items-center gap-3 opacity-60">
            <div className="w-8 h-[1px] bg-[#0B3D2E]"></div>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[#0B3D2E]">Faith Driven • Pure Harvest</span>
            <div className="w-8 h-[1px] bg-[#0B3D2E]"></div>
          </div>

          {/* Highlights Ribbon */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl pt-6 border-t border-[#0B3D2E]/10">
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-[#0B3D2E]/10">
              <Sprout className="w-5 h-5 text-[#0B3D2E] mb-1" />
              <span className="font-bold text-xs uppercase tracking-wider text-[#0B3D2E]">100% Pure Harvest</span>
              <span className="text-[11px] text-[#0B3D2E]/60">Unadulterated care</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-[#0B3D2E]/10">
              <Sun className="w-5 h-5 text-[#C99A2E] mb-1" />
              <span className="font-bold text-xs uppercase tracking-wider text-[#0B3D2E]">Faithful Sourcing</span>
              <span className="text-[11px] text-[#0B3D2E]/60">Grace & purpose</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-[#0B3D2E]/10">
              <Truck className="w-5 h-5 text-[#0B3D2E] mb-1" />
              <span className="font-bold text-xs uppercase tracking-wider text-[#0B3D2E]">Farm-Direct Delivery</span>
              <span className="text-[11px] text-[#0B3D2E]/60">Swift & secure</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-[#0B3D2E]/10">
              <Lock className="w-5 h-5 text-[#C99A2E] mb-1" />
              <span className="font-bold text-xs uppercase tracking-wider text-[#0B3D2E]">Razorpay Secure</span>
              <span className="text-[11px] text-[#0B3D2E]/60">Encrypted payments</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FEATURED CATEGORIES SECTION                                            */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C99A2E] bg-[#C99A2E]/10 px-3.5 py-1.5 rounded-full border border-[#C99A2E]/30 inline-block mb-2">
            HARVEST COLLECTIONS
          </span>
          <h2 className="serif text-3xl sm:text-4xl text-[#0B3D2E]">
            Featured Categories
          </h2>
          <p className="text-[#0B3D2E]/75 text-sm sm:text-base mt-2 font-serif-sub italic">
            Each category represents our commitment to honest agriculture, handcrafted excellence, and sustainable living.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', { category: cat.id })}
              className="group relative bg-white rounded-lg p-6 border border-[#0B3D2E]/10 shadow-sm hover:shadow-xl hover:border-[#C99A2E] transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-sm bg-[#F8F4EA] group-hover:bg-[#0B3D2E] border border-[#0B3D2E]/10 flex items-center justify-center transition-colors mb-4 text-[#0B3D2E] group-hover:text-[#FFDF78]">
                  {iconMap[cat.icon || 'Sprout'] || <Sprout className="w-6 h-6" />}
                </div>
                <h3 className="serif font-bold text-lg text-[#0B3D2E] group-hover:text-[#C99A2E] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#0B3D2E]/70 leading-relaxed mt-2 line-clamp-3">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                  {cat.product_count === 0 ? 'Curating' : `${cat.product_count} products`}
                </span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#0B3D2E] group-hover:text-[#C99A2E] flex items-center gap-1">
                  Explore <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHY EBINESAR HARVEST                                                   */}
      {/* ========================================================================= */}
      <section className="bg-[#0B3D2E] text-white py-20 relative overflow-hidden rounded-lg max-w-7xl mx-auto px-6 sm:px-12 border border-[#C99A2E]/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C99A2E] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
              OUR FOUNDATION
            </span>
            <h2 className="serif text-3xl sm:text-5xl leading-tight">
              Why Choose <br />
              <span className="gold-gradient-text font-bold">Ebinesar Harvest?</span>
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-serif-sub italic">
              Ebinesar—meaning <em>&ldquo;Thus far the Lord has helped us&rdquo;</em>—is founded on the belief that
              the soil, crops, and fruits of the earth are gifts to be nurtured with righteousness, prayer, and honest stewardship.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-sm bg-[#C99A2E] text-[#0B3D2E] flex items-center justify-center shrink-0 font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider text-[#FFDF78]">Faith-Rooted Integrity</h4>
                  <p className="text-xs text-white/75 mt-0.5">Every product is sourced transparently without deceptive pricing or synthetic tampering.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-sm bg-[#C99A2E] text-[#0B3D2E] flex items-center justify-center shrink-0 font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider text-[#FFDF78]">Direct Farmer Stewardship</h4>
                  <p className="text-xs text-white/75 mt-0.5">Empowering rural agriculture and artisanal craftspeople with fair honorariums and dignity.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-sm bg-[#C99A2E] text-[#0B3D2E] flex items-center justify-center shrink-0 font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider text-[#FFDF78]">Wholesome & Pure Quality</h4>
                  <p className="text-xs text-white/75 mt-0.5">Prioritizing natural methods, chemical-free processing, and nutrient-dense farm goodness.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-[#C99A2E]/40 space-y-6">
              <div className="text-center pb-4 border-b border-white/10">
                <BrandLogo size="lg" lightText={true} showTagline={true} />
              </div>
              <blockquote className="font-serif-sub text-lg sm:text-xl italic text-center text-[#FFDF78] leading-relaxed">
                &ldquo;He gives food to every creature. His love endures forever. From His abundant grace, our harvest flows to your table.&rdquo;
              </blockquote>
              <div className="grid grid-cols-2 gap-4 text-center pt-2">
                <div className="p-4 rounded-sm bg-black/20 border border-white/10">
                  <span className="serif font-bold text-2xl text-[#FFDF78]">100%</span>
                  <p className="text-[10px] text-gray-300 uppercase tracking-widest mt-1">Ethical Standard</p>
                </div>
                <div className="p-4 rounded-sm bg-black/20 border border-white/10">
                  <span className="serif font-bold text-2xl text-[#FFDF78]">Zero</span>
                  <p className="text-[10px] text-gray-300 uppercase tracking-widest mt-1">Hidden Additives</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FARM-TO-HOME CONCEPT & QUALITY & TRUST                                 */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#0B3D2E] bg-[#0B3D2E]/10 px-3.5 py-1.5 rounded-full inline-block mb-2">
            OUR HARVEST JOURNEY
          </span>
          <h2 className="serif text-3xl sm:text-4xl text-[#0B3D2E]">
            The Farm-to-Home Promise
          </h2>
          <p className="text-[#0B3D2E]/75 text-sm sm:text-base mt-2 font-serif-sub italic">
            A seamless journey rooted in respect for creation and delivered fresh to your door.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-8 border border-[#0B3D2E]/10 shadow-sm relative space-y-4">
            <div className="w-10 h-10 rounded-sm bg-[#0B3D2E] text-[#FFDF78] font-bold text-sm flex items-center justify-center">
              01
            </div>
            <h3 className="serif font-bold text-xl text-[#0B3D2E]">Faithful Sowing</h3>
            <p className="text-xs sm:text-sm text-[#0B3D2E]/70 leading-relaxed">
              Seeds sown in fertile soil, cultivated using regenerative practices and non-toxic methods that protect biodiversity and the ecosystem.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 border border-[#0B3D2E]/10 shadow-sm relative space-y-4">
            <div className="w-10 h-10 rounded-sm bg-[#C99A2E] text-[#0B3D2E] font-bold text-sm flex items-center justify-center">
              02
            </div>
            <h3 className="serif font-bold text-xl text-[#0B3D2E]">Careful Harvest</h3>
            <p className="text-xs sm:text-sm text-[#0B3D2E]/70 leading-relaxed">
              Harvested at peak maturity by experienced agricultural stewards and artisan crafters, preserving natural flavor, aroma, and vitality.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 border border-[#0B3D2E]/10 shadow-sm relative space-y-4">
            <div className="w-10 h-10 rounded-sm bg-[#0B3D2E] text-[#FFDF78] font-bold text-sm flex items-center justify-center">
              03
            </div>
            <h3 className="serif font-bold text-xl text-[#0B3D2E]">Direct Blessing</h3>
            <p className="text-xs sm:text-sm text-[#0B3D2E]/70 leading-relaxed">
              Packed in eco-conscious containers and dispatched swiftly to your doorstep, bringing authentic farm freshness to your home.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CUSTOMER BENEFITS & TRUST BADGES                                       */}
      {/* ========================================================================= */}
      <section className="bg-white py-16 border-y border-[#0B3D2E]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-sm bg-[#F8F4EA] text-[#0B3D2E] shrink-0 border border-[#C99A2E]/30">
                <ShieldCheck className="w-5 h-5 text-[#C99A2E]" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0B3D2E]">100% Secure Checkout</h4>
                <p className="text-xs text-gray-500 mt-1">Encrypted payments powered by verified Razorpay gateway.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-sm bg-[#F8F4EA] text-[#0B3D2E] shrink-0 border border-[#C99A2E]/30">
                <Truck className="w-5 h-5 text-[#0B3D2E]" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0B3D2E]">Prompt Farm Dispatch</h4>
                <p className="text-xs text-gray-500 mt-1">Freshly packed with careful tracking updates from our hub.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-sm bg-[#F8F4EA] text-[#0B3D2E] shrink-0 border border-[#C99A2E]/30">
                <Award className="w-5 h-5 text-[#C99A2E]" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0B3D2E]">Honest Stewardship</h4>
                <p className="text-xs text-gray-500 mt-1">Guaranteed purity with no synthetic tricks or artificial dyes.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-sm bg-[#F8F4EA] text-[#0B3D2E] shrink-0 border border-[#C99A2E]/30">
                <Users className="w-5 h-5 text-[#0B3D2E]" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0B3D2E]">Community Centric</h4>
                <p className="text-xs text-gray-500 mt-1">Supporting local agriculture and Christian community values.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION SECTION                                                 */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="gradient-hero text-white rounded-lg p-10 sm:p-16 border border-[#C99A2E]/40 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C99A2E]/20 via-transparent to-transparent pointer-events-none" />

          <BrandLogo size="md" lightText={true} showTagline={false} />

          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#C99A2E] block">
            Ebinesar Harvest
          </span>

          <h2 className="serif text-3xl sm:text-5xl text-[#F8F4EA]">
            Ready to Taste the Difference?
          </h2>

          <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto font-serif-sub italic">
            Join hands with our community of thoughtful growers and embrace wholesome goods created with integrity and prayer.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('shop')}
              className="px-8 py-3.5 bg-[#C99A2E] hover:bg-white text-[#0B3D2E] font-bold text-xs uppercase tracking-widest rounded-sm shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              BROWSE HARVEST STORE
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-3.5 bg-transparent hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-sm border border-white/30"
            >
              TALK TO STEWARDS
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
