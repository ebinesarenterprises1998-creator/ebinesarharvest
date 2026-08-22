import React, { useState, useEffect } from 'react';
import {
  Tag,
  Mail,
  Megaphone,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Users,
} from 'lucide-react';
import { couponService } from '../../services/supabase/supabaseClient';
import { Coupon } from '../../types';

interface AdminMarketingPageProps {
  onNavigate: (page: string) => void;
}

export const AdminMarketingPage: React.FC<AdminMarketingPageProps> = ({ onNavigate }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount_type: 'percentage' as const,
    discount_value: 10,
    min_order_amount: 500,
    max_discount_amount: 500,
  });

  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    couponService.getCoupons().then(setCoupons);
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;

    const created = await couponService.createCoupon({
      code: newCoupon.code.toUpperCase().trim(),
      discount_type: newCoupon.discount_type,
      discount_value: Number(newCoupon.discount_value),
      min_order_amount: Number(newCoupon.min_order_amount),
      max_discount_amount: Number(newCoupon.max_discount_amount),
      is_active: true,
      usage_count: 0,
    });

    setCoupons([created, ...coupons]);
    setFeedback(`Coupon code ${created.code} created successfully.`);
    setNewCoupon({
      code: '',
      discount_type: 'percentage',
      discount_value: 10,
      min_order_amount: 500,
      max_discount_amount: 500,
    });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDeleteCoupon = async (id: string) => {
    await couponService.deleteCoupon(id);
    setCoupons(coupons.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-[#0B3D2E]/10 shadow-sm">
        <div>
          <button
            onClick={() => onNavigate('admin')}
            className="text-xs font-bold text-gray-500 hover:text-[#0B3D2E] inline-flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>
          <h1 className="font-display font-black text-2xl text-[#0B3D2E]">
            Marketing & Harvest Campaigns
          </h1>
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Coupon Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B3D2E]/10 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-lg text-[#0B3D2E] flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#C99A2E]" />
            Create Harvest Promo
          </h3>

          <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                placeholder="e.g. GRACE20"
                className="w-full px-3 py-2 bg-[#F8F4EA] border border-gray-200 rounded-xl font-bold uppercase text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Discount % *</label>
              <input
                type="number"
                required
                min="1"
                max="100"
                value={newCoupon.discount_value}
                onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#F8F4EA] border border-gray-200 rounded-xl text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Min Order Amount (₹)</label>
              <input
                type="number"
                value={newCoupon.min_order_amount}
                onChange={(e) => setNewCoupon({ ...newCoupon, min_order_amount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#F8F4EA] border border-gray-200 rounded-xl text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0B3D2E] hover:bg-[#063B2D] text-[#FFDF78] font-bold rounded-xl shadow-md transition-all"
            >
              CREATE ACTIVE COUPON
            </button>
          </form>
        </div>

        {/* Existing Coupons List */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#0B3D2E]/10 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-lg text-[#0B3D2E]">
            Active Coupon Codes ({coupons.length})
          </h3>

          <div className="space-y-3">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-[#FCFAF5] border border-gray-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-sm text-[#0B3D2E] tracking-wider">
                      {c.code}
                    </span>
                    <span className="bg-green-100 text-green-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
                      {c.discount_value}% OFF
                    </span>
                  </div>
                  <p className="text-gray-500 mt-0.5">
                    Min order: ₹{c.min_order_amount || 0} • Used: {c.usage_count} times
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteCoupon(c.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
