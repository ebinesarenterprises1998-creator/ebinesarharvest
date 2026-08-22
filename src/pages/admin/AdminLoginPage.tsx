import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/common/BrandLogo';

interface AdminLoginPageProps {
  onNavigate: (page: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await signIn(email, password, 'admin');
    setIsLoading(false);

    if (res.success) {
      onNavigate('admin');
    } else {
      setError(res.error || 'Invalid administrator credentials');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-[#063B2D] to-[#0B3D2E]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#C99A2E]/40 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-[#0B3D2E]/10 rounded-2xl text-[#0B3D2E] mb-2">
            <ShieldCheck className="w-8 h-8 text-[#C99A2E]" />
          </div>
          <h2 className="font-display font-black text-2xl text-[#0B3D2E]">
            Admin Stewardship Portal
          </h2>
          <p className="text-xs text-gray-500">
            Secure administrative access for managing harvest inventory, orders, and customer care.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ebinesarharvest.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8F4EA] border border-gray-200 rounded-xl text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8F4EA] border border-gray-200 rounded-xl text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#0B3D2E] hover:bg-[#063B2D] text-[#FFDF78] font-display font-bold text-sm tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-[#FFDF78] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>ACCESS PORTAL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center border-t border-gray-100">
          <button
            onClick={() => onNavigate('home')}
            className="text-xs font-semibold text-gray-500 hover:text-[#0B3D2E] inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Public Store
          </button>
        </div>
      </div>
    </div>
  );
};
