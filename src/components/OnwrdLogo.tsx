import React from 'react';

interface OnwrdLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  animateOnHover?: boolean;
}

export const OnwrdLogo: React.FC<OnwrdLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  animateOnHover = false,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-xl', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-5xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className} ${animateOnHover ? 'group cursor-pointer' : ''}`}>
      {/* Dynamic Vector Icon */}
      <div className={`relative ${currentSize.icon} flex-shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1"
        >
          <defs>
            {/* High-intensity Fluorescent Orange Gradient */}
            <linearGradient id="orangePulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7700" />
              <stop offset="60%" stopColor="#FF4500" />
              <stop offset="100%" stopColor="#D83000" />
            </linearGradient>
            
            <linearGradient id="darkBevel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2A2A35" />
              <stop offset="100%" stopColor="#141418" />
            </linearGradient>

            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Technical Polygon */}
          <rect
            x="3"
            y="3"
            width="42"
            height="42"
            rx="9"
            fill="url(#darkBevel)"
            stroke="#262630"
            strokeWidth="1.5"
          />

          {/* Corner telemetry notches */}
          <line x1="7" y1="7" x2="12" y2="7" stroke="#FF5500" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="7" y1="7" x2="7" y2="12" stroke="#FF5500" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="41" y1="41" x2="36" y2="41" stroke="#FF5500" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="41" y1="41" x2="41" y2="36" stroke="#FF5500" strokeWidth="1.5" strokeLinecap="round" />

          {/* Forward Velocity Chevron 1 (Left accent) */}
          <path
            d="M12 33L21 24L12 15H17L26 24L17 33H12Z"
            fill="#FF5500"
            opacity="0.35"
          />

          {/* Primary Forward Speed Wedge 2 (Dominant high-vis blade) */}
          <path
            d="M20 34L31 24L20 14H26L37 24L26 34H20Z"
            fill="url(#orangePulseGrad)"
            filter="url(#neonGlow)"
          />

          {/* Dynamic Velocity Dash */}
          <circle cx="37" cy="14" r="2.2" fill="#FF8800" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center tracking-wider">
          <span className={`font-black italic tracking-tight text-white font-heading ${currentSize.text}`}>
            ONWRD
          </span>
          <span className={`font-black italic tracking-tight text-[#FF5500] font-heading ml-1.5 ${currentSize.text}`}>
            SPORTS
          </span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse"></span>
            <span className={`font-semibold tracking-[0.2em] uppercase text-zinc-400 font-mono-split ${currentSize.sub}`}>
              ENDURANCE &middot; ANALYTICS
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
