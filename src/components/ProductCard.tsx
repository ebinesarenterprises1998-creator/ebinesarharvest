import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, ShoppingBag, Star, Zap, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onToast: (msg: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onToast }) => {
  const { addToCart, quickBuy } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = addToCart(product, 1);
    onToast(res.message || (res.success ? `Added "${product.name}" to cart` : 'Cannot add item'));
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) {
      onToast(`"${product.name}" is currently out of stock`);
      return;
    }
    quickBuy(product, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
    onToast(isFavorite ? `Removed from wishlist` : `Added to your harvest wishlist`);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      className="group relative bg-[#FDFCF9] border border-[#F0EBE0] rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
    >
      {/* Image Container with Badges */}
      <div className="relative h-48 w-full bg-[#F4F1EA] rounded-xl mb-4 overflow-hidden flex items-center justify-center">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&auto=format&fit=crop'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Subtle Frosted Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2F1A]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-[#1A2F1A] text-xs font-semibold px-3.5 py-1.5 rounded-full shadow hover:bg-white transition-all transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>

        {/* Status / Discount Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.discount > 0 && (
            <span className="bg-[#E63946] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              -{product.discount}%
            </span>
          )}
          {product.is_new && (
            <span className="bg-[#D4AF37] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              NEW
            </span>
          )}
          {product.is_bestseller && (
            <span className="bg-[#2D4F2D] text-[#F5E6AB] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              ★ BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Wishlist"
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isFavorite
              ? 'bg-[#D4AF37] text-white shadow-md'
              : 'bg-white/70 text-[#1A2F1A] hover:bg-white shadow-sm'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Out of stock banner */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-stone-900/90 text-stone-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-medium text-[#8B9A8B] uppercase tracking-wider truncate">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-600 text-xs font-bold">
              <Star className="w-3 h-3 fill-current text-[#D4AF37]" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-[#8B9A8B] text-[10px]">({product.reviews_count})</span>
            </div>
          </div>

          <h3 className="font-bold text-[#1A2F1A] text-sm leading-snug line-clamp-2 group-hover:text-[#2D4F2D] transition-colors mb-1.5">
            {product.name}
          </h3>

          <p className="text-xs text-[#6B7C6B] line-clamp-2 mb-3 leading-relaxed">
            {product.short_description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div>
          {/* Stock state */}
          <div className="mb-2">
            {isLowStock ? (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Only {product.stock} left in harvest!
              </span>
            ) : isOutOfStock ? (
              <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Out of Stock
              </span>
            ) : (
              <span className="text-[10px] font-medium text-[#2D4F2D]">
                ✓ Fresh in Stock ({product.stock})
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#F0EBE0]/80">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[#2D4F2D] font-extrabold text-base">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.original_price > product.price && (
                  <span className="text-xs text-[#8B9A8B] line-through font-normal">
                    ₹{product.original_price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                title="Add to Basket"
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isOutOfStock
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-[#2D4F2D] text-white hover:bg-[#1E3A1E] shadow-sm hover:scale-105 active:scale-95'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
              </button>

              <button
                disabled={isOutOfStock}
                onClick={handleQuickBuy}
                title="Instant Buy Now"
                className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  isOutOfStock
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-[#D4AF37] text-[#1A2F1A] hover:bg-[#F5E6AB] shadow-sm active:scale-95'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Buy</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
