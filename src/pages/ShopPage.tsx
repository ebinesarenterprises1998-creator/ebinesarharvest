import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Sprout,
  Heart,
  ShoppingBag,
  Sparkles,
  ArrowUpDown,
  Check,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { productService, categoryService } from '../services/supabase/supabaseClient';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Product, Category } from '../types';

interface ShopPageProps {
  initialCategoryId?: string;
  onNavigate: (page: string, params?: any) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialCategoryId, onNavigate }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    categoryService.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery, sortBy]);

  const loadProducts = async () => {
    setIsLoading(true);
    const filterParams: any = {
      is_active: true,
      sort_by: sortBy,
      search: searchQuery.trim() || undefined,
    };
    if (selectedCategory !== 'all') {
      filterParams.category_id = selectedCategory;
    }
    const data = await productService.getProducts(filterParams);
    setProducts(data);
    setIsLoading(false);
  };

  const filteredProducts = products.filter((p) => {
    if (p.price > maxPrice) return false;
    if (inStockOnly && p.inventory <= 0) return false;
    return true;
  });

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('newest');
    setMaxPrice(5000);
    setInStockOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Shop Header Banner */}
      <div className="gradient-hero text-white rounded-lg p-8 sm:p-12 border border-[#C99A2E]/30 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#C99A2E] block">
            Ebinesar Harvest
          </span>
          <h1 className="serif text-3xl sm:text-5xl text-white tracking-tight">
            Harvest Store
          </h1>
          <p className="text-sm sm:text-base text-white/75 font-serif-sub italic">
            Discover wholesome farm produce, handmade creations, and natural blessings cultivated with care.
          </p>
        </div>
      </div>

      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg border border-[#0B3D2E]/10 shadow-sm">
        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search farm products..."
            className="w-full pl-9 pr-4 py-2 bg-[#F8F4EA] border border-gray-200 rounded-sm text-xs sm:text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
          />
        </div>

        {/* Action Controls (Sort, Filters Button) */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-[#F8F4EA] text-[#0B3D2E] font-bold uppercase tracking-wider text-xs rounded-sm border border-gray-200"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-[#F8F4EA] border border-gray-200 text-[#0B3D2E] text-xs font-semibold rounded-sm px-3 py-2 focus:outline-none focus:border-[#C99A2E]"
            >
              <option value="newest">Newest Harvest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Sidebar + Product Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar (Desktop) */}
        <div className="hidden lg:block space-y-6 bg-white p-6 rounded-lg border border-[#0B3D2E]/10 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="serif font-bold text-base text-[#0B3D2E] flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#C99A2E]" />
              Filter Harvest
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs uppercase tracking-wider text-gray-400 hover:text-[#0B3D2E] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Categories
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#0B3D2E] text-[#FFDF78] font-bold'
                    : 'text-[#1B2A22] hover:bg-[#F8F4EA]'
                }`}
              >
                All Harvest Goods
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-[#0B3D2E] text-[#FFDF78] font-bold'
                      : 'text-[#1B2A22] hover:bg-[#F8F4EA]'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] opacity-70">({cat.product_count || 0})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-gray-500">Max Price</span>
              <span className="font-bold text-[#0B3D2E]">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#0B3D2E]"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>₹100</span>
              <span>₹5,000</span>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="pt-3 border-t border-gray-100">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-[#0B3D2E] focus:ring-[#C99A2E] w-4 h-4"
              />
              <span className="text-xs font-medium text-[#1B2A22]">In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#0B3D2E] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium text-[#0B3D2E]">Gathering harvest listings...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            /* ========================================================================= */
            /* ARTISTIC FLAIR CURATION & PREPARATION STATE                               */
            /* ========================================================================= */
            <div className="bg-[#F8F4EA] rounded-lg p-10 sm:p-14 flex flex-col items-center text-center border-2 border-dashed border-[#0B3D2E]/15 space-y-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#0B3D2E]/10">
                <Sprout className="w-8 h-8 text-[#C99A2E]" />
              </div>

              <div className="max-w-md space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C99A2E] block">
                  Season of Preparation
                </span>
                <h3 className="serif text-2xl sm:text-3xl text-[#0B3D2E]">
                  Your harvest is being prepared
                </h3>
                <p className="text-sm text-[#0B3D2E]/70 font-serif-sub italic leading-relaxed">
                  Products will appear here soon. We are carefully curating our first seasonal collection with faith and purpose.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => onNavigate('categories')}
                  className="text-[#0B3D2E] border-b border-[#0B3D2E] font-bold uppercase tracking-widest text-xs pb-1 hover:text-[#C99A2E] hover:border-[#C99A2E] transition-all"
                >
                  Explore Categories →
                </button>

                <button
                  onClick={() => onNavigate('contact')}
                  className="text-xs uppercase tracking-widest text-[#0B3D2E]/70 hover:text-[#0B3D2E] transition-colors"
                >
                  Contact Stewards
                </button>
              </div>
            </div>
          ) : (
            /* Real Products Grid (populated dynamically when admin adds products) */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-lg overflow-hidden border border-[#0B3D2E]/10 shadow-sm hover:shadow-xl hover:border-[#C99A2E] transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative overflow-hidden bg-[#F8F4EA] aspect-square">
                    <img
                      src={product.product_image || '/placeholder-harvest.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
                        isInWishlist(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/80 text-[#0B3D2E] hover:bg-white'
                      }`}
                      aria-label="Wishlist toggle"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>

                    {/* Featured / In-stock badge */}
                    {product.is_featured && (
                      <span className="absolute top-3 left-3 bg-[#C99A2E] text-[#0B3D2E] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#C99A2E] tracking-widest">
                        {product.unit || 'Harvest Product'}
                      </span>
                      <h3
                        onClick={() => onNavigate('product-detail', { id: product.id })}
                        className="serif font-bold text-base text-[#0B3D2E] group-hover:text-[#C99A2E] cursor-pointer transition-colors line-clamp-1 mt-0.5"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#0B3D2E]/60 line-clamp-2 mt-1 font-serif-sub italic">
                        {product.short_description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Price</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-base text-[#0B3D2E]">
                            ₹{product.price}
                          </span>
                          {product.original_price && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{product.original_price}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(product, 1)}
                        className="p-2.5 bg-[#C99A2E] hover:bg-[#0B3D2E] text-[#0B3D2E] hover:text-[#FFDF78] rounded-sm shadow-sm transition-all"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
