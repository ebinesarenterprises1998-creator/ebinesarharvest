import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { productService, categoryService } from '../../services/supabase/supabaseClient';
import { Product, Category } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      categoryService.getCategories().then(setCategories);
    } else {
      setQuery('');
      setProducts([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 1) {
      productService.getProducts({ search: query }).then(setProducts);
    } else {
      setProducts([]);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="max-w-2xl mx-auto bg-[#FCFAF5] rounded-3xl shadow-2xl border border-[#C99A2E]/30 overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 bg-white border-b border-[#0B3D2E]/10 flex items-center gap-3">
          <Search className="w-6 h-6 text-[#0B3D2E]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search farm-fresh produce, natural goods, gifts..."
            className="flex-1 text-base sm:text-lg text-[#0B3D2E] placeholder-gray-400 bg-transparent focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
          {/* Quick Category Suggestions */}
          {query.trim().length === 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Explore Categories
              </h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onClose();
                      onNavigate('shop', { category: cat.id });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#0B3D2E]/15 text-xs font-medium text-[#0B3D2E] hover:border-[#C99A2E] hover:bg-[#F8F4EA] transition-colors"
                  >
                    <Tag className="w-3.5 h-3.5 text-[#C99A2E]" />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {query.trim().length > 1 && (
            <div>
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm font-semibold text-[#0B3D2E]">No harvest products found matching &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-gray-500 mt-1">Our stewards are curating new farm batches daily.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Found {products.length} product(s)
                  </h4>
                  <div className="space-y-2">
                    {products.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onClose();
                          onNavigate('product-detail', { id: item.id });
                        }}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white border border-gray-100 hover:border-[#C99A2E] hover:shadow-md cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product_image || '/placeholder-harvest.jpg'}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover bg-gray-50"
                          />
                          <div>
                            <h5 className="font-semibold text-sm text-[#0B3D2E]">{item.name}</h5>
                            <p className="text-xs text-gray-500">{item.short_description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-sm text-[#0B3D2E]">₹{item.price}</span>
                          <ArrowRight className="w-4 h-4 text-[#C99A2E] ml-auto mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
