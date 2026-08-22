import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  ShoppingBag,
  CheckCircle2,
  Truck,
  CreditCard,
  Tag,
  Info,
  Sparkles,
  ArrowRight,
  Package,
  Clock,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { razorpayService } from '../services/razorpay/razorpayService';
import { orderService } from '../services/supabase/supabaseClient';
import { Order, ShippingAddress } from '../types';

interface CheckoutPageProps {
  onNavigate: (page: string, params?: any) => void;
}

const INDIAN_STATES = [
  'Tamil Nadu',
  'Karnataka',
  'Kerala',
  'Andhra Pradesh',
  'Telangana',
  'Maharashtra',
  'Delhi',
  'Gujarat',
  'Rajasthan',
  'West Bengal',
  'Uttar Pradesh',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Goa',
  'Odisha',
  'Bihar',
  'Assam',
  'Other',
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const {
    cart,
    subtotal: contextSubtotal,
    discount: contextDiscount,
    couponCode: contextCouponCode,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();
  const { user } = useAuth();

  // Shipping details state
  const [address, setAddress] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    streetAddress: '',
    city: '',
    state: 'Tamil Nadu',
    postalCode: '',
    country: 'India',
  });

  // Shipping Method Selection: 'standard' or 'express'
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Interactive Coupon Input on Checkout page
  const [inputCoupon, setInputCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ msg: string; isError: boolean } | null>(null);

  // UI state
  const [showTaxDetails, setShowTaxDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // ============================================================================
  // COMPREHENSIVE CALCULATION ENGINE
  // ============================================================================
  const calculations = useMemo(() => {
    // 1. Items Subtotal
    const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

    // 2. Discount Calculation based on Active Coupon
    let discount = 0;
    const activeCoupon = (contextCouponCode || '').trim().toUpperCase();
    if (activeCoupon === 'GRACE10' || activeCoupon === 'HARVEST10') {
      discount = subtotal * 0.1;
    } else if (activeCoupon === 'FIRSTHARVEST') {
      discount = subtotal * 0.15;
    }

    const netTaxableAmount = Math.max(0, subtotal - discount);

    // 3. Shipping Calculation Logic
    const freeShippingThreshold = 1000;
    const isFreeStandardUnlocked = subtotal >= freeShippingThreshold || activeCoupon === 'FIRSTHARVEST';
    const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

    let shippingFee = 0;
    if (shippingMethod === 'standard') {
      shippingFee = isFreeStandardUnlocked || cart.length === 0 ? 0 : 50;
    } else if (shippingMethod === 'express') {
      // Express Delivery is ₹120 normally, or reduced to ₹70 if free shipping threshold is met
      shippingFee = isFreeStandardUnlocked ? 70 : 120;
    }

    // 4. Tax (GST) Calculation Logic (Standard Agricultural Rate: 5%)
    const gstRate = 0.05;
    const totalTax = Math.round(netTaxableAmount * gstRate * 100) / 100;

    // Intra-state (Tamil Nadu) vs Inter-state (Other States) breakdown
    const isIntraState = address.state.trim().toLowerCase() === 'tamil nadu';
    const cgst = isIntraState ? Math.round((totalTax / 2) * 100) / 100 : 0;
    const sgst = isIntraState ? Math.round((totalTax / 2) * 100) / 100 : 0;
    const igst = !isIntraState ? totalTax : 0;

    // 5. Grand Total Due
    const total = Math.max(0, Math.round(netTaxableAmount + shippingFee + totalTax));

    return {
      itemsCount,
      subtotal,
      discount,
      activeCoupon,
      netTaxableAmount,
      freeShippingThreshold,
      isFreeStandardUnlocked,
      remainingForFreeShipping,
      shippingFee,
      totalTax,
      isIntraState,
      cgst,
      sgst,
      igst,
      total,
    };
  }, [cart, contextCouponCode, shippingMethod, address.state]);

  const handleApplyCouponCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const result = applyCoupon(inputCoupon.trim());
    setCouponFeedback({
      msg: result.message,
      isError: !result.success,
    });
    if (result.success) {
      setInputCoupon('');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponFeedback(null);
  };

  // ============================================================================
  // ORDER SUBMISSION & RAZORPAY PAYMENT INITIATION
  // ============================================================================
  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (
      !address.fullName.trim() ||
      !address.email.trim() ||
      !address.phone.trim() ||
      !address.streetAddress.trim() ||
      !address.postalCode.trim() ||
      !address.city.trim()
    ) {
      setErrorMsg('Please fill in all required delivery address fields marked with (*).');
      return;
    }

    setIsProcessing(true);

    const generatedOrderId = `EBH-${Date.now().toString().slice(-6)}`;
    const formattedShippingAddress: ShippingAddress = {
      full_name: address.fullName.trim(),
      phone: address.phone.trim(),
      street_address: address.streetAddress.trim(),
      city: address.city.trim(),
      state: address.state,
      postal_code: address.postalCode.trim(),
      country: address.country,
    };

    try {
      await razorpayService.initiatePayment(
        {
          orderId: generatedOrderId,
          items: cart.map((c) => ({
            productId: c.product_id,
            quantity: c.quantity,
            price: c.unit_price,
            unit_price: c.unit_price,
            name: c.product.name,
          })),
          shippingAddress: {
            fullName: address.fullName.trim(),
            email: address.email.trim(),
            phone: address.phone.trim(),
            streetAddress: address.streetAddress.trim(),
            city: address.city.trim(),
            state: address.state,
            postalCode: address.postalCode.trim(),
            country: address.country,
          },
          shippingMethod,
          couponCode: calculations.activeCoupon || undefined,
        },
        async (paymentRes) => {
          // Success callback: save confirmed order in database
          const orderPayload = {
            user_id: user?.id || 'guest-checkout',
            items: cart.map((c) => ({
              product_id: c.product_id,
              product_name: c.product.name,
              product_image: c.product.product_image,
              quantity: c.quantity,
              unit_price: c.unit_price,
              total_price: c.unit_price * c.quantity,
            })),
            subtotal: calculations.subtotal,
            discount: calculations.discount,
            shipping_fee: calculations.shippingFee,
            tax: calculations.totalTax,
            total_amount: calculations.total,
            shipping_address: formattedShippingAddress,
            status: 'confirmed' as const,
            payment_status: 'paid' as const,
            payment_method: 'razorpay',
            razorpay_order_id: paymentRes.orderId,
            razorpay_payment_id: paymentRes.paymentId,
          };

          const savedOrder = await orderService.createOrder(orderPayload);
          clearCart();
          setCompletedOrder(savedOrder);
          setIsProcessing(false);
        },
        (error) => {
          setErrorMsg(error || 'Payment was cancelled or could not be completed.');
          setIsProcessing(false);
        }
      );
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment initiation failed.');
      setIsProcessing(false);
    }
  };

  // ============================================================================
  // ORDER CONFIRMATION VIEW
  // ============================================================================
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6" id="order-confirmed-view">
        <div className="w-20 h-20 rounded-full bg-[#0B3D2E] text-[#FFDF78] border-4 border-[#C99A2E]/40 flex items-center justify-center mx-auto shadow-xl">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-bold text-[#C99A2E] tracking-[0.3em]">
            BLESSINGS & GRATITUDE
          </span>
          <h1 className="serif font-bold text-3xl sm:text-4xl text-[#0B3D2E]">
            Harvest Order Confirmed!
          </h1>
          <p className="text-sm text-[#0B3D2E]/80 font-serif-sub italic max-w-md mx-auto">
            Thank you for supporting our agricultural stewards. Your harvest basket has been recorded and is being prepared with grace.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-lg border border-[#0B3D2E]/15 shadow-sm text-left max-w-xl mx-auto space-y-5">
          <div className="flex justify-between pb-4 border-b border-[#0B3D2E]/10 text-xs">
            <div>
              <span className="text-[#0B3D2E]/60 font-bold uppercase tracking-wider block">Order Reference</span>
              <p className="font-bold text-base text-[#0B3D2E] serif">{completedOrder.order_number}</p>
            </div>
            <div className="text-right">
              <span className="text-[#0B3D2E]/60 font-bold uppercase tracking-wider block">Total Paid (Razorpay)</span>
              <p className="serif font-bold text-base text-[#0B3D2E]">₹{completedOrder.total_amount.toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-[#0B3D2E] uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#C99A2E]" /> Delivery Address
            </h4>
            <div className="bg-[#F8F4EA] p-3.5 rounded-sm border border-[#0B3D2E]/10 space-y-0.5 text-[#0B3D2E]/90">
              <p className="font-bold text-sm text-[#0B3D2E]">{completedOrder.shipping_address.full_name}</p>
              <p>{completedOrder.shipping_address.street_address}</p>
              <p>
                {completedOrder.shipping_address.city}, {completedOrder.shipping_address.state} -{' '}
                <span className="font-semibold">{completedOrder.shipping_address.postal_code}</span>
              </p>
              <p className="text-[11px] text-gray-500 pt-1">Phone: {completedOrder.shipping_address.phone}</p>
            </div>
          </div>

          <div className="p-3 bg-green-50/80 border border-green-200 rounded-sm text-xs text-green-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
            <span>Tax Invoice (GST compliant) and live parcel tracking link will be sent to your email.</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('account')}
            className="px-6 py-3 bg-[#0B3D2E] hover:bg-[#063B2D] text-[#FFDF78] font-bold uppercase tracking-widest text-xs rounded-sm shadow-md transition-all"
            id="order-view-account-btn"
          >
            View My Orders
          </button>
          <button
            onClick={() => onNavigate('shop')}
            className="px-6 py-3 bg-white hover:bg-[#F8F4EA] border border-[#0B3D2E]/20 text-[#0B3D2E] font-bold uppercase tracking-widest text-xs rounded-sm transition-all"
            id="order-continue-browsing-btn"
          >
            Continue Browsing Store
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // EMPTY CART VIEW
  // ============================================================================
  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4 px-4" id="empty-checkout-view">
        <div className="w-16 h-16 rounded-full bg-[#F8F4EA] border-2 border-dashed border-[#0B3D2E]/20 flex items-center justify-center mx-auto text-[#C99A2E]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#C99A2E] block">
          HARVEST BASKET
        </span>
        <h2 className="serif font-bold text-2xl text-[#0B3D2E]">Your Harvest Basket is Empty</h2>
        <p className="text-xs text-[#0B3D2E]/70 font-serif-sub italic">
          Please add farm goods and blessings to your cart before proceeding with checkout.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 bg-[#C99A2E] hover:bg-[#0B3D2E] text-[#0B3D2E] hover:text-[#FFDF78] font-bold uppercase tracking-widest text-xs rounded-sm shadow-md transition-all"
          id="checkout-return-shop-btn"
        >
          Return to Harvest Store
        </button>
      </div>
    );
  }

  // ============================================================================
  // MAIN CHECKOUT FORM & SUMMARY VIEW
  // ============================================================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="checkout-page-container">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="text-[11px] uppercase tracking-[0.35em] font-bold text-[#C99A2E]">
          SECURE DISPATCH & VERIFIED CHECKOUT
        </span>
        <h1 className="serif font-bold text-3xl sm:text-4xl text-[#0B3D2E]">
          Harvest Checkout
        </h1>
        <div className="w-16 h-0.5 bg-[#C99A2E] mx-auto my-2" />
        <p className="text-xs text-[#0B3D2E]/75 font-serif-sub italic">
          Review your delivery details, shipping rates, and tax calculations before proceeding to the Razorpay payment gateway.
        </p>
      </div>

      <form onSubmit={handlePay} className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="checkout-main-form">
        {/* ===================================================================== */}
        {/* LEFT COLUMN: DELIVERY INFORMATION & SHIPPING OPTIONS (7 COLS)          */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Delivery Address Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-lg p-6 sm:p-7 border border-[#0B3D2E]/15 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#0B3D2E]/10 pb-3">
              <h3 className="serif font-bold text-base text-[#0B3D2E] flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-sm bg-[#0B3D2E] text-[#FFDF78] flex items-center justify-center text-xs font-bold">
                  1
                </div>
                Delivery Address & Contact
              </h3>
              <span className="text-[11px] text-[#0B3D2E]/60 font-medium">* Required fields</span>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-start gap-2">
                <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#0B3D2E] uppercase tracking-wider mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  placeholder="e.g. Johnathan Miller"
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EA] border border-[#0B3D2E]/15 rounded-sm text-xs sm:text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E] focus:bg-white transition-colors"
                  id="checkout-fullname-input"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0B3D2E] uppercase tracking-wider mb-1">
                  Email Address (For Invoicing) *
                </label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EA] border border-[#0B3D2E]/15 rounded-sm text-xs sm:text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E] focus:bg-white transition-colors"
                  id="checkout-email-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#0B3D2E] uppercase tracking-wider mb-1">
                  Mobile Phone (For Delivery OTP) *
                </label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EA] border border-[#0B3D2E]/15 rounded-sm text-xs sm:text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E] focus:bg-white transition-colors"
                  id="checkout-phone-input"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0B3D2E] uppercase tracking-wider mb-1">
                  Postal PIN Code *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  placeholder="e.g. 643001"
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EA] border border-[#0B3D2E]/15 rounded-sm text-xs sm:text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E] focus:bg-white transition-colors font-mono"
                  id="checkout-pincode-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#0B3D2E] uppercase tracking-wider mb-1">
                Street Address / House No. / Landmark *
              </label>
              <input
                type="text"
                required
                value={address.streetAddress}
                onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                placeholder="Door No., Street Name, Locality, Landmark"
                className="w-full px-3.5 py-2.5 bg-[#F8F4EA] border border-[#0B3D2E]/15 rounded-sm text-xs sm:text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E] focus:bg-white transition-colors"
                id="checkout-street-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#0B3D2E] uppercase tracking-wider mb-1">
                  City / Town *
                </label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="e.g. Ooty / Nilgiris"
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EA] border border-[#0B3D2E]/15 rounded-sm text-xs sm:text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E] focus:bg-white transition-colors"
                  id="checkout-city-input"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0B3D2E] uppercase tracking-wider mb-1">
                  State / Region *
                </label>
                <select
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EA] border border-[#0B3D2E]/15 rounded-sm text-xs sm:text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E] focus:bg-white transition-colors"
                  id="checkout-state-select"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st} {st === 'Tamil Nadu' ? '(Local Nilgiris Farm Zone)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Shipping Method Selection Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-lg p-6 sm:p-7 border border-[#0B3D2E]/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#0B3D2E]/10 pb-3">
              <h3 className="serif font-bold text-base text-[#0B3D2E] flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-sm bg-[#0B3D2E] text-[#FFDF78] flex items-center justify-center text-xs font-bold">
                  2
                </div>
                Select Shipping Method
              </h3>
              {calculations.isFreeStandardUnlocked && (
                <span className="bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-green-600" /> Free Shipping Qualified
                </span>
              )}
            </div>

            {/* Free Shipping Milestone Alert */}
            {!calculations.isFreeStandardUnlocked && (
              <div className="p-3 bg-[#F8F4EA] border border-[#C99A2E]/40 rounded-sm text-xs text-[#0B3D2E] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#C99A2E]" />
                  <span>
                    Add <strong>₹{calculations.remainingForFreeShipping.toFixed(0)}</strong> more to get{' '}
                    <strong className="text-[#0B3D2E]">FREE Standard Shipping</strong>!
                  </span>
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-500">Threshold: ₹1,000</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* Option A: Standard Farm Direct */}
              <label
                onClick={() => setShippingMethod('standard')}
                className={`relative flex flex-col justify-between p-4 rounded-sm border-2 cursor-pointer transition-all ${
                  shippingMethod === 'standard'
                    ? 'border-[#0B3D2E] bg-[#F8F4EA]/80 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                id="shipping-option-standard"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="accent-[#0B3D2E] w-4 h-4"
                    />
                    <span className="font-bold text-xs uppercase tracking-wider text-[#0B3D2E]">
                      Standard Farm-Direct
                    </span>
                  </div>
                  <span className="serif font-bold text-sm text-[#0B3D2E]">
                    {calculations.isFreeStandardUnlocked ? (
                      <span className="text-green-700 font-extrabold uppercase text-xs">FREE</span>
                    ) : (
                      '₹50.00'
                    )}
                  </span>
                </div>
                <div className="mt-2.5 text-[11px] text-[#0B3D2E]/70 space-y-1 pl-6">
                  <p className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#C99A2E]" /> 3–5 Business Days
                  </p>
                  <p>Eco-friendly paper carton packaging.</p>
                </div>
              </label>

              {/* Option B: Express Priority Harvest */}
              <label
                onClick={() => setShippingMethod('express')}
                className={`relative flex flex-col justify-between p-4 rounded-sm border-2 cursor-pointer transition-all ${
                  shippingMethod === 'express'
                    ? 'border-[#0B3D2E] bg-[#F8F4EA]/80 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                id="shipping-option-express"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="accent-[#0B3D2E] w-4 h-4"
                    />
                    <span className="font-bold text-xs uppercase tracking-wider text-[#0B3D2E]">
                      Express Harvest Priority
                    </span>
                  </div>
                  <span className="serif font-bold text-sm text-[#0B3D2E]">
                    {calculations.isFreeStandardUnlocked ? '₹70.00' : '₹120.00'}
                  </span>
                </div>
                <div className="mt-2.5 text-[11px] text-[#0B3D2E]/70 space-y-1 pl-6">
                  <p className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#C99A2E]" /> 1–2 Business Days
                  </p>
                  <p>Cold-chain insulated packing & priority dispatch.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Trust & Guarantee Banner */}
          <div className="bg-[#FCFAF5] p-4.5 rounded-lg border border-[#C99A2E]/30 flex items-center justify-between text-xs text-[#0B3D2E]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-[#C99A2E]/20 border border-[#C99A2E]/40 flex items-center justify-center text-[#0B3D2E] shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#C99A2E]" />
              </div>
              <div>
                <p className="font-bold text-[#0B3D2E]">100% Genuine Agricultural Guarantee</p>
                <p className="text-[11px] text-[#0B3D2E]/70">
                  Every product is sourced directly from certified organic groves and hand-packed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: DETAILED ORDER & TAX/SHIPPING SUMMARY (5 COLS)           */}
        {/* ===================================================================== */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white/95 backdrop-blur-md rounded-lg p-6 border border-[#0B3D2E]/15 shadow-md space-y-5 sticky top-24">
            {/* Summary Title */}
            <div className="flex items-center justify-between border-b border-[#0B3D2E]/10 pb-3">
              <h3 className="serif font-bold text-base text-[#0B3D2E] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#C99A2E]" />
                Harvest Order Summary
              </h3>
              <span className="bg-[#F8F4EA] border border-[#0B3D2E]/10 text-[#0B3D2E] text-[11px] font-bold px-2 py-0.5 rounded-sm">
                {calculations.itemsCount} {calculations.itemsCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Cart Items List */}
            <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1 divide-y divide-gray-100">
              {cart.map((item) => (
                <div key={item.id} className="pt-2 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.product_image || '/placeholder-harvest.jpg'}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-sm object-cover border border-[#0B3D2E]/10 bg-[#F8F4EA] shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-[#0B3D2E] truncate">{item.product.name}</p>
                      <p className="text-[10px] text-gray-500">
                        Qty: {item.quantity} × ₹{item.unit_price} ({item.product.unit || 'unit'})
                      </p>
                    </div>
                  </div>
                  <span className="serif font-bold text-[#0B3D2E] shrink-0">
                    ₹{(item.unit_price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="border-t border-[#0B3D2E]/10 pt-3">
              <form onSubmit={handleApplyCouponCode} className="space-y-1.5" id="checkout-coupon-form">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#C99A2E]" />
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      placeholder="PROMO CODE (e.g. GRACE10)"
                      className="w-full pl-8 pr-3 py-2 text-xs uppercase font-medium bg-[#F8F4EA] border border-[#0B3D2E]/15 rounded-sm focus:outline-none focus:border-[#C99A2E] text-[#0B3D2E]"
                      id="checkout-coupon-input"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#0B3D2E] hover:bg-[#063B2D] text-xs font-bold uppercase tracking-wider text-white rounded-sm transition-colors"
                    id="checkout-apply-coupon-btn"
                  >
                    Apply
                  </button>
                </div>

                {calculations.activeCoupon && (
                  <div className="flex items-center justify-between text-[11px] text-green-800 bg-green-50 border border-green-200 px-3 py-1.5 rounded-sm">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      Applied: <strong>{calculations.activeCoupon}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-red-600 hover:underline font-bold text-[10px] uppercase tracking-wider"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {couponFeedback && !calculations.activeCoupon && (
                  <p className={`text-[11px] px-1 ${couponFeedback.isError ? 'text-red-500 font-medium' : 'text-green-600 font-medium'}`}>
                    {couponFeedback.msg}
                  </p>
                )}
              </form>
            </div>

            {/* Clear Comprehensive Calculations Breakdown */}
            <div className="bg-[#F8F4EA]/90 backdrop-blur-sm p-4 rounded-lg border border-[#0B3D2E]/10 space-y-2.5 text-xs text-[#0B3D2E]">
              <div className="flex justify-between items-center text-[#0B3D2E]/80">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#0B3D2E]">₹{calculations.subtotal.toFixed(2)}</span>
              </div>

              {calculations.discount > 0 && (
                <div className="flex justify-between items-center text-green-700 font-semibold">
                  <span className="flex items-center gap-1">
                    <span>Promotional Discount</span>
                    {calculations.activeCoupon && (
                      <span className="text-[10px] bg-green-100 text-green-800 px-1 py-0.2 rounded">
                        ({calculations.activeCoupon})
                      </span>
                    )}
                  </span>
                  <span>-₹{calculations.discount.toFixed(2)}</span>
                </div>
              )}

              {/* Shipping Line Item */}
              <div className="flex justify-between items-center text-[#0B3D2E]/80">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#C99A2E]" />
                  <span>
                    Shipping ({shippingMethod === 'standard' ? 'Standard' : 'Express'})
                  </span>
                </span>
                <span>
                  {calculations.shippingFee === 0 ? (
                    <span className="bg-green-100 text-green-800 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm">
                      FREE
                    </span>
                  ) : (
                    <span className="font-semibold text-[#0B3D2E]">₹{calculations.shippingFee.toFixed(2)}</span>
                  )}
                </span>
              </div>

              {/* Tax (GST) Calculation Line Item with Disclosure Toggle */}
              <div className="pt-1">
                <div className="flex justify-between items-center text-[#0B3D2E]/80">
                  <button
                    type="button"
                    onClick={() => setShowTaxDetails(!showTaxDetails)}
                    className="flex items-center gap-1 hover:text-[#C99A2E] text-left transition-colors"
                  >
                    <span>Goods & Services Tax (GST 5%)</span>
                    <HelpCircle className="w-3 h-3 text-[#C99A2E]" />
                  </button>
                  <span className="font-semibold text-[#0B3D2E]">₹{calculations.totalTax.toFixed(2)}</span>
                </div>

                {/* Detailed Tax Breakdown Popover/Accordion */}
                {showTaxDetails && (
                  <div className="mt-2 p-2.5 bg-white rounded-sm border border-[#0B3D2E]/10 text-[11px] space-y-1 text-gray-600 animate-in fade-in duration-150">
                    <div className="flex justify-between font-medium">
                      <span>Net Taxable Value:</span>
                      <span>₹{calculations.netTaxableAmount.toFixed(2)}</span>
                    </div>
                    {calculations.isIntraState ? (
                      <>
                        <div className="flex justify-between text-gray-500">
                          <span>• Central GST (CGST 2.5%):</span>
                          <span>₹{calculations.cgst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>• State GST (SGST 2.5%):</span>
                          <span>₹{calculations.sgst.toFixed(2)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between text-gray-500">
                        <span>• Integrated GST (IGST 5.0%):</span>
                        <span>₹{calculations.igst.toFixed(2)}</span>
                      </div>
                    )}
                    <p className="text-[10px] text-gray-400 pt-1 border-t border-gray-100 italic">
                      Standard agricultural tax schedule applied for destination: {address.state}.
                    </p>
                  </div>
                )}
              </div>

              {/* Grand Total Amount Due */}
              <div className="border-t border-[#0B3D2E]/15 pt-3 flex justify-between items-center">
                <div>
                  <span className="serif text-base font-bold text-[#0B3D2E]">Grand Total</span>
                  <span className="block text-[10px] text-[#0B3D2E]/60">All taxes & shipping included</span>
                </div>
                <span className="serif text-xl font-black text-[#0B3D2E] gold-gradient-text">
                  ₹{calculations.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Gateway Trust Indicator */}
            <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-wider text-[#0B3D2E]/70 py-1">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#C99A2E]" /> Razorpay 256-bit Secure
              </span>
              <span>•</span>
              <span>UPI / Cards / NetBanking</span>
            </div>

            {/* Submit & Proceed to Razorpay Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-[#C99A2E] hover:bg-[#0B3D2E] text-[#0B3D2E] hover:text-[#FFDF78] font-bold uppercase tracking-widest text-xs rounded-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              id="checkout-pay-razorpay-btn"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Connecting Secure Gateway...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>PROCEED TO PAY ₹{calculations.total.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-[#0B3D2E]/60">
              By placing this order you agree to Ebinesar Harvest's Terms of Stewardship and Return Policy.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
