import React, { useState, useEffect } from 'react';
import { Product, Order } from '../types';
import {
  Lock,
  Plus,
  Edit2,
  Trash2,
  Package,
  ShoppingBag,
  TrendingUp,
  Truck,
  CheckCircle,
  Clock,
  RefreshCw,
  Search,
  ArrowLeft
} from 'lucide-react';

interface AdminPortalProps {
  onBack: () => void;
  onToast: (msg: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBack, onToast }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'inventory' | 'dropship'>('products');

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // New/Edit product form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Grains & Cereals',
    price: 0,
    original_price: 0,
    stock: 20,
    short_description: '',
    full_description: '',
    sku: '',
    images: '',
  });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master PIN for admin demo
    if (adminPin === '7777' || adminPin === 'admin' || adminPin === 'ebinesar') {
      setIsAdminAuthenticated(true);
      onToast('Ebinesar Administrator credentials verified.');
      fetchAdminData();
    } else {
      onToast('Invalid security PIN. (Use "7777" or "ebinesar")');
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders')
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData);
      }
    } catch {
      onToast('Loaded local harvest administrator view.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchAdminData();
    }
  }, [isAdminAuthenticated]);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        original_price: Number(formData.original_price || formData.price),
        stock: Number(formData.stock),
        short_description: formData.short_description,
        full_description: formData.full_description,
        sku: formData.sku || `EBN-${Math.floor(1000 + Math.random() * 9000)}`,
        images: formData.images.split(',').map(s => s.trim()).filter(Boolean),
      };

      let res;
      if (editingProduct) {
        res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        onToast(editingProduct ? 'Product updated successfully' : 'New harvest item added');
        setIsFormOpen(false);
        setEditingProduct(null);
        fetchAdminData();
      } else {
        onToast('Failed to save product in database.');
      }
    } catch {
      onToast('Error updating item.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to retire this harvest product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onToast('Product removed');
        fetchAdminData();
      }
    } catch {
      onToast('Failed to delete.');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        onToast(`Order #${orderId} status updated to ${status}`);
        fetchAdminData();
      }
    } catch {
      onToast('Failed to update status.');
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <button
          onClick={onBack}
          className="mb-6 text-xs font-bold text-[#2D4F2D] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
        </button>

        <div className="bg-[#FDFCF9] border border-[#F0EBE0] rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#2D4F2D] text-[#D4AF37] rounded-full mx-auto flex items-center justify-center shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1A2F1A]">Harvest Estate Management</h2>
            <p className="text-xs text-[#6B7C6B] mt-1">Authorized personnel and supplier console</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A2F1A] mb-1 text-left">Admin Security PIN</label>
              <input
                type="password"
                required
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="Enter PIN (e.g. 7777 or ebinesar)"
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E2DCC8] rounded-xl text-center text-sm font-mono tracking-widest focus:outline-[#2D4F2D]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#2D4F2D] hover:bg-[#1E3A1E] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Access Secure Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalUnitsInStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-[#E2DCC8]">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-stone-100 text-[#1A2F1A] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="font-serif text-2xl font-bold text-[#1A2F1A]">Ebinesar Harvest Command</h1>
          </div>
          <p className="text-xs text-[#6B7C6B] ml-8">Real-time inventory, dropshipping supplier dispatch & order processing</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="p-2.5 rounded-xl bg-white border border-[#E2DCC8] hover:bg-[#F4F1EA] text-[#1A2F1A] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>

          <button
            onClick={() => {
              setEditingProduct(null);
              setFormData({
                name: '',
                category: 'Grains & Cereals',
                price: 0,
                original_price: 0,
                stock: 25,
                short_description: '',
                full_description: '',
                sku: `EBN-${Math.floor(1000 + Math.random() * 9000)}`,
                images: '',
              });
              setIsFormOpen(true);
            }}
            className="px-4 py-2.5 bg-[#2D4F2D] hover:bg-[#1E3A1E] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Harvest Product
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FDFCF9] border border-[#F0EBE0] p-5 rounded-2xl shadow-xs">
          <div className="flex justify-between items-center text-[#8B9A8B] text-xs font-semibold mb-1">
            <span>Total Sales Volume</span>
            <TrendingUp className="w-4 h-4 text-[#2D4F2D]" />
          </div>
          <p className="text-2xl font-extrabold text-[#2D4F2D]">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-[#FDFCF9] border border-[#F0EBE0] p-5 rounded-2xl shadow-xs">
          <div className="flex justify-between items-center text-[#8B9A8B] text-xs font-semibold mb-1">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <p className="text-2xl font-extrabold text-[#1A2F1A]">{orders.length}</p>
        </div>

        <div className="bg-[#FDFCF9] border border-[#F0EBE0] p-5 rounded-2xl shadow-xs">
          <div className="flex justify-between items-center text-[#8B9A8B] text-xs font-semibold mb-1">
            <span>Catalog Products</span>
            <Package className="w-4 h-4 text-[#2D4F2D]" />
          </div>
          <p className="text-2xl font-extrabold text-[#1A2F1A]">{products.length}</p>
        </div>

        <div className="bg-[#FDFCF9] border border-[#F0EBE0] p-5 rounded-2xl shadow-xs">
          <div className="flex justify-between items-center text-[#8B9A8B] text-xs font-semibold mb-1">
            <span>Estate Units in Stock</span>
            <Truck className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <p className="text-2xl font-extrabold text-[#1A2F1A]">{totalUnitsInStock}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E2DCC8] gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition-colors relative cursor-pointer ${
            activeTab === 'products' ? 'text-[#2D4F2D]' : 'text-[#8B9A8B] hover:text-[#1A2F1A]'
          }`}
        >
          Product Catalog ({products.length})
          {activeTab === 'products' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF37]" />}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors relative cursor-pointer ${
            activeTab === 'orders' ? 'text-[#2D4F2D]' : 'text-[#8B9A8B] hover:text-[#1A2F1A]'
          }`}
        >
          Customer Orders ({orders.length})
          {activeTab === 'orders' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF37]" />}
        </button>

        <button
          onClick={() => setActiveTab('dropship')}
          className={`pb-3 transition-colors relative cursor-pointer ${
            activeTab === 'dropship' ? 'text-[#2D4F2D]' : 'text-[#8B9A8B] hover:text-[#1A2F1A]'
          }`}
        >
          Dropship Suppliers & Farms
          {activeTab === 'dropship' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF37]" />}
        </button>
      </div>

      {/* Product List Tab */}
      {activeTab === 'products' && (
        <div className="bg-[#FDFCF9] border border-[#F0EBE0] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F1EA] text-[#1A2F1A] font-bold border-b border-[#E2DCC8]">
                <tr>
                  <th className="p-4">Item & SKU</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE0]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=150'}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                        />
                        <div>
                          <p className="font-bold text-[#1A2F1A]">{p.name}</p>
                          <span className="text-[10px] text-[#8B9A8B] font-mono">SKU: {p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#4A5D4A]">{p.category}</td>
                    <td className="p-4 font-bold text-[#2D4F2D]">₹{p.price}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.stock <= 5 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setFormData({
                              name: p.name,
                              category: p.category,
                              price: p.price,
                              original_price: p.original_price,
                              stock: p.stock,
                              short_description: p.short_description,
                              full_description: p.full_description,
                              sku: p.sku,
                              images: p.images.join(', '),
                            });
                            setIsFormOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-[#FDFCF9] border border-[#F0EBE0] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F1EA] text-[#1A2F1A] font-bold border-b border-[#E2DCC8]">
                <tr>
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE0]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-[#1A2F1A]">#{o.id.substring(0, 8)}</p>
                      <span className="text-[10px] text-[#8B9A8B]">{new Date(o.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-[#1A2F1A]">{o.customer?.name || 'Customer'}</p>
                      <p className="text-[10px] text-[#8B9A8B]">{o.customer?.phone || o.customer?.email}</p>
                    </td>
                    <td className="p-4 font-bold text-[#2D4F2D]">₹{o.total?.toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E9F0E9] text-[#2D4F2D] uppercase">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="px-2 py-1 bg-white border border-[#E2DCC8] rounded-lg text-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dropship Tab */}
      {activeTab === 'dropship' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-[#E2DCC8] space-y-3">
            <h3 className="font-serif font-bold text-[#1A2F1A]">Nilgiris Highland Organic Trust</h3>
            <p className="text-xs text-[#6B7C6B]">Direct partner for Highland Wheat, Red Rice & Millets.</p>
            <div className="text-xs text-[#4A5D4A] space-y-1 pt-2 border-t border-[#E2DCC8]">
              <p><strong>Dispatch Hub:</strong> Ooty / Kotagiri Facility</p>
              <p><strong>Fulfillment SLA:</strong> 24 hours</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E2DCC8] space-y-3">
            <h3 className="font-serif font-bold text-[#1A2F1A]">Western Ghats Honey Collective</h3>
            <p className="text-xs text-[#6B7C6B]">Tribal bee-keeping trust for Raw Wildflower & Forest Honey.</p>
            <div className="text-xs text-[#4A5D4A] space-y-1 pt-2 border-t border-[#E2DCC8]">
              <p><strong>Dispatch Hub:</strong> Wayanad Foothills</p>
              <p><strong>Fulfillment SLA:</strong> 48 hours</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E2DCC8] space-y-3">
            <h3 className="font-serif font-bold text-[#1A2F1A]">Cauvery Delta Cold-Press Mills</h3>
            <p className="text-xs text-[#6B7C6B]">Wood-churned traditional virgin oil extraction partner.</p>
            <div className="text-xs text-[#4A5D4A] space-y-1 pt-2 border-t border-[#E2DCC8]">
              <p><strong>Dispatch Hub:</strong> Thanjavur / Kumbakonam</p>
              <p><strong>Fulfillment SLA:</strong> 24 hours</p>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto border border-[#E2DCC8] space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#1A2F1A]">
              {editingProduct ? 'Edit Harvest Item' : 'New Harvest Item'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1A2F1A] mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Organic Highland Wheat"
                  className="w-full px-3 py-2 bg-white border border-[#E2DCC8] rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A2F1A] mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E2DCC8] rounded-xl text-xs"
                  >
                    <option value="Grains & Cereals">Grains & Cereals</option>
                    <option value="Natural Sweeteners">Natural Sweeteners</option>
                    <option value="Gourmet Oils">Gourmet Oils</option>
                    <option value="Spices & Condiments">Spices & Condiments</option>
                    <option value="Herbal Teas">Herbal Teas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A2F1A] mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#E2DCC8] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A2F1A] mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#E2DCC8] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A2F1A] mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#E2DCC8] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A2F1A] mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Grown in virgin high altitude organic soil..."
                  className="w-full px-3 py-2 bg-white border border-[#E2DCC8] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A2F1A] mb-1">Image URLs (comma-separated)</label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-white border border-[#E2DCC8] rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E2DCC8]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2D4F2D] text-white rounded-xl text-xs font-bold"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
