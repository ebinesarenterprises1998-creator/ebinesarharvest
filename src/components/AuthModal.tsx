import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, Phone, CheckCircle, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onToast }) => {
  const { login, register, isAuthenticated, user, logout } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  if (isAuthenticated && user) {
    return (
      <div
        id="auth-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          id="auth-modal-container"
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E2DCC8] p-6 sm:p-8 space-y-6"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-200 text-[#1A2F1A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-[#2D4F2D] text-[#D4AF37] rounded-full mx-auto flex items-center justify-center text-2xl font-serif font-bold shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1A2F1A]">{user.name}</h3>
            <p className="text-xs text-[#6B7C6B]">{user.email}</p>
            {user.role === 'admin' && (
              <span className="inline-block bg-[#D4AF37] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                Ebinesar Administrator
              </span>
            )}
          </div>

          <div className="bg-white/80 rounded-2xl p-4 border border-[#E2DCC8] space-y-2 text-xs text-[#4A5D4A]">
            <div className="flex justify-between">
              <span>Member Status:</span>
              <strong className="text-[#2D4F2D]">Verified Harvest Patron</strong>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span>{user.phone || 'Not provided'}</span>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              onToast('Signed out successfully');
              onClose();
            }}
            className="w-full py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-full font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLoginMode) {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        onToast('Welcome back to Ebinesar Harvest!');
        onClose();
      } else {
        onToast(res.message || 'Login failed. Please check credentials.');
      }
    } else {
      if (!name || !email || !password) {
        setLoading(false);
        onToast('Please fill in all required fields.');
        return;
      }
      const res = await register(name, email, password, phone);
      setLoading(false);
      if (res.success) {
        onToast('Welcome! Your harvest account is now registered.');
        onClose();
      } else {
        onToast(res.message || 'Registration failed.');
      }
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="auth-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E2DCC8] p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-200 text-[#1A2F1A] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-[#2D4F2D] rounded-full mx-auto flex items-center justify-center text-[#D4AF37] mb-2 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1A2F1A]">
            {isLoginMode ? 'Welcome Back' : 'Create Harvest Account'}
          </h3>
          <p className="text-xs text-[#6B7C6B]">
            {isLoginMode
              ? 'Sign in to access your orders, blessings wishlist, and faster checkout.'
              : 'Join the Ebinesar family for fresh organic harvests delivered home.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLoginMode && (
            <div>
              <label className="block text-xs font-semibold text-[#1A2F1A] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8B9A8B] absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2DCC8] rounded-xl text-xs focus:outline-[#2D4F2D]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1A2F1A] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8B9A8B] absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patron@example.com"
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2DCC8] rounded-xl text-xs focus:outline-[#2D4F2D]"
              />
            </div>
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-xs font-semibold text-[#1A2F1A] mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#8B9A8B] absolute left-3 top-2.5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2DCC8] rounded-xl text-xs focus:outline-[#2D4F2D]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1A2F1A] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8B9A8B] absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2DCC8] rounded-xl text-xs focus:outline-[#2D4F2D]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#2D4F2D] hover:bg-[#1E3A1E] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#2D4F2D]/20 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? 'Please wait...' : isLoginMode ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#E2DCC8]">
          <button
            type="button"
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-xs text-[#2D4F2D] hover:underline font-semibold cursor-pointer"
          >
            {isLoginMode
              ? "Don't have an account? Sign up now"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};
