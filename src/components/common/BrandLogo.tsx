import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showTagline?: boolean;
  className?: string;
  variant?: 'full' | 'icon' | 'badge';
  lightText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  variant = 'full',
  lightText = false,
}) => {
  // Scale factors
  const dimensions = {
    sm: { icon: 40, width: 170, height: 42, textScale: 'text-sm' },
    md: { icon: 54, width: 220, height: 56, textScale: 'text-base' },
    lg: { icon: 78, width: 300, height: 80, textScale: 'text-xl' },
    xl: { icon: 110, width: 420, height: 115, textScale: 'text-2xl' },
    hero: { icon: 180, width: 560, height: 190, textScale: 'text-4xl' },
  }[size];

  // The Logo Icon SVG rendering all elements from the official brand design
  const LogoIcon = (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md select-none transition-transform duration-300 hover:scale-105"
        role="img"
        aria-label="Ebinesar Harvest Official Logo"
      >
        <defs>
          {/* Radial glow around the cross */}
          <radialGradient id="sunGlow" cx="40%" cy="30%" r="50%" fx="35%" fy="25%">
            <stop offset="0%" stopColor="#FFF4D0" stopOpacity="1" />
            <stop offset="35%" stopColor="#DFB14E" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#C99A2E" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F8F4EA" stopOpacity="0" />
          </radialGradient>

          {/* Deep green gradient for letter E */}
          <linearGradient id="forestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F4D3A" />
            <stop offset="40%" stopColor="#0B3D2E" />
            <stop offset="100%" stopColor="#04261D" />
          </linearGradient>

          {/* Gold metallic gradient */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F7E2A4" />
            <stop offset="30%" stopColor="#E2B958" />
            <stop offset="70%" stopColor="#C99A2E" />
            <stop offset="100%" stopColor="#966F17" />
          </linearGradient>

          {/* Soft wooden texture gradient for the cross */}
          <linearGradient id="crossWood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C59756" />
            <stop offset="50%" stopColor="#8E5E24" />
            <stop offset="100%" stopColor="#5E3C12" />
          </linearGradient>

          {/* Farmland green gradient */}
          <linearGradient id="fieldGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#95A84D" />
            <stop offset="50%" stopColor="#5F7B2F" />
            <stop offset="100%" stopColor="#3C561B" />
          </linearGradient>
          <linearGradient id="fieldGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A8BC5B" />
            <stop offset="100%" stopColor="#4A6520" />
          </linearGradient>

          {/* Leaf gradient */}
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E7D32" />
            <stop offset="50%" stopColor="#1B5E20" />
            <stop offset="100%" stopColor="#0B3D2E" />
          </linearGradient>
        </defs>

        {/* Outer Circular Soft Backdrop */}
        <circle cx="200" cy="200" r="190" fill="#FCFAF5" stroke="rgba(201, 154, 46, 0.25)" strokeWidth="3" />
        <circle cx="200" cy="200" r="184" fill="url(#sunGlow)" />

        {/* Golden Halo Ring Behind Cross */}
        <circle cx="150" cy="140" r="62" stroke="url(#goldGrad)" strokeWidth="3" fill="none" strokeDasharray="6 3" />
        <circle cx="150" cy="140" r="48" stroke="url(#goldGrad)" strokeWidth="1.5" fill="none" />

        {/* Radiating Sun Beams inside the letter frame */}
        <path d="M 150 140 L 120 70 M 150 140 L 150 60 M 150 140 L 185 70 M 150 140 L 210 95 M 150 140 L 90 110" stroke="#FFDF78" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

        {/* Stylized letter "E" Spine & Arcs in Rich Forest Green */}
        {/* Main top curve of E */}
        <path
          d="M 140 110 C 180 100 240 105 270 140 C 255 145 240 148 225 142 C 190 128 150 128 135 140 Z"
          fill="url(#forestGrad)"
        />
        {/* Outer Gold rim of E top */}
        <path
          d="M 140 108 C 182 98 244 103 273 138"
          stroke="url(#goldGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Lower Sweeping Crescent of E */}
        <path
          d="M 125 240 C 135 295 190 325 245 315 C 275 305 285 275 280 250 C 265 260 245 275 215 278 C 165 282 135 255 125 240 Z"
          fill="url(#forestGrad)"
        />
        {/* Bottom Gold accent rim */}
        <path
          d="M 118 248 C 130 305 190 332 250 320 C 280 310 290 280 285 252"
          stroke="url(#goldGrad)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Inside Agricultural Rolling Farmland Fields */}
        <g clipPath="url(#fieldClip)">
          {/* Distant Sun Rising over horizon */}
          <circle cx="190" cy="225" r="24" fill="#FFDF78" opacity="0.95" />
          <path d="M 190 225 L 165 195 M 190 225 L 190 185 M 190 225 L 215 195 M 190 225 L 235 210 M 190 225 L 145 210" stroke="#FFE9A0" strokeWidth="2" strokeLinecap="round" />

          {/* Distant rolling hills */}
          <path d="M 135 235 Q 170 215 205 230 T 260 225 L 260 280 L 135 280 Z" fill="url(#fieldGrad1)" />
          {/* Furrowed crop fields lines */}
          <path d="M 130 255 Q 175 235 235 250 L 255 280 L 125 280 Z" fill="url(#fieldGrad2)" />
          <path d="M 140 270 Q 185 245 255 268" stroke="#DFB14E" strokeWidth="2" fill="none" />
          <path d="M 155 278 Q 195 258 250 278" stroke="#FFE599" strokeWidth="1.5" fill="none" />
        </g>

        {/* Flying Doves / Birds in the distance */}
        <path d="M 200 165 Q 206 160 212 165 Q 218 160 224 165" stroke="#1B2A22" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
        <path d="M 225 178 Q 230 173 235 178 Q 240 173 245 178" stroke="#1B2A22" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.75" />
        <path d="M 215 190 Q 219 186 223 190 Q 227 186 231 190" stroke="#1B2A22" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7" />

        {/* The Holy Christian Cross (Majestic & Central) */}
        {/* Cross Vertical Beam */}
        <rect x="140" y="70" width="22" height="195" rx="3" fill="url(#crossWood)" stroke="#FFD875" strokeWidth="1.5" />
        {/* Cross Horizontal Beam */}
        <rect x="98" y="105" width="106" height="20" rx="3" fill="url(#crossWood)" stroke="#FFD875" strokeWidth="1.5" />
        {/* Cross Center Brilliant Flare */}
        <circle cx="151" cy="115" r="14" fill="#FFFFFF" opacity="0.9" />
        <path d="M 151 90 L 151 140 M 126 115 L 176 115" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

        {/* Left Golden Wheat Sheaf / Grains */}
        <g id="wheatStalk">
          {/* Main stalk stem */}
          <path d="M 100 240 Q 75 180 50 140" stroke="url(#goldGrad)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          
          {/* Wheat kernels (left & right alternating grains) */}
          <path d="M 50 140 C 45 130 55 120 62 132 C 68 142 58 150 50 140 Z" fill="url(#goldGrad)" stroke="#B38622" strokeWidth="1" />
          <path d="M 58 152 C 50 140 64 135 72 146 C 78 158 66 164 58 152 Z" fill="url(#goldGrad)" stroke="#B38622" strokeWidth="1" />
          <path d="M 68 168 C 58 155 74 150 82 162 C 90 174 76 180 68 168 Z" fill="url(#goldGrad)" stroke="#B38622" strokeWidth="1" />
          <path d="M 78 186 C 68 172 86 166 94 180 C 102 192 88 198 78 186 Z" fill="url(#goldGrad)" stroke="#B38622" strokeWidth="1" />
          <path d="M 88 206 C 76 192 98 188 106 200 C 114 212 98 220 88 206 Z" fill="url(#goldGrad)" stroke="#B38622" strokeWidth="1" />
          
          {/* Wheat Awns (whisker bristles) */}
          <path d="M 52 130 L 35 110 M 60 142 L 42 122 M 70 158 L 52 138 M 80 176 L 62 156" stroke="#DFB14E" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Lush Green Organic Leaves Wrapping Cross & Base */}
        <g id="greenLeaves">
          {/* Upward leaf along cross */}
          <path
            d="M 125 210 C 110 160 115 135 125 130 C 135 155 135 185 125 210 Z"
            fill="url(#leafGrad)"
            stroke="#104D39"
            strokeWidth="1.5"
          />
          <path d="M 120 195 Q 123 160 125 132" stroke="#81C784" strokeWidth="1.5" fill="none" />

          {/* Outer curved lower leaves */}
          <path
            d="M 105 245 C 90 205 110 175 140 180 C 130 205 120 230 105 245 Z"
            fill="url(#leafGrad)"
            stroke="#104D39"
            strokeWidth="1.5"
          />
          <path
            d="M 120 255 C 95 240 85 270 115 285 C 130 270 135 255 120 255 Z"
            fill="url(#leafGrad)"
          />
        </g>

        {/* Polished Gold accent swirls around bottom curve */}
        <path
          d="M 95 245 Q 115 275 150 280 Q 185 285 215 270"
          stroke="url(#goldGrad)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {LogoIcon}
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-3 p-2 rounded-2xl bg-white/90 border border-[#C99A2E]/30 shadow-sm ${className}`}>
        {LogoIcon}
        <div className="flex flex-col">
          <span className="font-display font-bold tracking-wider text-[#0B3D2E] text-base leading-none">
            EBINESAR HARVEST
          </span>
          <span className="font-script text-[#C99A2E] text-sm leading-tight mt-0.5">
            From His Grace, We Grow
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 md:gap-4 select-none ${className}`}>
      {LogoIcon}
      <div className="flex flex-col justify-center">
        {/* Brand Name Typography */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <span
            className={`font-display font-black tracking-widest leading-none ${
              lightText ? 'text-white' : 'text-[#0B3D2E]'
            } ${
              size === 'sm'
                ? 'text-lg md:text-xl'
                : size === 'md'
                ? 'text-xl md:text-2xl'
                : size === 'lg'
                ? 'text-2xl md:text-3xl'
                : size === 'xl'
                ? 'text-3xl md:text-4xl'
                : 'text-4xl md:text-5xl'
            }`}
          >
            EBINESAR
          </span>
        </div>

        {/* Harvest Sub-title with Gold Dividers */}
        <div className="flex items-center gap-2 mt-1">
          <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#C99A2E] to-transparent"></div>
          <span
            className={`font-display font-semibold tracking-[0.28em] leading-none ${
              lightText ? 'text-[#DFB14E]' : 'text-[#C99A2E]'
            } ${
              size === 'sm'
                ? 'text-[10px] md:text-xs'
                : size === 'md'
                ? 'text-xs md:text-sm'
                : size === 'lg'
                ? 'text-sm md:text-base'
                : size === 'xl'
                ? 'text-base md:text-lg'
                : 'text-lg md:text-xl'
            }`}
          >
            HARVEST
          </span>
          <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#C99A2E] to-transparent"></div>
        </div>

        {/* Official Tagline: "From His Grace, We Grow" */}
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`font-script text-[#063B2D] ${
                lightText ? 'text-[#F8F4EA]' : 'text-[#0B3D2E]'
              } ${
                size === 'sm'
                  ? 'text-xs'
                  : size === 'md'
                  ? 'text-sm md:text-base'
                  : size === 'lg'
                  ? 'text-base md:text-lg'
                  : size === 'xl'
                  ? 'text-lg md:text-xl'
                  : 'text-xl md:text-2xl'
              }`}
            >
              From His Grace, We Grow
            </span>
            <svg
              className="w-3.5 h-3.5 text-[#2E7D32] inline-block shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A9.49 9.49 0 0 0 17 8zM21 3a1 1 0 0 0-1-1C13 2 9 7 9 13a1 1 0 0 0 1 1c6 0 11-4 11-11z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
