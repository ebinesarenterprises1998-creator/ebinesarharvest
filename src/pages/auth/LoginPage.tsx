import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/common/BrandLogo';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await signIn(email, password, 'customer');
    setIsLoading(false);

    if (res.success) {
      onNavigate('account');
    } else {
      setError(res.error || 'Sign in failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#0B3D2E]/10 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <BrandLogo size="md" showTagline={false} className="justify-center" />
          <h2 className="font-display font-black text-2xl text-[#0B3D2E] pt-2">
            Welcome to Harvest
          </h2>
          <p className="text-xs text-gray-500">
            Sign in to track your orders, view saved harvest favorites, and manage addresses.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8F4EA] border border-gray-200 rounded-xl text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-xs text-[#0B3D2E] hover:text-[#C99A2E] font-medium"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8F4EA] border border-gray-200 rounded-xl text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#0B3D2E] hover:bg-[#063B2D] text-[#FFDF78] font-display font-bold text-sm tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-[#FFDF78] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>SIGN IN</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 text-center space-y-3">
          <p className="text-xs text-gray-600">
            Don&apos;t have a harvest account yet?{' '}
            <button
              onClick={() => onNavigate('signup')}
              className="text-[#0B3D2E] font-bold hover:underline"
            >
              Sign Up Free
            </button>
          </p>

          <p className="text-xs text-gray-400">
            Are you a harvest administrator?{' '}
            <button
              onClick={() => onNavigate('admin-login')}
              className="text-[#C99A2E] font-bold hover:underline"
            >
              Admin Portal
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
