import React from 'react';
import Image from 'next/image';

interface KnowrexLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  wordmarkClassName?: string;
  badge?: string;
  className?: string;
}

const sizeMap = {
  xs: { px: 22, text: 'text-lg', badge: 'text-[8px] px-1 py-0.2' },
  sm: { px: 28, text: 'text-xl', badge: 'text-[9px] px-1.5 py-0.2' },
  md: { px: 36, text: 'text-2xl', badge: 'text-[10px] px-1.5 py-0.5' },
  lg: { px: 48, text: 'text-3xl sm:text-4xl', badge: 'text-[11px] px-2 py-0.5' },
  xl: { px: 64, text: 'text-4xl sm:text-5xl', badge: 'text-xs px-2.5 py-1' },
};

export default function KnowrexLogo({
  size = 'md',
  showWordmark = true,
  wordmarkClassName = '',
  badge,
  className = '',
}: KnowrexLogoProps) {
  const config = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Icon Emblem Container */}
      <div 
        className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ width: config.px, height: config.px }}
      >
        <Image
          src="/knowrex-icon.png"
          alt="Knowrex AI Logo"
          width={config.px * 2}
          height={config.px * 2}
          className="w-full h-full object-contain rounded-[22%] shadow-sm drop-shadow-md"
          priority
        />
      </div>

      {/* Wordmark Typography */}
      {showWordmark && (
        <div className="flex items-center gap-1.5">
          <span className={`font-instrument tracking-tight text-slate-900 dark:text-white leading-none ${config.text} ${wordmarkClassName}`}>
            Knowre<span className="text-indigo-600 dark:text-indigo-400 font-semibold">x</span>
          </span>

          {badge && (
            <span className={`font-mono font-bold rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase tracking-wider ${config.badge}`}>
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
