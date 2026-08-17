import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
  onToast: (msg: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
  onToast,
}) => {
  const { cart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || 'Tamil Nadu',
    pincode: user?.address?.pincode || '',
    paymentMethod: 'razorpay' as 'razorpay' | 'cod',
    deliveryNotes: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  if (!isOpen) return null;

  const shippingFee = totalAmount >= 999 || totalAmount === 0 ? 0 : 80;
  const finalTotal = Math.max(0, totalAmount + shippingFee - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'HARVEST10') {
      const discount = Math.round(totalAmount * 0.1);
      setDiscountAmount(discount);
      setCouponApplied(true);
      onToast('Harvest Blessing Coupon HARVEST10 Applied (10% Off)!');
    } else if (couponCode.toUpperCase() === 'FIRSTHARVEST') {
      setDiscountAmount(100);
      setCouponApplied(true);
      onToast('Coupon FIRSTHARVEST Applied (₹100 Off)!');
    } else {
      onToast('Invalid coupon code. Try "HARVEST10" or "FIRSTHARVEST"');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      onToast('Please fill out all required delivery fields.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create order on server
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            product_id: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            image: item.product.images[0] || '',
          })),
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: {
              street: formData.address,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
            },
          },
          payment_method: formData.paymentMethod,
          discount: discountAmount,
          shipping: shippingFee,
          delivery_notes: formData.deliveryNotes,
          user_id: user?.id || null,
        }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to create harvest order');
      }

      // If Razorpay simulation or real integration
      if (formData.paymentMethod === 'razorpay') {
        // Complete checkout
        await fetch('/api/orders/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: orderData.id,
            razorpay_payment_id: 'pay_sim_' + Math.random().toString(36).substring(7),
            status: 'paid',
          }),
        });
      }

      clearCart();
      setIsProcessing(false);
      onOrderSuccess(orderData.id);
      onToast(`Blessed order #${orderData.id} placed successfully!`);
    } catch (err: unknown) {
      setIsProcessing(false);
      const errorMessage = err instanceof Error ? err.message : 'Checkout encountered an error';
      onToast(errorMessage);
    }
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="checkout-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E2DCC8] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-[#E2DCC8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2D4F2D] rounded-full flex items-center justify-center text-[#D4AF37]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#1A2F1A]">Secure Harvest Checkout</h2>
              <p className="text-[11px] text-[#6B7C6B]">Encrypted pan-India agricultural dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200 text-[#1A2F1A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Customer & Address Details */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="font-serif font-bold text-[#1A2F1A] text-sm flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#2D4F2D]" /> 1. Shipping & Customer Details
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#1A2F1A] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.g., Jonathan Ebinesar"
                    className="w-full px-3 py-2 bg-white border border-[#E2DCC8] rounded-xl text-xs focus:outline-[#2D4F2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A2F1A] mb-1">Phone (for OTP & Delivery) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 bg-white border border-[#E2DCC8] rounded-xl text-xs focus:outline-[#2D4F2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A2F1A] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="farmer@example.com"
                    className="w-full px-3 py-2 bg-white border border-[#E2DCC8] rounded-xl text-xs focus:outline-[#2D4F2D]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#1A2F1A] mb-1">Street Address / House / Landmark *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House/Plot No., Street, Colony"
                    className="w-full px-3 py-2 bg-white border border-[#E2DCC8] rounded-xl text-xs focus:outline-[#2D4F2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A2F1A] mb-1">City / District *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Chennai / Madurai / Coimbatore"
                    className="w-full px-3 py-2 bg-white border border-[#E2DCC8] rounded-xl text-xs focus:outline-[#2D4F2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A2F1A] mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="600001"
                    className="w-full px-3 py-2 bg-white border border-[#E2DCC8] rounded-xl text-xs focus:outline-[#2D4F2D]"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2">
                <h3 className="font-serif font-bold text-[#1A2F1A] text-sm flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-[#D4AF37]" /> 2. Payment Method
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`p-3 rounded-2xl border flex flex-col gap-1 cursor-pointer transition-all ${
                      formData.paymentMethod === 'razorpay'
                        ? 'border-[#2D4F2D] bg-[#E9F0E9] shadow-xs'
                        : 'border-[#E2DCC8] bg-white hover:border-[#2D4F2D]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1A2F1A]">Online Payment</span>
                      <input
                        type="radio"
                        name="payment"
                        checked={formData.paymentMethod === 'razorpay'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'razorpay' })}
                        className="accent-[#2D4F2D]"
                      />
                    </div>
                    <span className="text-[10px] text-[#6B7C6B]">UPI, GPay, PhonePe, Cards, Netbanking</span>
                  </label>

                  <label
                    className={`p-3 rounded-2xl border flex flex-col gap-1 cursor-pointer transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-[#2D4F2D] bg-[#E9F0E9] shadow-xs'
                        : 'border-[#E2DCC8] bg-white hover:border-[#2D4F2D]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1A2F1A]">Cash on Delivery</span>
                      <input
                        type="radio"
                        name="payment"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                        className="accent-[#2D4F2D]"
                      />
                    </div>
                    <span className="text-[10px] text-[#6B7C6B]">Pay cash upon arrival at door</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary & Coupon */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#E2DCC8] space-y-3">
                <h4 className="font-serif font-bold text-xs text-[#1A2F1A] border-b border-[#E2DCC8] pb-2">
                  Basket Summary ({cart.length} unique items)
                </h4>

                <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-xs items-center">
                      <span className="truncate max-w-[140px] text-[#1A2F1A] font-medium">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="font-bold text-[#2D4F2D]">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon input */}
                <div className="pt-2 border-t border-[#E2DCC8]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo: HARVEST10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={couponApplied}
                      className="flex-1 px-3 py-1.5 bg-[#FAF8F5] border border-[#E2DCC8] rounded-xl text-xs uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponApplied || !couponCode}
                      className="px-3 py-1.5 bg-[#2D4F2D] text-white rounded-xl text-xs font-bold hover:bg-[#1E3A1E] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponApplied && (
                    <span className="text-[10px] text-[#2D4F2D] font-bold flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3 h-3" /> Harvest discount applied!
                    </span>
                  )}
                </div>

                {/* Calculation */}
                <div className="space-y-1.5 text-xs text-[#4A5D4A] pt-2 border-t border-[#E2DCC8]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-[#1A2F1A] font-semibold">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{shippingFee === 0 ? <strong className="text-[#2D4F2D]">FREE</strong> : `₹${shippingFee}`}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#2D4F2D] font-semibold">
                      <span>Discount:</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-extrabold text-[#1A2F1A] pt-2 border-t border-[#E2DCC8]">
                    <span>Total Payable:</span>
                    <span className="text-[#2D4F2D]">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || cart.length === 0}
                className="w-full py-4 bg-[#2D4F2D] hover:bg-[#1E3A1E] text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#2D4F2D]/20 transition-all hover:scale-101 active:scale-99 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <span>Place Order (₹{finalTotal.toLocaleString('en-IN')})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#8B9A8B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Faith-rooted quality guaranteed & hassle-free returns</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
