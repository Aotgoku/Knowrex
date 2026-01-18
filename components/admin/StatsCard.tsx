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
  primary: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  error: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
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
      className="relative overflow-hidden rounded-xl border p-6 card-hover"
      style={{ 
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)'
      }}
    >
      {/* Gradient accent */}
      <div 
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colorClasses[color]}`}
      />
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p 
            className="text-sm font-medium mb-1"
            style={{ color: 'var(--muted)' }}
          >
            {title}
          </p>
          <p 
            className="text-3xl font-bold"
            style={{ color: 'var(--foreground)' }}
          >
            {value}
          </p>
          {subtitle && (
            <p 
              className="text-xs mt-1"
              style={{ color: 'var(--muted)' }}
            >
              {subtitle}
            </p>
          )}
          {trend && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${
              trend.isPositive ? 'text-emerald-500' : 'text-red-500'
            }`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              <span style={{ color: 'var(--muted)' }}>from last week</span>
            </p>
          )}
        </div>
        
        <div className={`p-3 rounded-xl ${iconBgClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
