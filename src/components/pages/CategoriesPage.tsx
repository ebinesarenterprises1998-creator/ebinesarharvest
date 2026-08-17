import React from 'react';
import { ViewMode, Product } from '../../types';
import {
  Wheat,
  Droplets,
  Flame,
  Coffee,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Leaf,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface CategoriesPageProps {
  products: Product[];
  onSelectCategory: (category: string) => void;
  onNavigate: (view: ViewMode) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  products,
  onSelectCategory,
  onNavigate
}) => {
  const categoryData = [
    {
      title: 'Grains & Cereals',
      subtitle: 'Ancient & Heirloom Wholesome Grains',
      desc: 'Naturally low-glycemic Khapli (Emmer) wheat, hand-harvested Mappillai Samba black & red rice varieties, and stone-ground finger millets enriched with natural dietary fibers.',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800',
      icon: '🌾',
      sowingTime: 'Kharif & Rabi (June / October)',
      harvestTime: 'November / March',
      benefits: ['Zero synthetic hybridization', 'Rich in natural zinc & magnesium', 'Easily digestible ancient gluten structure'],
      popularProducts: ['Ebenezer Heritage Emmer Wheat Berries', 'Organic Traditional Red Rice (Mappillai Samba)']
    },
    {
      title: 'Natural Sweeteners',
      subtitle: 'Wild Forest Honeys & Palm Nectars',
      desc: 'Raw wildflower forest honey harvested sustainably by tribal beekeeping cooperatives in the Western Ghats, accompanied by mineral-rich unrefined organic palm jaggery blocks.',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800',
      icon: '🍯',
      sowingTime: 'Year-Round Wild Blossom Foraging',
      harvestTime: 'Spring Post-Monsoon (April / September)',
      benefits: ['Unpasteurized & enzyme active', 'Zero corn syrup or sugar adulteration', 'Rich in natural pollen & propolis'],
      popularProducts: ['Western Ghats Raw Wildflower Honey', 'Organic Unrefined Palm Jaggery (Karupatti)']
    },
    {
      title: 'Gourmet Oils',
      subtitle: 'Wood-Churned Cold-Pressed Virgin Oils',
      desc: 'Crushed in traditional Vagai wood Ghani pestles at temperatures strictly below 40°C. Pure virgin sesame (gingelly), cold pressed coconut, and organic mustard oils with authentic aroma.',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800',
      icon: '🫒',
      sowingTime: 'Summer & Monsoon',
      harvestTime: 'Post-Harvest Slow Extraction',
      benefits: ['Zero chemical hexane solvents', 'Cold-pressed below 40°C', 'High concentration of natural plant sterols'],
      popularProducts: ['Wood-Churned Virgin Sesame Oil', 'Cold-Pressed Extra Virgin Coconut Oil']
    },
    {
      title: 'Spices & Condiments',
      subtitle: 'High-Altitude Whole & Ground Spices',
      desc: 'Sun-dried Alleppey green cardamom, high-piperine Nilgiris black peppercorns, and mineral-packed Himalayan rock salt crystals from pristine geological veins.',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800',
      icon: '🌶️',
      sowingTime: 'Monsoon Plantation',
      harvestTime: 'Winter Hand Picking (December – February)',
      benefits: ['Sun-dried for volatile essential oil preservation', 'Single-estate origin traceability', 'Unbleached & free of artificial colors'],
      popularProducts: ['Artisanal Himalayan Pink Salt', 'Single-Estate Nilgiris Black Peppercorns']
    },
    {
      title: 'Herbal Teas',
      subtitle: 'High Mist Hill Station Infusions',
      desc: 'Single-estate orthodox whole-leaf black teas from Nilgiris 6,500ft altitudes, complemented by holy basil (Tulsi), moringa leaf, and immunity-restoring herbal tisanes.',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800',
      icon: '🍵',
      sowingTime: 'Perennial Mountain Slopes',
      harvestTime: 'First & Second Flush Plucking',
      benefits: ['Hand-plucked two leaves and a bud', 'High in natural polyphenols and theaflavins', 'Whole-leaf grade with zero dust residue'],
      popularProducts: ['Nilgiris High Mist Orthodox Black Tea', 'Organic Holy Basil & Moringa Tisane']
    }
  ];

  return (
    <div className="space-y-0">
      {/* 🌿 SECTION 1: CATEGORIES HERO & SCRIPTURE HEADER */}
      <section className="bg-gradient-to-r from-[#2D4F2D] via-[#1E3A1E] to-[#14281A] text-white py-14 px-6 md:px-12 border-b border-[#1E3A1E]">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-[#F5E6AB] text-xs font-bold uppercase tracking-widest border border-[#D4AF37]/30">
            Curated Harvest Collections
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#FAF8F5]">
            Sacred Categories of Nature
          </h1>
          <p className="text-xs sm:text-sm text-[#D4E9D4] max-w-2xl mx-auto leading-relaxed">
            "And God said, 'Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind.' And God saw that it was good." — Genesis 1:11-12
          </p>
        </div>
      </section>

      {/* 🌾 SECTION 2: COMPREHENSIVE CATEGORY SHOWCASE CARDS */}
      <section className="px-6 md:px-12 py-14 bg-white border-b border-[#E2DCC8]">
        <div className="max-w-7xl mx-auto space-y-12">
          {categoryData.map((cat, idx) => (
            <div
              key={cat.title}
              className={`rounded-3xl border border-[#E2DCC8] bg-[#FAF8F5] overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 md:p-8 ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image side */}
              <div className={`lg:col-span-5 h-72 rounded-2xl overflow-hidden relative border border-[#E2DCC8] ${
                idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'
              }`}>
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#1A2F1A]/85 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span>{cat.icon}</span>
                  <span>{cat.title}</span>
                </div>
              </div>

              {/* Text side */}
              <div className={`lg:col-span-7 space-y-4 ${
                idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'
              }`}>
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                    {cat.subtitle}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F1A]">
                    {cat.title}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-[#4A5D4A] leading-relaxed">
                  {cat.desc}
                </p>

                {/* Key Benefits Pills */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#2D4F2D]">
                    Key Organic Purity Attributes:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cat.benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#4A5D4A]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2D4F2D] shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Button to browse */}
                <div className="pt-3 flex items-center gap-4">
                  <button
                    onClick={() => {
                      onSelectCategory(cat.title);
                      onNavigate('shop');
                    }}
                    className="px-6 py-2.5 bg-[#2D4F2D] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#1E3A1E] transition-all shadow-xs cursor-pointer flex items-center gap-2"
                  >
                    <span>Browse {cat.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs text-[#6B7C6B] italic">
                    Harvested: {cat.harvestTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 📅 SECTION 3: AGRICULTURAL HARVEST & SOWING CALENDAR */}
      <section className="px-6 md:px-12 py-16 bg-[#F9F7F2] border-b border-[#E2DCC8]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
              Seasonal Rhythm
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#1A2F1A]">
              The Sacred Harvest Calendar
            </h2>
            <p className="text-xs text-[#6B7C6B]">
              Every seed is sown and reaped according to God's natural seasons and monsoon cycles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-[#E2DCC8] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#2D4F2D] font-bold text-sm font-serif">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>Monsoon Sowing (Kharif)</span>
              </div>
              <p className="text-xs text-[#4A5D4A] leading-relaxed">
                Ancient grains (Khapli Wheat, Mappillai Samba) and sesame fields are prepared with organic compost, green manure, and beneficial soil microbes.
              </p>
              <div className="text-[11px] text-[#6B7C6B] font-semibold">
                Months: June – August
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-[#E2DCC8] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#2D4F2D] font-bold text-sm font-serif">
                <Leaf className="w-4 h-4 text-[#D4AF37]" />
                <span>Winter Maturation & Flush</span>
              </div>
              <p className="text-xs text-[#4A5D4A] leading-relaxed">
                Nilgiris high mist hills experience crisp dew mornings, concentrating aromas in tea flushes while mountain bees forage eucalyptus and flora.
              </p>
              <div className="text-[11px] text-[#6B7C6B] font-semibold">
                Months: September – December
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-[#E2DCC8] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#2D4F2D] font-bold text-sm font-serif">
                <Wheat className="w-4 h-4 text-[#D4AF37]" />
                <span>Spring Golden Harvest</span>
              </div>
              <p className="text-xs text-[#4A5D4A] leading-relaxed">
                Grains are hand-threshed, sundried on stone drying yards, cold-pressed in Vagai wood Ghani, and packaged fresh for patron shipment.
              </p>
              <div className="text-[11px] text-[#6B7C6B] font-semibold">
                Months: January – April
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌿 SECTION 4: CALL TO ACTION */}
      <section className="px-6 md:px-12 py-12 bg-[#2D4F2D] text-white text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="font-serif text-2xl md:text-3xl font-bold">
            Ready to Taste the Difference of Authentic Organic Harvest?
          </h3>
          <p className="text-xs text-[#D4E9D4]">
            Browse all products with zero synthetic adulteration delivered directly to your doorstep.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-8 py-3 bg-[#D4AF37] text-[#1A2F1A] rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#c49f27] transition-colors cursor-pointer shadow-md"
          >
            Explore Complete Harvest Catalog
          </button>
        </div>
      </section>
    </div>
  );
};
