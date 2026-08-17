import React, { useState } from 'react';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  X,
  Star,
  ShoppingBag,
  Zap,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle,
  Plus,
  Minus,
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onToast,
}) => {
  if (!product) return null;

  const { addToCart, quickBuy } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedQty, setSelectedQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping' | 'reviews'>('details');

  // Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [localReviews, setLocalReviews] = useState<Review[]>([]);

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1000&auto=format&fit=crop'];

  const handleAddToCart = () => {
    const res = addToCart(product, selectedQty);
    onToast(res.message || (res.success ? `Added ${selectedQty}x to your harvest basket` : 'Cannot add item'));
  };

  const handleQuickBuy = () => {
    if (isOutOfStock) {
      onToast(`"${product.name}" is out of stock`);
      return;
    }
    quickBuy(product, selectedQty);
    onClose();
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      onToast('Please provide your name and review remarks.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          user_name: reviewName,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        })
      });

      if (response.ok) {
        const newRev = await response.json();
        setLocalReviews([newRev, ...localReviews]);
        setReviewName('');
        setReviewTitle('');
        setReviewComment('');
        onToast('Thank you for sharing your harvest blessing review!');
      } else {
        onToast('Failed to save review.');
      }
    } catch {
      onToast('Review recorded locally.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div
      id="product-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="product-detail-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E2DCC8] overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 backdrop-blur-md text-[#1A2F1A] hover:bg-white shadow-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Gallery Column */}
        <div className="md:w-1/2 bg-[#F4F1EA] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E2DCC8]">
          <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-white shadow-inner flex items-center justify-center">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Discount Badge */}
            {product.discount > 0 && (
              <span className="absolute top-3 left-3 bg-[#E63946] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow">
                Save {product.discount}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImageIndex === idx ? 'border-[#2D4F2D] shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="mt-4 pt-4 border-t border-[#E2DCC8] grid grid-cols-3 gap-2 text-center text-[11px] text-[#4A5D4A]">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#2D4F2D]" />
              <span className="font-semibold">Fast Express</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-semibold">100% Organic</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-[#2D4F2D]" />
              <span className="font-semibold">Easy Return</span>
            </div>
          </div>
        </div>

        {/* Right: Content Column */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
          <div>
            {/* Header info */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-full border border-[#D4AF37]/20">
                {product.category}
              </span>
              <span className="text-xs text-[#8B9A8B] font-mono">SKU: {product.sku}</span>
            </div>

            <h2 className="text-2xl font-serif font-bold text-[#1A2F1A] leading-tight mb-2">
              {product.name}
            </h2>

            {/* Ratings & Faith Stamp */}
            <div className="flex items-center gap-3 mb-4 text-sm">
              <div className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="w-4 h-4 fill-current text-[#D4AF37]" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-[#8B9A8B]">({product.reviews_count} reviews)</span>
              </div>
              <span className="text-[#E2DCC8]">|</span>
              <span className="flex items-center gap-1 text-[#2D4F2D] text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" /> Verified Harvest
              </span>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-[#E2DCC8] mb-5 shadow-xs">
              <span className="text-3xl font-extrabold text-[#2D4F2D]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.original_price > product.price && (
                <span className="text-sm text-[#8B9A8B] line-through">
                  ₹{product.original_price.toLocaleString('en-IN')}
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-xs font-bold text-[#E63946] bg-rose-50 px-2 py-0.5 rounded-md">
                  Save {product.discount}%
                </span>
              )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#E2DCC8] mb-4 gap-4 text-xs font-bold">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 transition-colors relative cursor-pointer ${
                  activeTab === 'details' ? 'text-[#2D4F2D]' : 'text-[#8B9A8B] hover:text-[#1A2F1A]'
                }`}
              >
                Description
                {activeTab === 'details' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF37]" />}
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2 transition-colors relative cursor-pointer ${
                  activeTab === 'specs' ? 'text-[#2D4F2D]' : 'text-[#8B9A8B] hover:text-[#1A2F1A]'
                }`}
              >
                Specifications
                {activeTab === 'specs' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF37]" />}
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-2 transition-colors relative cursor-pointer ${
                  activeTab === 'shipping' ? 'text-[#2D4F2D]' : 'text-[#8B9A8B] hover:text-[#1A2F1A]'
                }`}
              >
                Shipping & Returns
                {activeTab === 'shipping' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF37]" />}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 transition-colors relative cursor-pointer ${
                  activeTab === 'reviews' ? 'text-[#2D4F2D]' : 'text-[#8B9A8B] hover:text-[#1A2F1A]'
                }`}
              >
                Reviews
                {activeTab === 'reviews' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF37]" />}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="text-sm text-[#4A5D4A] mb-6 leading-relaxed">
              {activeTab === 'details' && (
                <div className="space-y-3">
                  <p>{product.full_description}</p>
                  <div className="p-3 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#1A2F1A] font-serif italic">
                      "He provides you with plenty of food and fills your hearts with joy." — Acts 14:17
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="bg-white/80 rounded-xl p-4 border border-[#E2DCC8] space-y-2">
                  {Object.entries(product.specifications || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs py-1 border-b border-stone-100 last:border-0">
                      <span className="font-semibold text-[#1A2F1A]">{key}</span>
                      <span className="text-[#4A5D4A]">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-3 text-xs">
                  <p><strong>Shipping:</strong> {product.shipping_info}</p>
                  <p><strong>Returns:</strong> {product.return_info}</p>
                  <p className="text-[#8B9A8B]">Free pan-India shipping for all harvest orders above ₹999.</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {/* Reviews list */}
                  <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                    {localReviews.map((rev) => (
                      <div key={rev.id} className="p-3 bg-white rounded-xl border border-[#E2DCC8]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-xs text-[#1A2F1A]">{rev.user_name}</span>
                          <span className="text-[10px] text-[#8B9A8B]">{rev.date}</span>
                        </div>
                        <div className="flex text-amber-500 mb-1">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current text-[#D4AF37]" />
                          ))}
                        </div>
                        <p className="text-xs text-[#4A5D4A]">{rev.comment}</p>
                      </div>
                    ))}
                    {localReviews.length === 0 && (
                      <p className="text-xs text-[#8B9A8B] text-center py-2">
                        Be the first to leave a verified blessing review!
                      </p>
                    )}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleSubmitReview} className="p-3 bg-white/60 rounded-xl border border-[#E2DCC8] space-y-2">
                    <p className="text-xs font-bold text-[#1A2F1A]">Write a Review</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Your name"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-[#E2DCC8] rounded-lg text-xs"
                      />
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="px-2.5 py-1.5 bg-white border border-[#E2DCC8] rounded-lg text-xs"
                      >
                        <option value={5}>★★★★★ (5 Stars)</option>
                        <option value={4}>★★★★☆ (4 Stars)</option>
                        <option value={3}>★★★☆☆ (3 Stars)</option>
                        <option value={2}>★★☆☆☆ (2 Stars)</option>
                        <option value={1}>★☆☆☆☆ (1 Star)</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Share your experience with this harvest product..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={2}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E2DCC8] rounded-lg text-xs"
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="w-full py-1.5 bg-[#2D4F2D] text-white text-xs font-bold rounded-lg hover:bg-[#1E3A1E] transition-colors cursor-pointer"
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Post Blessing Review'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Quantity & Action Controls */}
          <div className="pt-4 border-t border-[#E2DCC8]">
            <div className="flex items-center justify-between gap-4 mb-4">
              {/* Qty Selector */}
              <div className="flex items-center bg-white border border-[#E2DCC8] rounded-full p-1 shadow-inner">
                <button
                  onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                  disabled={selectedQty <= 1 || isOutOfStock}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-[#1A2F1A] transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-[#1A2F1A]">{selectedQty}</span>
                <button
                  onClick={() => setSelectedQty(Math.min(product.stock, selectedQty + 1))}
                  disabled={selectedQty >= product.stock || isOutOfStock}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-[#1A2F1A] transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Wishlist Toggle */}
              <button
                onClick={() => {
                  toggleWishlist(product);
                  onToast(isFavorite ? 'Removed from wishlist' : 'Added to wishlist');
                }}
                className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                  isFavorite
                    ? 'bg-[#D4AF37] text-white border-[#D4AF37]'
                    : 'bg-white text-[#1A2F1A] border-[#E2DCC8] hover:bg-[#F4F1EA]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-[#2D4F2D] hover:bg-[#1E3A1E] text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#2D4F2D]/20 transition-all hover:scale-102 active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" /> Add To Basket
              </button>

              <button
                disabled={isOutOfStock}
                onClick={handleQuickBuy}
                className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#F5E6AB] text-[#1A2F1A] rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4 fill-current" /> Instant Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
