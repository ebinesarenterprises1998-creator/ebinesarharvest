import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout, onContinueShopping }) => {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, totalAmount, totalSavings } = useCart();

  if (!isCartOpen) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, (totalAmount / freeShippingThreshold) * 100);
  const amountNeeded = Math.max(0, freeShippingThreshold - totalAmount);

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsCartOpen(false)}
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-drawer-container"
          onClick={(e) => e.stopPropagation()}
          className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#E2DCC8] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-white/70 backdrop-blur-md border-b border-[#E2DCC8] flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#2D4F2D] rounded-full flex items-center justify-center text-[#D4AF37]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-serif font-bold text-[#1A2F1A]">
                Harvest Basket <span className="text-xs font-sans text-[#8B9A8B]">({totalItems} items)</span>
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-stone-200 text-[#1A2F1A] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-[#E9F0E9]/80 border-b border-[#E2DCC8]">
            <div className="flex justify-between items-center text-xs font-semibold text-[#2D4F2D] mb-1.5">
              <span>
                {amountNeeded === 0 ? (
                  <span className="flex items-center gap-1 text-[#2D4F2D]">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Free Pan-India Delivery Unlocked!
                  </span>
                ) : (
                  `Add ₹${amountNeeded.toFixed(0)} more for Free Shipping`
                )}
              </span>
              <span>{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full bg-white rounded-full h-1.5 overflow-hidden border border-[#E2DCC8]">
              <div
                className="bg-[#2D4F2D] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#F4F1EA] flex items-center justify-center text-[#2D4F2D]/30 border border-[#E2DCC8]">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#1A2F1A]">Your basket is empty</h3>
                <p className="text-xs text-[#6B7C6B] max-w-xs leading-relaxed">
                  Discover fresh organic grains, cold-pressed oils, wildflower honeys, and natural harvest goods.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onContinueShopping();
                  }}
                  className="px-6 py-2.5 bg-[#2D4F2D] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#1E3A1E] transition-colors shadow"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3 bg-white rounded-2xl border border-[#E2DCC8] flex gap-3 shadow-xs transition-all hover:border-[#2D4F2D]/30"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-[#F4F1EA] overflow-hidden shrink-0 border border-[#F0EBE0]">
                    <img
                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=300'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-xs text-[#1A2F1A] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[#8B9A8B] hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-[#8B9A8B] uppercase">{item.product.category}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Qty */}
                      <div className="flex items-center bg-[#F4F1EA] rounded-lg p-0.5 border border-[#E2DCC8]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-[#1A2F1A] hover:bg-white rounded transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#1A2F1A]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 text-[#1A2F1A] hover:bg-white rounded transition-colors disabled:opacity-30 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#2D4F2D]">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.product.original_price > item.product.price && (
                          <div className="text-[10px] text-[#8B9A8B] line-through">
                            ₹{(item.product.original_price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cart.length > 0 && (
            <div className="p-6 bg-white/90 backdrop-blur-md border-t border-[#E2DCC8] space-y-3">
              {totalSavings > 0 && (
                <div className="flex justify-between text-xs text-[#2D4F2D] font-medium bg-[#E9F0E9] p-2 rounded-xl border border-[#D4E9D4]">
                  <span>Total Harvest Savings:</span>
                  <span className="font-bold">₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="space-y-1 text-xs text-[#4A5D4A]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1A2F1A]">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pan-India Delivery</span>
                  <span>{amountNeeded === 0 ? <strong className="text-[#2D4F2D]">FREE</strong> : '₹80.00'}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-[#E2DCC8]">
                <span className="font-serif font-bold text-[#1A2F1A] text-base">Estimated Total:</span>
                <span className="text-xl font-extrabold text-[#2D4F2D]">
                  ₹{(totalAmount + (amountNeeded === 0 ? 0 : 80)).toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-3.5 bg-[#2D4F2D] hover:bg-[#1E3A1E] text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#2D4F2D]/20 transition-all hover:scale-101 active:scale-99 cursor-pointer"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#8B9A8B] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>100% Encrypted & Authentic Organic Goods</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
