import React, { useState, useEffect } from 'react';
import {
  Sprout,
  CookingPot,
  Leaf,
  Home,
  Flower2,
  HeartPulse,
  Dog,
  Gift,
  ArrowRight,
  Sparkles,
  Search,
} from 'lucide-react';
import { categoryService } from '../services/supabase/supabaseClient';
import { Category } from '../types';

interface CategoriesPageProps {
  onNavigate: (page: string, params?: any) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Sprout: <Sprout className="w-8 h-8 text-[#0B3D2E]" />,
  CookingPot: <CookingPot className="w-8 h-8 text-[#0B3D2E]" />,
  Leaf: <Leaf className="w-8 h-8 text-[#0B3D2E]" />,
  Home: <Home className="w-8 h-8 text-[#0B3D2E]" />,
  Flower2: <Flower2 className="w-8 h-8 text-[#0B3D2E]" />,
  HeartPulse: <HeartPulse className="w-8 h-8 text-[#0B3D2E]" />,
  Dog: <Dog className="w-8 h-8 text-[#0B3D2E]" />,
  Gift: <Gift className="w-8 h-8 text-[#0B3D2E]" />,
};

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    categoryService.getCategories().then(setCategories);
  }, []);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C99A2E] bg-[#C99A2E]/10 px-3.5 py-1.5 rounded-full border border-[#C99A2E]/30 inline-block">
          HARVEST TAXONOMY
        </span>
        <h1 className="serif text-4xl sm:text-5xl text-[#0B3D2E]">
          Explore Harvest Categories
        </h1>
        <p className="text-sm sm:text-base text-[#0B3D2E]/75 font-serif-sub italic">
          Every harvest collection is nurtured with patience, prayer, and dedication to pure living.
        </p>

        {/* Category Search */}
        <div className="relative max-w-md mx-auto mt-6">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search harvest categories..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-sm text-sm text-[#0B3D2E] shadow-sm focus:outline-none focus:border-[#C99A2E]"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((category) => (
          <div
            key={category.id}
            onClick={() => onNavigate('shop', { category: category.id })}
            className="group bg-white rounded-lg p-7 border border-[#0B3D2E]/10 shadow-sm hover:shadow-xl hover:border-[#C99A2E] transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-sm bg-[#F8F4EA] group-hover:bg-[#0B3D2E] border border-[#0B3D2E]/10 flex items-center justify-center transition-colors mb-5 text-[#0B3D2E] group-hover:text-[#FFDF78]">
                {iconMap[category.icon || 'Sprout'] || <Sprout className="w-7 h-7" />}
              </div>

              <h3 className="serif font-bold text-xl text-[#0B3D2E] group-hover:text-[#C99A2E] transition-colors">
                {category.name}
              </h3>

              <p className="text-xs text-[#0B3D2E]/70 leading-relaxed mt-2.5">
                {category.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                {category.product_count === 0 ? 'Curating' : `${category.product_count} items`}
              </span>

              <span className="text-[10px] uppercase tracking-widest font-bold text-[#0B3D2E] group-hover:text-[#C99A2E] flex items-center gap-1">
                View Collection <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
