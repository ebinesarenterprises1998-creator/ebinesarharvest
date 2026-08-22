import React, { useState, useEffect } from 'react';
import {
  User,
  Package,
  MapPin,
  Heart,
  CreditCard,
  Lock,
  LogOut,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { orderService } from '../../services/supabase/supabaseClient';
import { Order } from '../../types';

interface AccountDashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const AccountDashboardPage: React.FC<AccountDashboardPageProps> = ({ onNavigate }) => {
  const { user, signOut } = useAuth();
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'profile' | 'addresses' | 'wishlist' | 'invoices'>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      orderService.getUserOrders(user.id).then(setOrders);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-[#0B3D2E]">Please Sign In</h2>
        <p className="text-xs text-gray-500">You must be signed in to access your harvest account.</p>
        <button
          onClick={() => onNavigate('login')}
          className="px-6 py-2.5 bg-[#0B3D2E] text-[#FFDF78] font-bold text-xs rounded-xl shadow-md"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Account Sidebar Navigation */}
        <div className="bg-white rounded-3xl p-6 border border-[#0B3D2E]/10 shadow-sm space-y-6 h-fit">
          {/* User Profile Capsule */}
          <div className="flex items-center gap-3.5 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-[#0B3D2E] text-[#FFDF78] flex items-center justify-center font-display font-bold text-lg shadow-sm">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="font-display font-bold text-sm text-[#0B3D2E] truncate">
                {user.full_name}
              </h3>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <span className="inline-block mt-1 bg-[#F8F4EA] text-[#0B3D2E] text-[10px] font-bold px-2 py-0.5 rounded border border-[#C99A2E]/30 uppercase">
                {user.role} Member
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1" aria-label="Account Tabs">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
              { id: 'orders', label: `My Orders (${orders.length})`, icon: Package },
              { id: 'profile', label: 'My Profile', icon: User },
              { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
              { id: 'wishlist', label: `Harvest Wishlist (${wishlist.length})`, icon: Heart },
              { id: 'invoices', label: 'Payments & Invoices', icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setSelectedOrder(null);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0B3D2E] text-[#FFDF78] shadow-md'
                      : 'text-[#1B2A22]/80 hover:bg-[#F8F4EA] hover:text-[#0B3D2E]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFDF78]' : 'text-gray-400'}`} />
                </button>
              );
            })}

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Tab Content Panel */}
        <div className="lg:col-span-3">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#0B3D2E] to-[#063B2D] text-white p-8 rounded-3xl border border-[#C99A2E]/30 space-y-2">
                <span className="text-xs uppercase font-bold text-[#FFDF78] tracking-wider">
                  PEACE & BLESSINGS
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl">
                  Welcome Back, {user.full_name.split(' ')[0]}!
                </h2>
                <p className="text-xs sm:text-sm text-[#F8F4EA]/80 font-serif-sub italic">
                  Thank you for being part of the Ebinesar Harvest community.
                </p>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-[#F8F4EA] rounded-xl text-[#0B3D2E]">
                    <Package className="w-6 h-6 text-[#0B3D2E]" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Total Orders</span>
                    <h4 className="font-display font-extrabold text-xl text-[#0B3D2E]">{orders.length}</h4>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-[#F8F4EA] rounded-xl text-[#C99A2E]">
                    <Heart className="w-6 h-6 text-[#C99A2E]" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Wishlist Items</span>
                    <h4 className="font-display font-extrabold text-xl text-[#0B3D2E]">{wishlist.length}</h4>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-[#F8F4EA] rounded-xl text-green-700">
                    <CheckCircle2 className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Account Status</span>
                    <h4 className="font-display font-extrabold text-sm text-green-700">Verified Member</h4>
                  </div>
                </div>
              </div>

              {/* Recent Orders Snippet */}
              <div className="bg-white rounded-3xl p-6 border border-[#0B3D2E]/10 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="font-display font-bold text-base text-[#0B3D2E]">Recent Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-[#0B3D2E] hover:underline"
                  >
                    View All
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 space-y-2">
                    <p className="text-xs">You have not placed any harvest orders yet.</p>
                    <button
                      onClick={() => onNavigate('shop')}
                      className="px-4 py-2 bg-[#0B3D2E] text-[#FFDF78] text-xs font-bold rounded-xl"
                    >
                      Browse Harvest Store
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        onClick={() => {
                          setSelectedOrder(order);
                          setActiveTab('orders');
                        }}
                        className="flex items-center justify-between p-4 rounded-2xl bg-[#FCFAF5] border border-gray-100 hover:border-[#C99A2E] cursor-pointer transition-all"
                      >
                        <div>
                          <span className="font-bold text-xs text-[#0B3D2E]">{order.order_number}</span>
                          <p className="text-[11px] text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()} • {order.items.length} items
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-sm text-[#0B3D2E]">₹{order.total_amount}</span>
                          <span className="block text-[10px] uppercase font-bold text-green-700">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS & DETAILED BREAKDOWN */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {selectedOrder ? (
                /* Order Details View */
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B3D2E]/10 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="text-xs font-bold text-gray-500 hover:text-[#0B3D2E] mb-1 inline-flex items-center gap-1"
                      >
                        ← Back to all orders
                      </button>
                      <h3 className="font-display font-extrabold text-xl text-[#0B3D2E]">
                        Order #{selectedOrder.order_number}
                      </h3>
                      <p className="text-xs text-gray-400">
                        Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase">
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Harvest Items Ordered
                    </h4>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-2xl bg-[#FCFAF5] border border-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.product_image || '/placeholder-harvest.jpg'}
                              alt={item.product_name}
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                            <div>
                              <h5 className="font-semibold text-xs text-[#0B3D2E]">{item.product_name}</h5>
                              <p className="text-[11px] text-gray-400">
                                ₹{item.unit_price} × {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-xs text-[#0B3D2E]">
                            ₹{(item.unit_price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment & Price Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100 text-xs">
                    <div>
                      <h4 className="font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Delivery Address
                      </h4>
                      <p className="text-gray-700 font-medium">{selectedOrder.shipping_address.full_name}</p>
                      <p className="text-gray-500">{selectedOrder.shipping_address.street_address}</p>
                      <p className="text-gray-500">
                        {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} -{' '}
                        {selectedOrder.shipping_address.postal_code}
                      </p>
                      <p className="text-gray-500">Phone: {selectedOrder.shipping_address.phone}</p>
                    </div>

                    <div className="space-y-1.5 bg-[#F8F4EA] p-4 rounded-2xl">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-green-700">
                          <span>Discount:</span>
                          <span>-₹{selectedOrder.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>₹{selectedOrder.shipping_fee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (GST):</span>
                        <span>₹{selectedOrder.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-[#0B3D2E] text-sm pt-2 border-t border-gray-300">
                        <span>Total Paid:</span>
                        <span>₹{selectedOrder.total_amount.toFixed(2)}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 pt-1">
                        Payment: {selectedOrder.payment_method} ({selectedOrder.payment_status})
                      </p>
                    </div>
                  </div>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
                  <Package className="w-12 h-12 text-gray-300 mx-auto" />
                  <h3 className="font-display font-bold text-lg text-[#0B3D2E]">No Orders Yet</h3>
                  <p className="text-xs text-gray-500">Your future harvest orders will be listed here.</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-6 py-2.5 bg-[#0B3D2E] text-[#FFDF78] text-xs font-bold rounded-xl shadow-md"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-[#C99A2E] cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-extrabold text-sm text-[#0B3D2E]">
                            {order.order_number}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-green-100 text-green-800 rounded">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Placed on {new Date(order.created_at).toLocaleDateString()} • {order.items.length} items
                        </p>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="font-display font-black text-base text-[#0B3D2E]">
                          ₹{order.total_amount}
                        </span>
                        <button className="px-3.5 py-1.5 bg-[#F8F4EA] hover:bg-[#0B3D2E] hover:text-[#FFDF78] text-[#0B3D2E] text-xs font-bold rounded-xl transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-8 border border-[#0B3D2E]/10 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-xl text-[#0B3D2E]">Account Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#FCFAF5] rounded-2xl">
                  <span className="text-gray-400 font-bold uppercase">Full Name</span>
                  <p className="text-sm font-semibold text-[#0B3D2E] mt-1">{user.full_name}</p>
                </div>
                <div className="p-4 bg-[#FCFAF5] rounded-2xl">
                  <span className="text-gray-400 font-bold uppercase">Email Address</span>
                  <p className="text-sm font-semibold text-[#0B3D2E] mt-1">{user.email}</p>
                </div>
                <div className="p-4 bg-[#FCFAF5] rounded-2xl">
                  <span className="text-gray-400 font-bold uppercase">Phone</span>
                  <p className="text-sm font-semibold text-[#0B3D2E] mt-1">{user.phone || 'Not provided'}</p>
                </div>
                <div className="p-4 bg-[#FCFAF5] rounded-2xl">
                  <span className="text-gray-400 font-bold uppercase">Account Role</span>
                  <p className="text-sm font-semibold text-[#0B3D2E] mt-1 uppercase">{user.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-3xl p-8 border border-[#0B3D2E]/10 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-xl text-[#0B3D2E]">Saved Shipping Addresses</h3>
              <div className="p-5 rounded-2xl bg-[#FCFAF5] border border-gray-100 space-y-2 text-xs">
                <span className="inline-block px-2 py-0.5 bg-[#0B3D2E] text-[#FFDF78] text-[10px] font-bold rounded">
                  Primary Delivery Address
                </span>
                <p className="font-bold text-sm text-[#0B3D2E]">{user.full_name}</p>
                <p className="text-gray-600">77 Harvest Ridge Sanctuary</p>
                <p className="text-gray-600">Nilgiris, Tamil Nadu, 643001, India</p>
                <p className="text-gray-500">Phone: {user.phone || '+91 98765 43210'}</p>
              </div>
            </div>
          )}

          {/* TAB 5: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-3xl p-8 border border-[#0B3D2E]/10 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-xl text-[#0B3D2E]">
                Saved Harvest Wishlist ({wishlist.length})
              </h3>
              {wishlist.length === 0 ? (
                <p className="text-xs text-gray-500">Your wishlist is currently empty.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border border-gray-100 bg-[#FCFAF5] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product_image || '/placeholder-harvest.jpg'}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h5 className="font-bold text-xs text-[#0B3D2E]">{item.name}</h5>
                          <span className="text-xs font-semibold text-[#C99A2E]">₹{item.price}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            addToCart(item);
                            removeFromWishlist(item.id);
                          }}
                          className="p-2 bg-[#0B3D2E] text-white rounded-lg text-xs"
                          title="Move to Cart"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg text-xs"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: INVOICES & PAYMENTS */}
          {activeTab === 'invoices' && (
            <div className="bg-white rounded-3xl p-8 border border-[#0B3D2E]/10 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-xl text-[#0B3D2E]">Payment Records & Invoices</h3>
              <p className="text-xs text-gray-500">
                All transactions are processed securely through the verified Razorpay payment network.
              </p>
              {orders.length === 0 ? (
                <p className="text-xs text-gray-400">No payment receipts available.</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="p-4 bg-[#FCFAF5] rounded-2xl flex items-center justify-between text-xs border border-gray-100"
                    >
                      <div>
                        <span className="font-bold text-[#0B3D2E]">Receipt for #{o.order_number}</span>
                        <p className="text-gray-500">{new Date(o.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#0B3D2E]">₹{o.total_amount}</span>
                        <span className="block text-[10px] text-green-700 font-bold uppercase">{o.payment_status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
