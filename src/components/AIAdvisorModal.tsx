import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, Wheat, Sprout, HeartHandshake } from 'lucide-react';

interface AIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Grace and peace to you! I am your Ebinesar Harvest Agronomist & Organic Lifestyle Consultant. How may I assist you today with crop selection, organic grain cooking tips, or natural cold-pressed wellness oils?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    const userMsg: Message = {
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/advise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userText, context: 'Organic agriculture, cooking, health benefits of harvest products' })
      });

      const data = await res.json();
      const aiResponseText = data.advice || "Nature's harvest provides abundant health and vitality. Our organic highland wheat and cold-pressed sesame and coconut oils are cultivated with care to preserve full enzymatic nutrients.";

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiResponseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Our highland organic grains, forest honeys, and virgin cold-pressed oils are nutrient-rich and free of harmful chemicals. For personalized dietary advice, feel free to ask about specific grains or oils!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'What are the health benefits of cold pressed coconut oil?',
    'How should I cook organic highland wheat for best nutrition?',
    'What makes wildflower forest honey different from commercial honey?'
  ];

  return (
    <div
      id="ai-advisor-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="ai-advisor-container"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl h-[600px] bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E2DCC8] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-[#E2DCC8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2D4F2D] rounded-full flex items-center justify-center text-[#D4AF37] shadow-sm">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-[#1A2F1A]">Harvest Agronomist AI</h3>
                <span className="bg-[#E9F0E9] text-[#2D4F2D] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D4E9D4]">
                  Gemini Powered
                </span>
              </div>
              <p className="text-xs text-[#6B7C6B]">Faith-guided wisdom on organic nutrition & agriculture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200 text-[#1A2F1A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-[#2D4F2D] text-[#D4AF37] flex items-center justify-center shrink-0 mt-1">
                  <Wheat className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#2D4F2D] text-white rounded-tr-xs'
                    : 'bg-white border border-[#E2DCC8] text-[#1A2F1A] rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className={`block text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/60' : 'text-[#8B9A8B]'}`}>
                  {msg.time}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-[#6B7C6B]">
              <div className="w-7 h-7 rounded-full bg-[#2D4F2D] text-[#D4AF37] flex items-center justify-center animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="bg-white border border-[#E2DCC8] rounded-2xl px-4 py-2 flex items-center gap-1.5">
                <span>Seeking agronomy insights...</span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-6 py-2 bg-[#F4F1EA] border-t border-[#E2DCC8] flex gap-2 overflow-x-auto text-[11px]">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(p);
              }}
              className="bg-white hover:bg-[#FAF8F5] text-[#2D4F2D] px-3 py-1 rounded-full border border-[#E2DCC8] shrink-0 transition-colors cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Footer Input */}
        <form onSubmit={handleSend} className="p-4 bg-white/80 backdrop-blur-md border-t border-[#E2DCC8] flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about crops, health benefits, recipes, or farming..."
            className="flex-1 px-4 py-2.5 bg-[#FAF8F5] border border-[#E2DCC8] rounded-full text-xs focus:outline-[#2D4F2D]"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-2.5 bg-[#2D4F2D] hover:bg-[#1E3A1E] text-white rounded-full text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
