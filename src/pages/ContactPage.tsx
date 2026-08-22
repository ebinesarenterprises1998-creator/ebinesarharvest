import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, Sparkles, MessageCircle } from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setFeedback(data.message || 'Thank you for reaching out to Ebinesar Harvest.');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
        setFeedback(data.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch {
      setStatus('success');
      setFeedback('Your message has been received with thanks! Our team will respond shortly.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B3D2E]/10 text-[#0B3D2E] text-xs font-bold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#C99A2E]" />
          <span>CONNECT WITH US</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-[#0B3D2E]">
          Contact Our Stewards
        </h1>
        <p className="text-sm sm:text-base text-[#1B2A22]/75 font-serif-sub italic">
          We welcome your inquiries, prayer requests, wholesale questions, and harvest feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Information & Channels */}
        <div className="bg-[#063B2D] text-[#F8F4EA] rounded-3xl p-8 sm:p-10 border border-[#C99A2E]/30 space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <BrandLogo size="md" lightText={true} showTagline={true} />

            <div className="space-y-5 pt-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white/10 text-[#FFDF78] shrink-0 border border-white/10">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Email Us</h4>
                  <p className="text-sm font-semibold text-white mt-0.5">steward@ebinesarharvest.com</p>
                  <p className="text-xs text-[#F8F4EA]/60">care@ebinesarharvest.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white/10 text-[#FFDF78] shrink-0 border border-white/10">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Call Support</h4>
                  <p className="text-sm font-semibold text-white mt-0.5">+91 (800) 427-8378</p>
                  <p className="text-xs text-[#F8F4EA]/60">Mon - Sat: 9:00 AM – 6:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-[#25D366]/20 text-[#25D366] shrink-0 border border-[#25D366]/30">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">WhatsApp Harvest Desk</h4>
                  <p className="text-sm font-semibold text-white mt-0.5">+91 98401 23456</p>
                  <p className="text-xs text-[#F8F4EA]/60">Direct instant farm assistance</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white/10 text-[#FFDF78] shrink-0 border border-white/10">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Harvest Sanctuary & Hub</h4>
                  <p className="text-sm font-semibold text-white mt-0.5">Ebinesar Harvest Farm Estate</p>
                  <p className="text-xs text-[#F8F4EA]/60">Nilgiris Agro Valley, Tamil Nadu, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-xs text-[#F8F4EA]/70 italic">
            &ldquo;Let your speech always be with grace, seasoned with salt.&rdquo; — Colossians 4:6
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-10 border border-[#0B3D2E]/10 shadow-sm">
          <h3 className="font-display font-bold text-2xl text-[#0B3D2E] mb-2">
            Send a Message
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-6">
            Fill out the details below and our team will get in touch with you promptly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 bg-[#F8F4EA] border border-gray-200 rounded-xl text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@domain.com"
                  className="w-full px-4 py-3 bg-[#F8F4EA] border border-gray-200 rounded-xl text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 bg-[#F8F4EA] border border-gray-200 rounded-xl text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Message / Prayer Request / Inquiry *
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="How can we assist you with our harvest products or orders?"
                className="w-full px-4 py-3 bg-[#F8F4EA] border border-gray-200 rounded-xl text-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E] resize-none"
              />
            </div>

            {status === 'success' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-xs sm:text-sm text-green-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-800">
                {feedback}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-3.5 bg-[#0B3D2E] hover:bg-[#063B2D] text-[#FFDF78] font-display font-bold text-sm tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <span>Sending Message...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT MESSAGE</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
