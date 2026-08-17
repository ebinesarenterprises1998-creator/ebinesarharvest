import React, { useState } from 'react';
import { Product, ViewMode } from '../../types';
import { ProductCard } from '../ProductCard';
import {
  ShieldCheck,
  Wheat,
  Leaf,
  RotateCcw,
  Sparkles,
  Search,
  X,
  ArrowRight,
  Heart,
  Star,
  CheckCircle2,
  Truck,
  Droplets,
  Award,
  Sun
} from 'lucide-react';

interface HomePageProps {
  products: Product[];
  loading: boolean;
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: ViewMode) => void;
  onSelectCategory: (category: string) => void;
  onToast: (msg: string) => void;
  onOpenAdvisor: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  loading,
  onSelectProduct,
  onNavigate,
  onSelectCategory,
  onToast,
  onOpenAdvisor
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [emailSub, setEmailSub] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  const categories = [
    'All',
    'Grains & Cereals',
    'Natural Sweeteners',
    'Gourmet Oils',
    'Spices & Condiments',
    'Herbal Teas',
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCat === 'All' || p.category === selectedCat;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0);
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub || !emailSub.includes('@')) {
      onToast('Please enter a valid email address.');
      return;
    }
    setSubSuccess(true);
    onToast('Blessings! You have subscribed to seasonal harvest bulletins.');
    setEmailSub('');
  };

  return (
    <div className="space-y-0">
      {/* 🌾 SECTION 1: HERO SPOTLIGHT & FAITH BANNER */}
      <section className="relative min-h-[500px] md:min-h-[540px] flex items-center px-6 md:px-16 overflow-hidden py-14 md:py-16 bg-gradient-to-br from-[#E9F0E9] via-[#F9F7F2] to-[#FFFBF0] border-b border-[#E2DCC8]">
        {/* Ambient Glows */}
        <div className="absolute right-[-120px] top-[-120px] w-[540px] h-[540px] rounded-full bg-[#D4E9D4]/50 blur-3xl pointer-events-none" />
        <div className="absolute left-[-100px] bottom-[-100px] w-[400px] h-[400px] rounded-full bg-[#F7E7A9]/30 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#D4AF37]/40 shadow-xs backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[#2D4F2D] font-bold tracking-wider uppercase text-[11px]">
                100% Certified Organic • Faith-Rooted Stewardship
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#1A2F1A] leading-[1.15] tracking-tight">
              Rooted in Faith.<br />
              <span className="text-[#2D4F2D]">Grown with Care.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#4A5D4A] max-w-xl leading-relaxed">
              Experience the untainted bounty of our sacred soils. Unadulterated heirloom grains, wood-churned cold pressed oils, and raw forest honeys delivered fresh from sustainable farm collectives.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('shop')}
                className="px-8 py-3.5 bg-[#2D4F2D] text-white font-semibold rounded-full shadow-lg shadow-[#2D4F2D]/20 hover:bg-[#1E3A1E] transition-all transform hover:scale-[1.02] cursor-pointer flex items-center gap-2 text-sm"
              >
                Explore Harvest Shop
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('seasons-harvest-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-3.5 border-2 border-[#2D4F2D] text-[#2D4F2D] font-semibold rounded-full hover:bg-[#2D4F2D] hover:text-white transition-all cursor-pointer text-sm"
              >
                Seasonal Highlights
              </button>
              <button
                onClick={onOpenAdvisor}
                className="inline-flex items-center gap-2 px-4 py-3.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-bold hover:bg-amber-100 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                Ask AI Agronomist
              </button>
            </div>

            {/* Quick Metrics Strip */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#E2DCC8]/80 max-w-lg">
              <div>
                <div className="font-serif font-bold text-2xl text-[#1A2F1A]">100%</div>
                <div className="text-[11px] text-[#6B7C6B] font-medium">Chemical Free</div>
              </div>
              <div>
                <div className="font-serif font-bold text-2xl text-[#2D4F2D]">₹0</div>
                <div className="text-[11px] text-[#6B7C6B] font-medium">Delivery &gt; ₹999</div>
              </div>
              <div>
                <div className="font-serif font-bold text-2xl text-[#D4AF37]">4.9★</div>
                <div className="text-[11px] text-[#6B7C6B] font-medium">Patron Blessing</div>
              </div>
            </div>
          </div>

          {/* Right Floating Visual Card Column */}
          <div className="lg:col-span-5 hidden lg:flex justify-center">
            <div className="w-[380px] bg-white/60 backdrop-blur-xl border border-white/60 rounded-[36px] shadow-2xl p-6 relative overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
              <div className="relative h-64 rounded-2xl overflow-hidden mb-5 border border-[#E2DCC8]">
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800"
                  alt="Ebinesar Organic Harvest Fields"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A2F1A]/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#F5E6AB]">
                    Direct Origin
                  </span>
                  <h4 className="font-serif text-base font-bold">
                    Nilgiris & Cauvery Basin Estates
                  </h4>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1A2F1A]">Ancient Vedic Method</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#D4E9D4] text-[#1E3A1E] text-[10px] font-bold uppercase">
                    Wood Churned
                  </span>
                </div>
                <p className="text-xs text-[#4A5D4A] leading-relaxed">
                  "You crown the year with your bounty, and your carts overflow with abundance."
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-[#6B7C6B] border-t border-[#E2DCC8]">
                  <span className="font-serif italic font-medium">Psalm 65:11</span>
                  <span className="font-bold text-[#2D4F2D]">EBINESAR HARVEST</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🛡️ SECTION 2: FOUR SACRED QUALITY PILLARS */}
      <section className="px-6 md:px-12 py-10 bg-[#FDFCF9] border-b border-[#E2DCC8]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-[#E2DCC8] shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#E9F0E9] flex items-center justify-center text-[#2D4F2D]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#1A2F1A]">100% Pure Organic</h4>
              <p className="text-xs text-[#6B7C6B]">Chemical-free, zero pesticide residues</p>
            </div>

            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-[#E2DCC8] shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#FAF0D7] flex items-center justify-center text-[#D4AF37]">
                <Wheat className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#1A2F1A]">Traditional Wood-Churned</h4>
              <p className="text-xs text-[#6B7C6B]">Cold-pressed for full nutrition retention</p>
            </div>

            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-[#E2DCC8] shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#E9F0E9] flex items-center justify-center text-[#2D4F2D]">
                <Leaf className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#1A2F1A]">Ethical Fair Trade</h4>
              <p className="text-xs text-[#6B7C6B]">Direct farmer collective prosperity</p>
            </div>

            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-[#E2DCC8] shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#FAF0D7] flex items-center justify-center text-[#D4AF37]">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#1A2F1A]">Freshness Guaranteed</h4>
              <p className="text-xs text-[#6B7C6B]">Batched & dispatched in cold-chain safe boxes</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🌾 SECTION 3: SEASON'S BEST HARVEST (FEATURED CATALOG) */}
      <section id="seasons-harvest-section" className="px-6 md:px-12 py-14 bg-white border-b border-[#E2DCC8]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
                Fresh Harvest Spotlight
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1A2F1A]">
                Season's Best Harvest
              </h2>
              <p className="text-[#6B7C6B] text-sm">
                Curated pure grains, cold-pressed oils, and forest honeys hand-selected for your family.
              </p>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="text-[#2D4F2D] hover:text-[#1E3A1E] font-bold text-sm flex items-center gap-1.5 self-start md:self-auto cursor-pointer group"
            >
              <span>View Entire Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Filter Tabs & Search Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E2DCC8]">
            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCat === cat
                      ? 'bg-[#2D4F2D] text-white shadow-xs'
                      : 'bg-white text-[#4A5D4A] hover:bg-stone-100 border border-[#E2DCC8]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search & Sort Dropdown */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-4 h-4 text-[#8B9A8B] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search honey, wheat, oil..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#E2DCC8] rounded-xl text-xs focus:outline-[#2D4F2D]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-[#8B9A8B] hover:text-[#1A2F1A]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 bg-white border border-[#E2DCC8] rounded-xl text-xs text-[#1A2F1A] focus:outline-[#2D4F2D] cursor-pointer"
              >
                <option value="featured">Featured Harvest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-[#FDFCF9] border border-[#F0EBE0] rounded-2xl p-4 animate-pulse space-y-3">
                  <div className="h-44 bg-stone-200 rounded-xl" />
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-200 rounded w-1/2" />
                  <div className="h-6 bg-stone-200 rounded w-1/3 pt-2" />
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-[#FAF8F5] rounded-3xl border border-[#E2DCC8]">
              <Wheat className="w-12 h-12 text-[#8B9A8B] mx-auto opacity-50" />
              <h3 className="font-serif text-lg font-bold text-[#1A2F1A]">No harvest items found</h3>
              <p className="text-xs text-[#6B7C6B]">Try adjusting your search filter or category selection.</p>
              <button
                onClick={() => { setSelectedCat('All'); setSearchQuery(''); }}
                className="px-4 py-2 bg-[#2D4F2D] text-white rounded-full text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onToast={onToast}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 🌄 SECTION 4: SACRED FARM ORIGIN & ECOSYSTEM SPOTLIGHT */}
      <section className="px-6 md:px-12 py-16 bg-[#F9F7F2] border-b border-[#E2DCC8]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
              Origin & Stewardship
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#1A2F1A]">
              Where Your Harvest Is Born
            </h2>
            <p className="text-xs md:text-sm text-[#6B7C6B]">
              From mist-clad Nilgiri hills to mineral-rich Cauvery delta fields, each region is chosen for microclimate perfection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#E2DCC8] shadow-xs group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600"
                  alt="Nilgiris Organic Tea & Honey"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#1A2F1A]/80 backdrop-blur-xs text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                  Highland Altitude: 6,500 FT
                </span>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-serif font-bold text-lg text-[#1A2F1A]">
                  Nilgiris High Mist Estate
                </h3>
                <p className="text-xs text-[#4A5D4A] leading-relaxed">
                  Home to wild bee colonies feeding on eucalyptus blossoms and high-altitude single-estate green teas.
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs text-[#2D4F2D] font-bold">
                  <span>Harvests:</span>
                  <span className="text-[#6B7C6B] font-normal">Raw Forest Honey, Silver Tip Teas</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#E2DCC8] shadow-xs group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=600"
                  alt="Cauvery River Ancient Grains"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#1A2F1A]/80 backdrop-blur-xs text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                  Alluvial Delta Soils
                </span>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-serif font-bold text-lg text-[#1A2F1A]">
                  Cauvery River Delta Belt
                </h3>
                <p className="text-xs text-[#4A5D4A] leading-relaxed">
                  Naturally irrigated heirloom Emmer wheat (Khapli) and traditional indigenous red & black rice varieties.
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs text-[#2D4F2D] font-bold">
                  <span>Harvests:</span>
                  <span className="text-[#6B7C6B] font-normal">Khapli Wheat, Mappillai Samba Rice</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#E2DCC8] shadow-xs group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600"
                  alt="Traditional Wood Press Mills"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#1A2F1A]/80 backdrop-blur-xs text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                  Vagai Wood Ghani Press
                </span>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-serif font-bold text-lg text-[#1A2F1A]">
                  Dindigul Traditional Mills
                </h3>
                <p className="text-xs text-[#4A5D4A] leading-relaxed">
                  Slow-churned cold press virgin extraction using ancient Vagai wood pestles, retaining 100% vital antioxidants.
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs text-[#2D4F2D] font-bold">
                  <span>Harvests:</span>
                  <span className="text-[#6B7C6B] font-normal">Cold Pressed Sesame & Virgin Coconut Oil</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⭐ SECTION 5: PATRON TESTIMONIALS & COMMUNITY VOICES */}
      <section className="px-6 md:px-12 py-16 bg-white border-b border-[#E2DCC8]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
              Customer Blessings
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#1A2F1A]">
              Loved by Families Across India
            </h2>
            <p className="text-xs text-[#6B7C6B]">
              Real testimonials from patrons enjoying true chemical-free nourishment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#FAF8F5] rounded-3xl border border-[#E2DCC8] space-y-4">
              <div className="flex text-[#D4AF37] gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#4A5D4A] italic leading-relaxed">
                "The wood-churned sesame oil and wild forest honey have transformed our family's meals. You can smell the authentic earthy aroma right when opening the bottle!"
              </p>
              <div className="pt-2 flex items-center gap-3 border-t border-[#E2DCC8]">
                <div className="w-9 h-9 rounded-full bg-[#2D4F2D] text-white flex items-center justify-center font-bold text-xs">
                  GA
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1A2F1A]">Grace Abigail</h4>
                  <p className="text-[11px] text-[#6B7C6B]">Verified Patron • Coimbatore</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#FAF8F5] rounded-3xl border border-[#E2DCC8] space-y-4">
              <div className="flex text-[#D4AF37] gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#4A5D4A] italic leading-relaxed">
                "As a diabetic, the Khapli ancient wheat flour has been a true blessing. Low glycemic, incredibly easy to digest, and the rotis stay soft for hours."
              </p>
              <div className="pt-2 flex items-center gap-3 border-t border-[#E2DCC8]">
                <div className="w-9 h-9 rounded-full bg-[#2D4F2D] text-white flex items-center justify-center font-bold text-xs">
                  DK
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1A2F1A]">Dr. Daniel Kumar</h4>
                  <p className="text-[11px] text-[#6B7C6B]">Verified Patron • Chennai</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#FAF8F5] rounded-3xl border border-[#E2DCC8] space-y-4">
              <div className="flex text-[#D4AF37] gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#4A5D4A] italic leading-relaxed">
                "The email notifications for tracking the order were super smooth, and the package arrived in eco-friendly protective straw cushioning within 2 days."
              </p>
              <div className="pt-2 flex items-center gap-3 border-t border-[#E2DCC8]">
                <div className="w-9 h-9 rounded-full bg-[#2D4F2D] text-white flex items-center justify-center font-bold text-xs">
                  MJ
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1A2F1A]">Mary Joseph</h4>
                  <p className="text-[11px] text-[#6B7C6B]">Verified Patron • Bangalore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 💌 SECTION 6: SEASONAL HARVEST NEWSLETTER & FIRST ORDER BLESSING */}
      <section className="px-6 md:px-12 py-16 bg-[#2D4F2D] text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-[#FAF8F5]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest">
            Patron Welcome Blessing
          </span>

          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#FAF8F5]">
            Receive ₹100 Off Your First Harvest
          </h2>

          <p className="text-xs md:text-sm text-[#D4E9D4] max-w-xl mx-auto leading-relaxed">
            Subscribe to our seasonal harvest bulletins for crop arrival announcements, traditional culinary recipes, and exclusive patron discounts.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              value={emailSub}
              onChange={(e) => setEmailSub(e.target.value)}
              placeholder="Enter your email address..."
              className="w-full sm:flex-1 px-5 py-3 rounded-full bg-white text-[#1A2F1A] text-xs font-medium placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#D4AF37] text-[#1A2F1A] text-xs font-bold uppercase tracking-wider hover:bg-[#c49f27] transition-colors cursor-pointer shadow-md"
            >
              Get Blessing
            </button>
          </form>

          {subSuccess && (
            <p className="text-xs text-[#D4AF37] font-semibold animate-in fade-in">
              ✓ Blessing received! Use code <strong>FIRSTHARVEST</strong> at checkout.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
