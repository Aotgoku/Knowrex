'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

// ============================================
// StatsCard Component
// Displays a single statistic with icon and label
// ============================================

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

const colorClasses = {
  primary: 'from-indigo-500 to-purple-600',
  success: 'from-emerald-500 to-teal-600',
  warning: 'from-amber-500 to-orange-600',
  error: 'from-red-500 to-pink-600',
  info: 'from-blue-500 to-cyan-600'
};

const iconBgClasses = {
  primary: 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400',
  success: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400',
  warning: 'bg-amber-500/10 border border-amber-500/20 text-amber-400',
  error: 'bg-red-500/10 border border-red-500/20 text-red-400',
  info: 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
};

export default function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  color = 'primary' 
}: StatsCardProps) {
  return (
    <div 
      className="glass-card relative overflow-hidden rounded-2xl p-4 sm:p-5 border border-white/10 dark:border-white/10 bg-white/[0.02] transition-all duration-300"
    >
      {/* Subtle top edge gradient accent */}
      <div 
        className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r ${colorClasses[color]} opacity-60`}
      />
      
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted font-medium mb-1 truncate">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-mono font-semibold text-foreground tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-[11px] font-mono text-muted mt-1 truncate">
              {subtitle}
            </p>
          )}
          {trend && (
            <p className={`text-[11px] font-mono mt-1.5 flex items-center gap-1 ${
              trend.isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              <span className="text-muted">vs last cycle</span>
            </p>
          )}
        </div>
        
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ml-3 ${iconBgClasses[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
