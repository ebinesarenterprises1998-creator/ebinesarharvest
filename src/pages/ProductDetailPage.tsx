import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Plus,
  Minus,
  CheckCircle2,
} from 'lucide-react';
import { productService } from '../services/supabase/supabaseClient';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Product } from '../types';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string, params?: any) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, onNavigate }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    productService.getProductById(productId).then((p) => {
      setProduct(p);
      setIsLoading(false);
    });
  }, [productId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#0B3D2E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-[#0B3D2E]">Loading harvest product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-[#0B3D2E]">Harvest Item Not Found</h2>
        <p className="text-xs text-gray-500">The product you are looking for may have been moved or is currently being harvested.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 bg-[#0B3D2E] text-[#FFDF78] font-bold text-xs rounded-xl"
        >
          Return to Harvest Store
        </button>
      </div>
    );
  }

  const galleryImages = [
    product.product_image || '/placeholder-harvest.jpg',
    ...(product.images || []),
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back Button */}
      <button
        onClick={() => onNavigate('shop')}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#0B3D2E] hover:text-[#C99A2E] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Harvest Store
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Product Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-[#F8F4EA] rounded-3xl overflow-hidden border border-[#0B3D2E]/10 shadow-sm relative">
            <img
              src={galleryImages[activeImageIndex] || '/placeholder-harvest.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-md transition-transform active:scale-90 ${
                isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-white/80 text-[#0B3D2E]'
              }`}
            >
              <Heart className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-[#0B3D2E] ring-2 ring-[#C99A2E]' : 'border-gray-200 opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              {product.unit || 'Natural Harvest'}
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-[#0B3D2E]">
              {product.name}
            </h1>
            <p className="text-sm text-gray-600 font-serif-sub italic">
              {product.short_description}
            </p>
          </div>

          {/* Price Block */}
          <div className="p-4 bg-[#F8F4EA] rounded-2xl border border-[#C99A2E]/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500">Harvest Price</span>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-extrabold text-3xl text-[#0B3D2E]">
                  ₹{product.price}
                </span>
                {product.original_price && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.original_price}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                {product.inventory > 0 ? 'In Stock & Fresh' : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-2 text-xs sm:text-sm text-[#1B2A22]/80 leading-relaxed">
            <h4 className="font-display font-bold text-sm text-[#0B3D2E]">Harvest Information</h4>
            <p>{product.description || product.short_description}</p>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-600 uppercase">Quantity</span>
              <div className="flex items-center border border-gray-300 rounded-xl bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-l-xl"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-sm font-bold text-[#0B3D2E]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                  className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-r-xl"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.inventory <= 0}
                className="flex-1 py-4 bg-[#0B3D2E] hover:bg-[#063B2D] text-[#FFDF78] font-display font-bold text-sm tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO HARVEST BASKET</span>
              </button>

              <button
                onClick={() => {
                  addToCart(product, quantity);
                  onNavigate('checkout');
                }}
                disabled={product.inventory <= 0}
                className="px-8 py-4 bg-[#C99A2E] hover:bg-[#DFB14E] text-[#063B2D] font-display font-bold text-sm tracking-wider rounded-2xl shadow-lg transition-transform hover:scale-[1.02]"
              >
                BUY NOW
              </button>
            </div>

            {addedNotice && (
              <div className="p-3 bg-green-50 text-green-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Added {quantity} × {product.name} to your basket!
              </div>
            )}
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100 text-center">
            <div className="p-3 rounded-2xl bg-white border border-gray-100">
              <Truck className="w-4 h-4 text-[#0B3D2E] mx-auto mb-1" />
              <span className="block text-[11px] font-bold text-[#0B3D2E]">Swift Dispatch</span>
              <span className="text-[10px] text-gray-400">Direct from farm</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-gray-100">
              <ShieldCheck className="w-4 h-4 text-[#C99A2E] mx-auto mb-1" />
              <span className="block text-[11px] font-bold text-[#0B3D2E]">Purity Check</span>
              <span className="text-[10px] text-gray-400">100% genuine</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-gray-100">
              <RotateCcw className="w-4 h-4 text-[#0B3D2E] mx-auto mb-1" />
              <span className="block text-[11px] font-bold text-[#0B3D2E]">Grace Promise</span>
              <span className="text-[10px] text-gray-400">Easy assistance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
