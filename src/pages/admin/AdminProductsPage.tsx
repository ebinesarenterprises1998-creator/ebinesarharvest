import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Package,
  CheckCircle2,
  ArrowLeft,
  Search,
  Sparkles,
  Upload,
} from 'lucide-react';
import { productService, categoryService } from '../../services/supabase/supabaseClient';
import { Product, Category } from '../../types';
import { ImageUploadInput } from '../../components/common/ImageUploadInput';

interface AdminProductsPageProps {
  onNavigate: (page: string) => void;
}

export const AdminProductsPage: React.FC<AdminProductsPageProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    short_description: '',
    description: '',
    price: 0,
    original_price: 0,
    sku: '',
    inventory: 50,
    unit: '500g',
    weight: '500g',
    product_image: '',
    is_featured: false,
    is_active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [prods, cats] = await Promise.all([
      productService.getProducts(),
      categoryService.getCategories(),
    ]);
    setProducts(prods);
    setCategories(cats);
    if (cats.length > 0 && !formData.category_id) {
      setFormData((prev) => ({ ...prev, category_id: cats[0].id }));
    }
  };

  const handleOpenAdd = () => {
    setIsEditingId(null);
    setFormData({
      name: '',
      category_id: categories[0]?.id || '',
      short_description: '',
      description: '',
      price: 250,
      original_price: 300,
      sku: `EBH-${Math.floor(1000 + Math.random() * 9000)}`,
      inventory: 50,
      unit: '500g',
      weight: '500g',
      product_image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
      is_featured: false,
      is_active: true,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setIsEditingId(product.id);
    setFormData({
      name: product.name,
      category_id: product.category_id,
      short_description: product.short_description || '',
      description: product.description || '',
      price: product.price,
      original_price: product.original_price || 0,
      sku: product.sku,
      inventory: product.inventory,
      unit: product.unit,
      weight: product.weight || '500g',
      product_image: product.product_image || '',
      is_featured: product.is_featured,
      is_active: product.is_active,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this harvest product?')) return;
    await productService.deleteProduct(id);
    setProducts(products.filter((p) => p.id !== id));
    setFeedback('Product deleted successfully.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditingId) {
      const updated = await productService.updateProduct(isEditingId, formData);
      if (updated) {
        setProducts(products.map((p) => (p.id === isEditingId ? updated : p)));
        setFeedback('Harvest product updated.');
      }
    } else {
      const newProd = await productService.createProduct({
        ...formData,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        images: [formData.product_image],
      });
      setProducts([newProd, ...products]);
      setFeedback('New harvest product added to the store!');
    }

    setIsFormOpen(false);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#0B3D2E]/10 shadow-sm">
        <div>
          <button
            onClick={() => onNavigate('admin')}
            className="text-xs font-bold text-gray-500 hover:text-[#0B3D2E] inline-flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>
          <h1 className="font-display font-black text-2xl text-[#0B3D2E]">
            Harvest Product Catalog ({products.length})
          </h1>
          <p className="text-xs text-gray-400">
            Add, update, and manage official Ebinesar Harvest inventory items.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-[#0B3D2E] hover:bg-[#063B2D] text-[#FFDF78] font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Harvest Product</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C99A2E]/40 shadow-xl space-y-6">
          <h2 className="font-display font-bold text-xl text-[#0B3D2E]">
            {isEditingId ? 'Edit Harvest Product' : 'Add New Harvest Product'}
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Organic Heritage Emmer Wheat"
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EA] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Category *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EA] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EA] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EA] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Stock Inventory *
                </label>
                <input
                  type="number"
                  required
                  value={formData.inventory}
                  onChange={(e) => setFormData({ ...formData, inventory: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EA] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  SKU Code
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EA] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
                />
              </div>
            </div>

            <ImageUploadInput
              label="Product Image"
              value={formData.product_image}
              onChange={(imgUrl) => setFormData({ ...formData, product_image: imgUrl })}
              idPrefix="admin-product-image"
            />

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Short Description (Subtitle)
              </label>
              <input
                type="text"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="Brief highlight about the harvest source"
                className="w-full px-3.5 py-2.5 bg-[#F8F4EA] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Full Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed information on cultivation, health benefits, and preparation..."
                className="w-full px-3.5 py-2.5 bg-[#F8F4EA] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded text-[#0B3D2E] focus:ring-[#C99A2E]"
                />
                Featured on Homepage
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded text-[#0B3D2E] focus:ring-[#C99A2E]"
                />
                Active (Visible in Shop)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0B3D2E] text-[#FFDF78] font-bold text-xs rounded-xl shadow-md"
              >
                {isEditingId ? 'Update Product' : 'Save & Publish Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B3D2E]/10 shadow-sm space-y-4">
        {products.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Package className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="font-display font-bold text-lg text-[#0B3D2E]">No Products in Database</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Click the &ldquo;Add New Harvest Product&rdquo; button above whenever you wish to add real farm inventory.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FCFAF5] text-gray-500 font-bold uppercase border-b border-gray-200">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={p.product_image || '/placeholder-harvest.jpg'}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-bold text-[#0B3D2E]">{p.name}</p>
                        <p className="text-[10px] text-gray-400">SKU: {p.sku}</p>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">
                      {categories.find((c) => c.id === p.category_id)?.name || 'General'}
                    </td>
                    <td className="p-3 font-bold text-[#0B3D2E]">₹{p.price}</td>
                    <td className="p-3 font-semibold text-gray-700">{p.inventory} units</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {p.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-1.5 text-gray-600 hover:text-[#0B3D2E] hover:bg-gray-100 rounded-lg"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
