import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, Tag, CheckCircle2, ShieldCheck, Truck, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartDrawerProps {
  onNavigate: (page: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    cart,
    isCartDrawerOpen,
    closeCartDrawer,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    couponCode,
    shippingFee,
    tax,
    total,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ msg: string; isError: boolean } | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponFeedback({ msg: res.message, isError: !res.success });
    if (res.success) setInputCoupon('');
  };

  const freeShippingThreshold = 1000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200" id="cart-drawer-modal">
      {/* Translucent Backdrop with Glass Blur */}
      <div
        onClick={closeCartDrawer}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FCFAF5]/95 backdrop-blur-2xl shadow-2xl flex flex-col border-l border-[#C99A2E]/30 text-[#0B3D2E]">
          {/* Header with Gradient Hero & Glassmorphic Trim */}
          <div className="px-6 py-4.5 gradient-hero text-white flex items-center justify-between border-b border-[#C99A2E]/30 relative z-10 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-[#C99A2E]/20 border border-[#C99A2E]/40 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#FFDF78]" />
              </div>
              <div>
                <h2 className="serif text-base font-bold text-white tracking-wide flex items-center gap-2">
                  Harvest Basket
                  <span className="bg-[#C99A2E] text-[#0B3D2E] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                  </span>
                </h2>
                <p className="text-[10px] uppercase tracking-widest text-[#FFDF78]/80 font-medium">
                  Ebinesar Harvest Store
                </p>
              </div>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-2 rounded-sm bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all"
              aria-label="Close cart"
              id="close-cart-btn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Glass Card */}
          <div className="px-6 py-3.5 bg-[#F8F4EA]/90 backdrop-blur-md border-b border-[#0B3D2E]/10">
            <div className="flex items-center justify-between text-xs mb-1.5">
              {remainingForFreeShipping === 0 ? (
                <p className="font-bold text-[#0B3D2E] flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#C99A2E]" />
                  <span>Free Standard Shipping Unlocked!</span>
                </p>
              ) : (
                <p className="text-xs text-[#0B3D2E]/80">
                  Add <strong className="text-[#0B3D2E] font-bold">₹{remainingForFreeShipping.toFixed(0)}</strong> for <strong className="text-[#C99A2E] font-bold">FREE Shipping</strong>
                </p>
              )}
              <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">
                Goal: ₹{freeShippingThreshold}
              </span>
            </div>
            <div className="w-full bg-gray-200/80 h-2 rounded-sm overflow-hidden p-0.5 border border-[#0B3D2E]/10">
              <div
                className="bg-gradient-to-r from-[#0B3D2E] via-[#C99A2E] to-[#FFDF78] h-full rounded-sm transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List or Empty State */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-18 h-18 rounded-full bg-[#F8F4EA] border-2 border-dashed border-[#0B3D2E]/20 flex items-center justify-center mb-4 text-[#0B3D2E] shadow-sm">
                  <ShoppingBag className="w-8 h-8 text-[#C99A2E]" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C99A2E] mb-1 block">
                  Empty Basket
                </span>
                <h3 className="serif font-bold text-xl text-[#0B3D2E] mb-2">
                  Your Basket is Empty
                </h3>
                <p className="text-xs text-[#0B3D2E]/70 max-w-xs mb-6 font-serif-sub italic">
                  Our stewards are gathering farm-fresh produce and handcrafted blessings. Explore the harvest catalog to begin.
                </p>
                <button
                  onClick={() => {
                    closeCartDrawer();
                    onNavigate('shop');
                  }}
                  className="px-6 py-2.5 bg-[#C99A2E] hover:bg-[#0B3D2E] text-[#0B3D2E] hover:text-[#FFDF78] font-bold uppercase tracking-widest text-[11px] rounded-sm shadow-md transition-all transform hover:-translate-y-0.5"
                  id="empty-cart-explore-btn"
                >
                  Explore Harvest Store
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3.5 rounded-lg bg-white/90 backdrop-blur-md border border-[#0B3D2E]/10 shadow-xs hover:border-[#C99A2E]/40 transition-all"
                  id={`cart-item-${item.id}`}
                >
                  <img
                    src={item.product.product_image || '/placeholder-harvest.jpg'}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-sm object-cover border border-[#0B3D2E]/10 bg-[#F8F4EA] shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div className="truncate pr-1">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-[#C99A2E] block">
                          {item.product.unit || 'Farm Fresh'}
                        </span>
                        <h4 className="serif font-bold text-sm text-[#0B3D2E] leading-snug truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 truncate">
                          ₹{item.unit_price} each
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                        aria-label="Remove item"
                        title="Remove from basket"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center border border-[#0B3D2E]/20 rounded-sm bg-[#F8F4EA]">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-1 text-[#0B3D2E] hover:bg-[#0B3D2E]/10 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#0B3D2E] min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="p-1 text-[#0B3D2E] hover:bg-[#0B3D2E]/10 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="serif font-bold text-sm text-[#0B3D2E]">
                        ₹{(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Itemized Price Breakdown & Glassmorphic Checkout */}
          {cart.length > 0 && (
            <div className="p-5 bg-white/95 backdrop-blur-xl border-t border-[#0B3D2E]/15 space-y-3.5 shadow-lg">
              {/* Coupon Code Section */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5" id="cart-coupon-form">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#C99A2E]" />
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      placeholder="PROMO CODE (e.g. GRACE10)"
                      className="w-full pl-8 pr-3 py-2 text-xs uppercase font-medium bg-[#F8F4EA] border border-[#0B3D2E]/15 rounded-sm focus:outline-none focus:border-[#C99A2E] text-[#0B3D2E]"
                      id="cart-coupon-input"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0B3D2E] text-xs font-bold uppercase tracking-wider text-white rounded-sm hover:bg-[#063B2D] transition-colors"
                    id="cart-apply-coupon-btn"
                  >
                    Apply
                  </button>
                </div>

                {couponCode && (
                  <div className="flex items-center justify-between text-[11px] text-green-800 bg-green-50/90 border border-green-200 px-3 py-1.5 rounded-sm">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      Promo Applied: <strong>{couponCode}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-red-600 hover:underline font-bold text-[10px] uppercase tracking-wider"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {couponFeedback && !couponCode && (
                  <p className={`text-[11px] px-1 ${couponFeedback.isError ? 'text-red-500 font-medium' : 'text-green-600 font-medium'}`}>
                    {couponFeedback.msg}
                  </p>
                )}
              </form>

              {/* Comprehensive Itemized Price Calculations */}
              <div className="space-y-2 text-xs bg-[#F8F4EA]/80 backdrop-blur-sm p-3.5 rounded-lg border border-[#0B3D2E]/10">
                <div className="flex justify-between items-center text-[#0B3D2E]/80">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-[#0B3D2E]">₹{subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center text-green-700 font-medium">
                    <span className="flex items-center gap-1">
                      <span>Promo Discount</span>
                      {couponCode && <span className="text-[10px] bg-green-100 px-1 rounded">({couponCode})</span>}
                    </span>
                    <span className="font-bold">-₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-[#0B3D2E]/80">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#C99A2E]" />
                    <span>Estimated Shipping</span>
                  </span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-green-700 font-bold uppercase tracking-wide text-[10px] bg-green-100/80 px-1.5 py-0.5 rounded-sm">
                        FREE
                      </span>
                    ) : (
                      <span className="font-semibold text-[#0B3D2E]">₹{shippingFee.toFixed(2)}</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[#0B3D2E]/80">
                  <span>Estimated GST (5%)</span>
                  <span className="font-semibold text-[#0B3D2E]">₹{tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-sm font-bold text-[#0B3D2E] border-t border-[#0B3D2E]/15 pt-2.5">
                  <div>
                    <span className="serif text-base font-bold">Total Amount</span>
                    <span className="block text-[10px] text-[#0B3D2E]/60 font-normal">Includes taxes & shipping</span>
                  </div>
                  <span className="serif text-lg font-black text-[#0B3D2E] gold-gradient-text">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-wider text-[#0B3D2E]/60 pt-0.5">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#C99A2E]" /> 100% Pure Goods
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#C99A2E]" /> 256-Bit Razorpay
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    closeCartDrawer();
                    onNavigate('checkout');
                  }}
                  className="w-full py-3.5 bg-[#C99A2E] hover:bg-[#0B3D2E] text-[#0B3D2E] hover:text-[#FFDF78] font-bold uppercase tracking-widest text-xs rounded-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                  id="cart-drawer-checkout-btn"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    closeCartDrawer();
                    onNavigate('cart');
                  }}
                  className="w-full py-2 text-xs uppercase tracking-wider font-semibold text-[#0B3D2E]/70 hover:text-[#0B3D2E] hover:underline text-center transition-colors"
                  id="cart-drawer-view-full-btn"
                >
                  View Full Cart Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

