import React from 'react';

export const AgriHeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" aria-hidden="true">
      {/* 1. Main High-Res Agricultural Farmland Landscape */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2400&q=85')`,
        }}
      />

      {/* 2. Secondary Layer: Golden Harvest Wheat & Sunlight Field Overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-bottom bg-no-repeat opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=85')`,
        }}
      />

      {/* 3. Atmospheric Agricultural Color Grading Gradients */}
      {/* Top warm daylight gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8F4EA]/90 via-[#FCFAF5]/75 to-[#F8F4EA]/95 backdrop-blur-[1.5px]" />

      {/* Golden Sun Flare Radiance */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-[#FFDF78]/45 via-[#C99A2E]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Deep agricultural forest vignette on corners for text legibility */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(11,61,46,0.18)_100%)]" />

      {/* 4. Agricultural Field Row Pattern Line Accents */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.07] text-[#0B3D2E]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="agri-furrows" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
            <line x1="0" y1="0" x2="0" y2="60" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="30" cy="30" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#agri-furrows)" />
      </svg>

      {/* 5. Floating Sunlight Spores / Golden Harvest Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/5 w-2 h-2 rounded-full bg-[#C99A2E] opacity-40 blur-[0.5px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-[#FFDF78] opacity-50 blur-[1px] animate-bounce duration-1000" />
        <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 rounded-full bg-[#FFDF78] opacity-45 blur-[0.5px] animate-pulse" />
        <div className="absolute top-1/2 right-1/5 w-2 h-2 rounded-full bg-[#C99A2E] opacity-35 blur-[0.5px]" />
      </div>

      {/* Bottom smooth fade to content */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#F8F4EA] to-transparent" />
    </div>
  );
};
