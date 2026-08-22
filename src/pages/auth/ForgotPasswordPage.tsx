import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/common/BrandLogo';

interface ForgotPasswordPageProps {
  onNavigate: (page: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const res = await resetPassword(email);
    setStatus(res.success ? 'success' : 'error');
    setMessage(res.message);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#0B3D2E]/10 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <BrandLogo size="md" showTagline={false} className="justify-center" />
          <h2 className="font-display font-black text-2xl text-[#0B3D2E] pt-2">
            Reset Password
          </h2>
          <p className="text-xs text-gray-500">
            Enter your account email to receive secure recovery instructions.
          </p>
        </div>

        {status === 'success' ? (
          <div className="p-5 bg-green-50 border border-green-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
            <p className="text-xs text-green-800 font-medium leading-relaxed">{message}</p>
            <button
              onClick={() => onNavigate('login')}
              className="mt-2 text-xs font-bold text-[#0B3D2E] underline"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'error' && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl">{message}</div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8F4EA] border border-gray-200 rounded-xl text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3.5 bg-[#0B3D2E] hover:bg-[#063B2D] text-[#FFDF78] font-display font-bold text-sm tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {status === 'loading' ? 'Dispatching link...' : 'SEND RESET LINK'}
            </button>
          </form>
        )}

        <div className="pt-2 text-center">
          <button
            onClick={() => onNavigate('login')}
            className="text-xs font-semibold text-gray-500 hover:text-[#0B3D2E] inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
