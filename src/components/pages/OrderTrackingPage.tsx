import React, { useState, useEffect } from 'react';
import { ViewMode, Order } from '../../types';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Mail,
  RotateCcw,
  ShieldCheck,
  ExternalLink,
  Send,
  AlertCircle
} from 'lucide-react';

interface OrderTrackingPageProps {
  onNavigate: (view: ViewMode) => void;
  onToast: (msg: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  onNavigate,
  onToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);

  // Fetch sample or customer orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
          if (data.length > 0) {
            setSelectedOrder(data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const clean = searchQuery.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.order_number.toLowerCase().includes(clean) ||
        o.id.toLowerCase().includes(clean) ||
        o.customer_email.toLowerCase().includes(clean) ||
        (o.tracking_number && o.tracking_number.toLowerCase().includes(clean))
    );

    if (found) {
      setSelectedOrder(found);
      onToast(`Found order ${found.order_number}!`);
    } else {
      onToast('No order matched that Order ID or Email. Showing sample tracking.');
    }
  };

  const handleResendReceipt = async (orderId: string) => {
    try {
      setResendingId(orderId);
      const res = await fetch(`/api/orders/${orderId}/resend-confirmation`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok) {
        onToast(data.message || 'Confirmation email receipt re-sent successfully!');
      } else {
        onToast(data.error || 'Failed to re-send receipt.');
      }
    } catch {
      onToast('Error dispatching email receipt.');
    } finally {
      setResendingId(null);
    }
  };

  // Pipeline stages
  const getStageStatus = (order: Order, stage: 'ordered' | 'paid' | 'packed' | 'shipped' | 'delivered') => {
    const status = order.order_status;
    const stages = ['ordered', 'paid', 'packed', 'shipped', 'delivered'];
    
    let currentIdx = 1;
    if (status === 'pending') currentIdx = 0;
    if (status === 'processing') currentIdx = 2;
    if (status === 'shipped') currentIdx = 3;
    if (status === 'delivered') currentIdx = 4;

    const thisIdx = stages.indexOf(stage);
    if (thisIdx < currentIdx) return 'completed';
    if (thisIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-0 min-h-screen bg-[#F9F7F2]">
      {/* 🚚 SECTION 1: ORDER LOOKUP HEADER */}
      <section className="bg-gradient-to-r from-[#2D4F2D] via-[#1E3A1E] to-[#14281A] text-white py-14 px-6 md:px-12 border-b border-[#1E3A1E]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F5E6AB] text-xs font-bold uppercase tracking-widest border border-[#D4AF37]/30">
            <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
            Live Courier Dispatch & Delivery Status
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#FAF8F5]">
            Track Your Harvest Order
          </h1>
          <p className="text-xs sm:text-sm text-[#D4E9D4] max-w-xl mx-auto">
            Enter your Order Reference Number (e.g. <code>EBN-2026-1001</code>) or Customer Email to check live parcel journey and automated email notifications.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto pt-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order ID or Email (e.g. EBN-2026-1001)..."
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-[#1A2F1A] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#D4AF37] placeholder-stone-400"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#D4AF37] text-[#1A2F1A] text-xs font-bold uppercase tracking-wider hover:bg-[#c49f27] transition-colors cursor-pointer shadow-md shrink-0"
            >
              Track Order
            </button>
          </form>
        </div>
      </section>

      {/* 📦 SECTION 2: LIVE TRACKING & DISPATCH PIPELINE */}
      {selectedOrder ? (
        <section className="px-6 md:px-12 py-12">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Top Order Card */}
            <div className="bg-white rounded-3xl border border-[#E2DCC8] p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DCC8] pb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                    Order Tracking Details
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-[#1A2F1A] flex items-center gap-3 mt-1">
                    <span>{selectedOrder.order_number}</span>
                    <span className="text-xs font-sans font-bold uppercase px-3 py-1 rounded-full bg-[#E9F0E9] text-[#2D4F2D] border border-[#D4E9D4]">
                      {selectedOrder.order_status.replace('_', ' ').toUpperCase()}
                    </span>
                  </h2>
                  <p className="text-xs text-[#6B7C6B] mt-1">
                    Placed on {new Date(selectedOrder.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                {/* Resend Receipt Action */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleResendReceipt(selectedOrder.id)}
                    disabled={resendingId === selectedOrder.id}
                    className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#F4F1EA] text-[#2D4F2D] border border-[#E2DCC8] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{resendingId === selectedOrder.id ? 'Sending...' : 'Resend Email Receipt'}</span>
                  </button>
                </div>
              </div>

              {/* Progress Pipeline */}
              <div className="py-4">
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
                  {[
                    { key: 'ordered', label: 'Order Placed', desc: 'Received online' },
                    { key: 'paid', label: 'Payment Verified', desc: 'Razorpay UPI/Card' },
                    { key: 'packed', label: 'Freshly Packed', desc: 'Insulated farm box' },
                    { key: 'shipped', label: 'Dispatched & In-Transit', desc: selectedOrder.tracking_carrier || 'BlueDart Express' },
                    { key: 'delivered', label: 'Delivered', desc: 'To your doorstep' },
                  ].map((step, idx) => {
                    const status = getStageStatus(selectedOrder, step.key as any);
                    return (
                      <div
                        key={step.key}
                        className={`p-4 rounded-2xl border text-center transition-all ${
                          status === 'completed'
                            ? 'bg-[#E9F0E9] border-[#D4E9D4] text-[#1E3A1E]'
                            : status === 'current'
                            ? 'bg-[#FAF0D7] border-[#D4AF37] text-[#1A2F1A] shadow-xs ring-2 ring-[#D4AF37]/30'
                            : 'bg-[#FDFCF9] border-[#E2DCC8] text-[#8B9A8B] opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-2">
                          {status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-[#2D4F2D]" />
                          ) : status === 'current' ? (
                            <Clock className="w-5 h-5 text-[#D4AF37] animate-pulse" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-[#8B9A8B] flex items-center justify-center text-[10px] font-bold">
                              {idx + 1}
                            </div>
                          )}
                        </div>
                        <div className="font-bold text-xs">{step.label}</div>
                        <div className="text-[10px] mt-1 line-clamp-1">{step.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Tracking Information Card */}
              <div className="bg-[#FAF8F5] rounded-2xl border border-[#E2DCC8] p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[#6B7C6B] block">Courier Partner</span>
                  <strong className="text-[#1A2F1A] font-semibold text-sm">
                    {selectedOrder.tracking_carrier || 'BlueDart Express'}
                  </strong>
                </div>
                <div>
                  <span className="text-[#6B7C6B] block">Waybill / Tracking No.</span>
                  <strong className="font-mono text-sm text-[#2D4F2D]">
                    {selectedOrder.tracking_number || `BLUEDART-IND-${selectedOrder.id.slice(-6).toUpperCase()}`}
                  </strong>
                </div>
                <div>
                  <span className="text-[#6B7C6B] block">Estimated Delivery</span>
                  <strong className="text-[#1A2F1A] font-semibold text-sm">
                    Within 24 to 48 Hours
                  </strong>
                </div>
              </div>
            </div>

            {/* Itemized Order Breakdown & Address */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Items list */}
              <div className="md:col-span-2 bg-white rounded-3xl border border-[#E2DCC8] p-6 space-y-4">
                <h3 className="font-serif font-bold text-base text-[#1A2F1A]">
                  Parcel Contents ({selectedOrder.items.length} items)
                </h3>
                <div className="space-y-3 divide-y divide-[#E2DCC8]">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product_image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=150'}
                          alt={item.product_name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#E2DCC8]"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-[#1A2F1A]">{item.product_name}</h4>
                          <span className="text-[11px] text-[#6B7C6B]">
                            Qty: {item.quantity} • SKU: {item.sku}
                          </span>
                        </div>
                      </div>
                      <div className="font-bold text-xs text-[#2D4F2D]">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#E2DCC8] flex justify-between items-center text-sm font-bold text-[#1A2F1A]">
                  <span>Total Paid Amount</span>
                  <span className="text-base text-[#2D4F2D]">₹{selectedOrder.total_amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-3xl border border-[#E2DCC8] p-6 space-y-4">
                <h3 className="font-serif font-bold text-base text-[#1A2F1A] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2D4F2D]" />
                  <span>Delivery Address</span>
                </h3>
                <div className="text-xs text-[#4A5D4A] space-y-1 leading-relaxed">
                  <strong className="block text-[#1A2F1A]">{selectedOrder.shipping_address?.recipient_name || selectedOrder.customer_name}</strong>
                  <p>{selectedOrder.shipping_address?.address_line1}</p>
                  {selectedOrder.shipping_address?.address_line2 && <p>{selectedOrder.shipping_address?.address_line2}</p>}
                  <p>
                    {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} - <strong>{selectedOrder.shipping_address?.postal_code}</strong>
                  </p>
                  <p className="pt-2 text-[#6B7C6B]">
                    Phone: {selectedOrder.shipping_address?.phone || selectedOrder.customer_phone}
                  </p>
                  <p className="text-[#6B7C6B]">
                    Email: {selectedOrder.customer_email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="px-6 py-20 text-center">
          <Package className="w-12 h-12 text-[#8B9A8B] mx-auto opacity-50 mb-3" />
          <h3 className="font-serif font-bold text-lg text-[#1A2F1A]">No order selected</h3>
          <p className="text-xs text-[#6B7C6B]">Please enter an Order ID or Email above to view tracking progress.</p>
        </section>
      )}

      {/* 🛡️ SECTION 3: EXPRESS COURIER & COLD-CHAIN LOGISTICS PARTNERS */}
      <section className="px-6 md:px-12 py-12 bg-white border-t border-[#E2DCC8]">
        <div className="max-w-5xl mx-auto space-y-6 text-center">
          <h3 className="font-serif font-bold text-lg text-[#1A2F1A]">
            Our Express Courier & Fulfillment Network
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[#4A5D4A]">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2DCC8]">
              <strong>BlueDart Express</strong>
              <p className="text-[11px] text-[#6B7C6B] mt-1">Air & Surface Express Cargo</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2DCC8]">
              <strong>DTDC Courier</strong>
              <p className="text-[11px] text-[#6B7C6B] mt-1">Priority Regional Transit</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2DCC8]">
              <strong>India Post SpeedPost</strong>
              <p className="text-[11px] text-[#6B7C6B] mt-1">Pan-India Remote Pin Reach</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2DCC8]">
              <strong>Ebenezer AgriExpress</strong>
              <p className="text-[11px] text-[#6B7C6B] mt-1">Direct Nilgiris Farm Vans</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
