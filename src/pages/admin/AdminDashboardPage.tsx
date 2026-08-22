import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Plus,
  SlidersHorizontal,
  Megaphone,
} from 'lucide-react';
import { orderService, productService } from '../../services/supabase/supabaseClient';
import { Order, Product } from '../../types';

interface AdminDashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      orderService.getAllOrders(),
      productService.getProducts(),
    ]).then(([ordersData, productsData]) => {
      setOrders(ordersData);
      setProducts(productsData);
      setIsLoading(false);
    });
  }, []);

  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.payment_status === 'paid' ? curr.total_amount : 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length;
  const lowStockProducts = products.filter((p) => p.inventory < 10);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: any) => {
    await orderService.updateOrderStatus(orderId, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#0B3D2E]/10 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B3D2E]/10 text-[#0B3D2E] text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C99A2E]" />
            <span>Admin Stewardship</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#0B3D2E]">
            Harvest Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('admin-products')}
            className="px-4 py-2.5 bg-[#0B3D2E] hover:bg-[#063B2D] text-[#FFDF78] font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Products</span>
          </button>

          <button
            onClick={() => onNavigate('admin-marketing')}
            className="px-4 py-2.5 bg-[#F8F4EA] hover:bg-gray-100 text-[#0B3D2E] font-bold text-xs rounded-xl border border-[#0B3D2E]/20 flex items-center gap-2"
          >
            <Megaphone className="w-4 h-4 text-[#C99A2E]" />
            <span>Marketing</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <h3 className="font-display font-black text-2xl text-[#0B3D2E]">
            ₹{totalRevenue.toFixed(2)}
          </h3>
          <p className="text-[11px] text-gray-400">From paid harvest deliveries</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#0B3D2E]" />
          </div>
          <h3 className="font-display font-black text-2xl text-[#0B3D2E]">{orders.length}</h3>
          <p className="text-[11px] text-green-700 font-semibold">{pendingOrders} awaiting fulfillment</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Active Products</span>
            <Package className="w-4 h-4 text-[#C99A2E]" />
          </div>
          <h3 className="font-display font-black text-2xl text-[#0B3D2E]">{products.length}</h3>
          <p className="text-[11px] text-gray-400">In database catalogue</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="font-display font-black text-2xl text-amber-600">{lowStockProducts.length}</h3>
          <p className="text-[11px] text-gray-400">Products with &lt; 10 units</p>
        </div>
      </div>

      {/* Orders Management Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B3D2E]/10 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="font-display font-bold text-lg text-[#0B3D2E]">Recent Customer Orders</h2>
            <p className="text-xs text-gray-400">Manage fulfillment, dispatch, and payment tracking.</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs">
            No customer orders placed yet. Orders will show here in real-time as users checkout.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FCFAF5] text-gray-500 font-bold uppercase border-b border-gray-200">
                <tr>
                  <th className="p-3">Order Number</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-[#0B3D2E]">{o.order_number}</td>
                    <td className="p-3">
                      <p className="font-semibold text-gray-800">{o.shipping_address.full_name}</p>
                      <p className="text-[10px] text-gray-400">{o.shipping_address.phone}</p>
                    </td>
                    <td className="p-3">{o.items.length} items</td>
                    <td className="p-3 font-bold text-[#0B3D2E]">₹{o.total_amount}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          o.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {o.payment_status}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="bg-[#F8F4EA] border border-gray-200 text-[#0B3D2E] text-xs font-semibold rounded-lg px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
