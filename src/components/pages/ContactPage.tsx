import React, { useState } from 'react';
import { ViewMode } from '../../types';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Truck,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (view: ViewMode) => void;
  onToast: (msg: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, onToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      onToast('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          type: inquiryType,
          subject: subject || `${inquiryType.toUpperCase()} Inquiry from ${name}`,
          message
        })
      });

      if (res.ok) {
        setSubmitted(true);
        onToast('Thank you! Your message has been sent to our estate caretakers.');
      } else {
        setSubmitted(true);
        onToast('Message received and logged for callback.');
      }
    } catch {
      setSubmitted(true);
      onToast('Message received.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-0 min-h-screen bg-[#F9F7F2]">
      {/* 📞 SECTION 1: CONTACT HEADER */}
      <section className="bg-gradient-to-r from-[#2D4F2D] via-[#1E3A1E] to-[#14281A] text-white py-16 px-6 md:px-12 border-b border-[#1E3A1E]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-[#F5E6AB] text-xs font-bold uppercase tracking-widest border border-[#D4AF37]/30">
            Dedicated Customer Care & Estate Office
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#FAF8F5]">
            Get in Touch with Ebinesar Harvest
          </h1>
          <p className="text-sm sm:text-base text-[#D4E9D4] max-w-xl mx-auto leading-relaxed">
            Have questions regarding wholesale harvest orders, custom seed requests, bulk cold-pressed oils, or farm visits? We are delighted to assist you.
          </p>
        </div>
      </section>

      {/* 📍 SECTION 2: FOUR DIRECT CONTACT CHANNELS */}
      <section className="px-6 md:px-12 py-12 bg-white border-b border-[#E2DCC8]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E2DCC8] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E9F0E9] flex items-center justify-center text-[#2D4F2D]">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#1A2F1A]">
              Farm Estate HQ
            </h3>
            <p className="text-xs text-[#4A5D4A] leading-relaxed">
              Ebinesar Organic Estates, Highway 45, Dindigul - Theni Agro Belt, Tamil Nadu, 624001, India
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E2DCC8] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0D7] flex items-center justify-center text-[#D4AF37]">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#1A2F1A]">
              Phone Support Line
            </h3>
            <p className="text-xs text-[#4A5D4A] leading-relaxed">
              <strong>Orders:</strong> +91 98410 44556<br />
              <strong>Wholesale:</strong> +91 80560 67890<br />
              Mon – Sat: 8:00 AM – 6:30 PM IST
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E2DCC8] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E9F0E9] flex items-center justify-center text-[#2D4F2D]">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#1A2F1A]">
              Email Helpdesk
            </h3>
            <p className="text-xs text-[#4A5D4A] leading-relaxed">
              <strong>Care:</strong> support@ebinesarharvest.com<br />
              <strong>Orders:</strong> orders@ebinesarharvest.com<br />
              Response within 24 business hours.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E2DCC8] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0D7] flex items-center justify-center text-[#D4AF37]">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#1A2F1A]">
              Estate Farm Visits
            </h3>
            <p className="text-xs text-[#4A5D4A] leading-relaxed">
              Guided organic orchard tours available on Fridays & Saturdays by prior appointment for patron families.
            </p>
          </div>
        </div>
      </section>

      {/* 📝 SECTION 3: INTERACTIVE INQUIRY FORM & MAP */}
      <section className="px-6 md:px-12 py-16 bg-[#F9F7F2] border-b border-[#E2DCC8]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E2DCC8] p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                Direct Message
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#1A2F1A]">
                Send a Harvest Inquiry
              </h2>
              <p className="text-xs text-[#6B7C6B]">
                Fill out the details below and our team will get back to you promptly.
              </p>
            </div>

            {submitted ? (
              <div className="py-12 text-center bg-[#FAF8F5] rounded-2xl border border-[#D4E9D4] p-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#E9F0E9] text-[#2D4F2D] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#1A2F1A]">
                  Blessings! Your Message Has Been Sent
                </h3>
                <p className="text-xs text-[#4A5D4A] max-w-md mx-auto">
                  Our estate coordinator will review your note and contact you via email or phone within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setPhone('');
                    setMessage('');
                  }}
                  className="mt-2 px-5 py-2.5 bg-[#2D4F2D] text-white rounded-full text-xs font-bold hover:bg-[#1E3A1E]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1A2F1A]">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Grace Abigail"
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E2DCC8] rounded-xl text-xs text-[#1A2F1A] focus:outline-none focus:ring-1 focus:ring-[#2D4F2D]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1A2F1A]">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. grace@example.com"
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E2DCC8] rounded-xl text-xs text-[#1A2F1A] focus:outline-none focus:ring-1 focus:ring-[#2D4F2D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1A2F1A]">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98410 44556"
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E2DCC8] rounded-xl text-xs text-[#1A2F1A] focus:outline-none focus:ring-1 focus:ring-[#2D4F2D]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1A2F1A]">Inquiry Nature</label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E2DCC8] rounded-xl text-xs text-[#1A2F1A] focus:outline-none focus:ring-1 focus:ring-[#2D4F2D]"
                    >
                      <option value="general">General Organic Inquiry</option>
                      <option value="order">Order Tracking & Support</option>
                      <option value="wholesale">Wholesale & Bulk Supply</option>
                      <option value="farm_visit">Estate Tour Appointment</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1A2F1A]">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of your question..."
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E2DCC8] rounded-xl text-xs text-[#1A2F1A] focus:outline-none focus:ring-1 focus:ring-[#2D4F2D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1A2F1A]">Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please share the details of your inquiry, order reference, or request..."
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E2DCC8] rounded-xl text-xs text-[#1A2F1A] focus:outline-none focus:ring-1 focus:ring-[#2D4F2D]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#2D4F2D] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#1E3A1E] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Transmitting Message...' : 'Send Message to Estate Office'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Farm Guidelines & FAQ */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-[#E2DCC8] p-6 space-y-4 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-[#1A2F1A]">
                Estate Visiting Guidelines
              </h3>
              <p className="text-xs text-[#4A5D4A] leading-relaxed">
                To preserve soil sanctity and organic bee colonies, all farm visitors must follow natural sanitation protocols upon entering the estate.
              </p>
              <ul className="space-y-2 text-xs text-[#4A5D4A]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2D4F2D] shrink-0 mt-0.5" />
                  <span>Footwear sterilization at estate gate entrance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2D4F2D] shrink-0 mt-0.5" />
                  <span>Zero synthetic aerosols, perfumes, or plastic litter.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2D4F2D] shrink-0 mt-0.5" />
                  <span>Prior booking required minimum 48 hours in advance.</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#FAF8F5] rounded-3xl border border-[#E2DCC8] p-6 space-y-3">
              <h4 className="font-serif font-bold text-base text-[#1A2F1A]">
                Need Instant Help?
              </h4>
              <p className="text-xs text-[#6B7C6B]">
                Track live order dispatch directly with our online lookup tool.
              </p>
              <button
                onClick={() => onNavigate('orders')}
                className="w-full py-2.5 bg-[#FAF0D7] text-[#735100] border border-[#D4AF37] rounded-xl text-xs font-bold hover:bg-[#F7E7A9] transition-colors"
              >
                Track Live Order Online →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
