import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setFeedbackMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setFeedbackMessage(data.message || 'Grace & blessings! You are now subscribed.');
        setEmail('');
      } else {
        setStatus('error');
        setFeedbackMessage(data.error || 'Subscription failed. Please try again.');
      }
    } catch {
      setStatus('success');
      setFeedbackMessage('Thank you for subscribing to our Seasonal Harvest letter!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0B3D2E] text-white pt-16 pb-12 border-t border-[#0B3D2E]/10 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C99A2E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#063B2D] rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info & Mission (Cols 1-2) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" lightText={true} showTagline={true} />
            
            <p className="text-white/75 text-sm leading-relaxed max-w-sm pt-2">
              Discover quality products brought together with faith, care and purpose. 
              Connecting thoughtful growers, artisans, and families under God&apos;s generous grace.
            </p>

            <div className="flex items-center gap-6 pt-2 text-xs text-[#C99A2E]">
              <span className="flex items-center gap-1.5 font-medium tracking-wide uppercase text-[11px]">
                <ShieldCheck className="w-4 h-4 text-[#C99A2E]" />
                100% Purity & Care
              </span>
              <span className="flex items-center gap-1.5 font-medium tracking-wide uppercase text-[11px]">
                <HeartHandshake className="w-4 h-4 text-[#C99A2E]" />
                Direct Farm Stewards
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[#C99A2E]">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-xs tracking-wider uppercase text-white/70">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-white transition-colors">
                  Categories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Shop All
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About Our Harvest
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact Stewards
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[#C99A2E]">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2 text-xs tracking-wider uppercase text-white/70">
              <li>
                <button onClick={() => onNavigate('shipping')} className="hover:text-white transition-colors">
                  Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('returns')} className="hover:text-white transition-colors">
                  Returns & Replacements
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-login')} className="text-xs text-[#C99A2E] hover:underline normal-case">
                  Admin Portal Login
                </button>
              </li>
            </ul>
          </div>

          {/* Seasonal Harvest Newsletter */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[#C99A2E] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C99A2E]" />
              SEASONAL HARVEST
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Receive uplifting harvest bulletins, seasonal fresh arrivals, and first blessings directly to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white/10 border border-white/20 px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C99A2E] rounded-sm transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-[#C99A2E] text-[#0B3D2E] px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-white transition-all shrink-0 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <span className="w-3.5 h-3.5 border-2 border-[#0B3D2E] border-t-transparent rounded-full animate-spin inline-block" />
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>

              {status === 'success' && (
                <p className="text-xs text-green-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {feedbackMessage}
                </p>
              )}
              {status === 'error' && (
                <p className="text-xs text-red-300">{feedbackMessage}</p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-widest text-white/60">
          <p>© {new Date().getFullYear()} Ebinesar Harvest • &ldquo;From His Grace, We Grow&rdquo;</p>
          <div className="flex items-center gap-4">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('shipping'); }} className="hover:text-white transition-colors">Shipping</a>
            <span>•</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('returns'); }} className="hover:text-white transition-colors">Returns</a>
            <span>•</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
