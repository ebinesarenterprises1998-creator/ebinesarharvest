import React, { useState, useMemo } from 'react';
import { Product, ViewMode } from '../../types';
import { ProductCard } from '../ProductCard';
import {
  Search,
  SlidersHorizontal,
  Wheat,
  X,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  HelpCircle,
  CheckCircle2,
  Filter,
  ArrowUpDown
} from 'lucide-react';

interface ShopPageProps {
  products: Product[];
  loading: boolean;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: ViewMode) => void;
  onToast: (msg: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  loading,
  selectedCategory,
  setSelectedCategory,
  onSelectProduct,
  onNavigate,
  onToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceMax, setPriceMax] = useState<number>(2000);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = [
    'All',
    'Grains & Cereals',
    'Natural Sweeteners',
    'Gourmet Oils',
    'Spices & Condiments',
    'Herbal Teas',
  ];

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filtering
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock = !inStockOnly || p.stock > 0;
    const matchesPrice = p.price <= priceMax;
    return matchesCat && matchesSearch && matchesStock && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0);
  });

  const shopFaqs = [
    {
      q: 'How are your wood-churned cold-pressed oils prepared?',
      a: 'We use ancient Vagai (Albizia lebbeck) wood cold-press Ghani pestles at temperatures strictly below 40°C. This ensures that delicate polyphenols, vitamin E, and natural fragrances remain intact without synthetic refining.'
    },
    {
      q: 'Why does raw forest honey crystallize over time?',
      a: 'Natural crystallization is the hallmark of 100% pure, unpasteurized honey. Processed commercial honeys are ultra-filtered and boiled, destroying beneficial pollen enzymes. To liquefy, simply place the glass jar in a warm water bath.'
    },
    {
      q: 'How should heirloom Emmer wheat (Khapli) flour be stored?',
      a: 'Because our grains contain zero chemical fumigants or preservatives, keep your grains or flour in an airtight steel or glass container in a cool, dry place. For extended shelf-life beyond 3 months, keeping it refrigerated is recommended.'
    },
    {
      q: 'What are your delivery timelines and packaging standards?',
      a: 'All orders are freshly packed at our estate facility and dispatched within 24 hours via express couriers (BlueDart / DTDC / AgriExpress). Deliveries across South India arrive in 1-2 business days; North and Eastern regions take 3-4 days.'
    }
  ];

  return (
    <div className="space-y-0">
      {/* 🌾 SECTION 1: SHOP HEADER & BREADCRUMB BANNER */}
      <section className="bg-gradient-to-r from-[#2D4F2D] via-[#234123] to-[#1A2F1A] text-white py-12 px-6 md:px-12 border-b border-[#1E3A1E]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#D4E9D4]/80">
              <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">
                Home
              </button>
              <span>/</span>
              <span className="text-[#D4AF37] font-semibold">Shop Catalog</span>
              {selectedCategory !== 'All' && (
                <>
                  <span>/</span>
                  <span className="text-white">{selectedCategory}</span>
                </>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#FAF8F5]">
              Pure Organic Produce & Natural Pantry
            </h1>
            <p className="text-xs sm:text-sm text-[#D4E9D4] max-w-xl">
              100% chemical-free grains, cold-pressed oils, Nilgiris honey, and heritage spices direct from our cultivators.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-xs">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <div className="font-bold text-white">Guaranteed Fresh Batch</div>
              <div className="text-[11px] text-[#D4E9D4]/80">Cold-chain insulated packing</div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔍 SECTION 2: ADVANCED FILTER TOOLBAR */}
      <section className="sticky top-[73px] z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E2DCC8] px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Top Row: Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#2D4F2D] text-white shadow-xs'
                      : 'bg-white text-[#4A5D4A] hover:bg-stone-100 border border-[#E2DCC8]'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Row: Search, Stock Toggle, Price & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px] sm:max-w-xs">
              <Search className="w-4 h-4 text-[#8B9A8B] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name or ingredient..."
                className="w-full pl-9 pr-8 py-2 bg-white border border-[#E2DCC8] rounded-xl text-xs text-[#1A2F1A] focus:outline-none focus:ring-1 focus:ring-[#2D4F2D]"
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

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* In-Stock Toggle */}
              <label className="flex items-center gap-2 text-xs font-medium text-[#4A5D4A] cursor-pointer select-none bg-white px-3 py-1.5 rounded-xl border border-[#E2DCC8]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#2D4F2D] focus:ring-[#2D4F2D] w-3.5 h-3.5"
                />
                <span>In Stock Only</span>
              </label>

              {/* Price Max Filter */}
              <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E2DCC8] text-xs text-[#4A5D4A]">
                <span>Under:</span>
                <select
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="font-bold text-[#2D4F2D] bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value={500}>₹500</option>
                  <option value={1000}>₹1,000</option>
                  <option value={1500}>₹1,500</option>
                  <option value={2000}>₹2,000 (All)</option>
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#E2DCC8]">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#8B9A8B]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-medium text-[#1A2F1A] bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📦 SECTION 3: PRODUCT CATALOG GRID */}
      <section className="px-6 md:px-12 py-10 bg-white min-h-[500px]">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Active Filter Summary Bar */}
          <div className="flex items-center justify-between text-xs text-[#6B7C6B] border-b border-[#E2DCC8] pb-3">
            <div>
              Showing <strong className="text-[#1A2F1A]">{sortedProducts.length}</strong> of{' '}
              <strong className="text-[#1A2F1A]">{products.length}</strong> organic harvest items
              {selectedCategory !== 'All' && (
                <span> in <strong className="text-[#2D4F2D]">{selectedCategory}</strong></span>
              )}
            </div>

            {(selectedCategory !== 'All' || searchQuery || inStockOnly || priceMax < 2000) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setInStockOnly(false);
                  setPriceMax(2000);
                }}
                className="text-[#D4AF37] hover:underline font-bold text-xs cursor-pointer flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear All Filters
              </button>
            )}
          </div>

          {/* Grid or Empty State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
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
            <div className="text-center py-20 space-y-4 bg-[#FAF8F5] rounded-3xl border border-[#E2DCC8] max-w-2xl mx-auto">
              <Wheat className="w-12 h-12 text-[#8B9A8B] mx-auto opacity-50" />
              <h3 className="font-serif text-xl font-bold text-[#1A2F1A]">No harvest items match your criteria</h3>
              <p className="text-xs text-[#6B7C6B] max-w-md mx-auto">
                Try widening your price range, searching for another keyword, or resetting category filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setInStockOnly(false);
                  setPriceMax(2000);
                }}
                className="px-5 py-2.5 bg-[#2D4F2D] text-white rounded-full text-xs font-bold shadow-sm"
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

      {/* 🚚 SECTION 4: HARVEST QUALITY & COLD-CHAIN ASSURANCE */}
      <section className="px-6 md:px-12 py-10 bg-[#FAF8F5] border-y border-[#E2DCC8]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#E2DCC8]">
            <div className="p-3 bg-[#E9F0E9] rounded-xl text-[#2D4F2D]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1A2F1A]">Express Farm-to-Door</h4>
              <p className="text-xs text-[#6B7C6B] mt-1">
                Dispatched directly from estate warehouses in shock-proof, eco-friendly corrugated packing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#E2DCC8]">
            <div className="p-3 bg-[#FAF0D7] rounded-xl text-[#D4AF37]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1A2F1A]">FSSAI & Lab Tested</h4>
              <p className="text-xs text-[#6B7C6B] mt-1">
                Zero heavy metals, zero adulterants, and zero synthetic preservatives guaranteed on every batch.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#E2DCC8]">
            <div className="p-3 bg-[#E9F0E9] rounded-xl text-[#2D4F2D]">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1A2F1A]">100% Freshness Guarantee</h4>
              <p className="text-xs text-[#6B7C6B] mt-1">
                If you aren't completely delighted by the natural flavor and aroma, we replace or refund hassle-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ❓ SECTION 5: HARVEST FAQS & NUTRITIONAL GUIDANCE */}
      <section className="px-6 md:px-12 py-16 bg-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
              Patron Questions & Storage Guidance
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#1A2F1A]">
              Frequently Asked Harvest Inquiries
            </h2>
            <p className="text-xs text-[#6B7C6B]">
              Essential guidance on cold-pressed oils, wild honeys, and organic grain preservation.
            </p>
          </div>

          <div className="space-y-3">
            {shopFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#E2DCC8] bg-[#FAF8F5] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm text-[#1A2F1A] cursor-pointer hover:text-[#2D4F2D]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8B9A8B] shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-[#2D4F2D]' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-[#4A5D4A] leading-relaxed border-t border-[#E2DCC8]/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
