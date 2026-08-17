import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'gold';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'dark',
  showTagline = true,
  className = '',
  onClick,
}) => {
  const isLight = variant === 'light';

  // Dimension helpers
  const iconSizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizeMap = {
    sm: 'text-base font-bold tracking-wider',
    md: 'text-xl font-extrabold tracking-widest',
    lg: 'text-2xl font-black tracking-widest',
    xl: 'text-3xl font-black tracking-widest',
  };

  const taglineSizeMap = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  return (
    <div
      id="brand-logo-container"
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Emblem SVG: Cross + Golden Wheat + Sprouting Leaf */}
      <div className={`relative flex items-center justify-center rounded-xl p-1.5 transition-transform duration-300 hover:scale-105 ${iconSizeMap[size]} ${
        isLight
          ? 'bg-[#2D5A36]/80 text-[#D4AF37] border border-[#D4AF37]/30 shadow-md'
          : 'bg-[#1B3C23] text-[#D4AF37] border border-[#D4AF37]/40 shadow-lg'
      }`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Subtle Sun / Halo */}
          <circle cx="50" cy="36" r="16" fill="url(#goldGradient)" fillOpacity="0.25" />
          
          {/* Central Faith Cross Stem */}
          <path
            d="M50 15V82M38 32H62"
            stroke="#D4AF37"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Left Wheat Stalk Sheaf */}
          <path
            d="M44 48C36 44 32 36 34 26C42 28 46 36 44 48Z"
            fill="url(#goldGradient)"
            fillOpacity="0.9"
          />
          <path
            d="M45 62C35 60 30 50 33 40C41 42 46 52 45 62Z"
            fill="url(#goldGradient)"
            fillOpacity="0.9"
          />

          {/* Right Sprouting Living Leaf */}
          <path
            d="M56 46C64 42 68 34 66 24C58 26 54 34 56 46Z"
            fill="#4ADE80"
            fillOpacity="0.9"
          />
          <path
            d="M55 60C65 58 70 48 67 38C59 40 54 50 55 60Z"
            fill="url(#goldGradient)"
            fillOpacity="0.9"
          />

          {/* Earth / Foundation Ark */}
          <path
            d="M26 84C38 89 62 89 74 84"
            stroke="#4ADE80"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5E6AB" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#A37E1C" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-brand uppercase ${titleSizeMap[size]} ${
            isLight ? 'text-white' : 'text-[#1B3C23]'
          }`}
        >
          EBINESAR <span className="text-[#B8860B] font-serif">HARVEST</span>
        </span>
        {showTagline && (
          <span
            className={`font-serif italic tracking-wide mt-0.5 ${taglineSizeMap[size]} ${
              isLight ? 'text-[#D4AF37]/90' : 'text-[#2D5A36]/80'
            }`}
          >
            Rooted in Faith. Grown with Care.
          </span>
        )}
      </div>
    </div>
  );
};
