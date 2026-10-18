'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface FrostedGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'subtle' | 'interactive' | 'glowing' | 'glow';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverEffect?: boolean;
  glowColor?: 'purple' | 'emerald' | 'amber' | 'blue';
  children?: React.ReactNode;
}

export const FrostedGlassCard = React.forwardRef<HTMLDivElement, FrostedGlassCardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hoverEffect = false,
      glowColor = 'purple',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const paddingStyles = {
      none: 'p-0',
      sm: 'p-3 sm:p-4',
      md: 'p-5 sm:p-6',
      lg: 'p-6 sm:p-8',
      xl: 'p-8 sm:p-10',
    };

    const variantStyles = {
      default:
        'glass-texture bg-[rgba(22,22,26,0.72)] [.light_&]:bg-white/90 backdrop-blur-xl border border-white/20 [.light_&]:border-slate-300/60 shadow-sm [.light_&]:shadow-md',
      elevated:
        'glass-texture bg-[rgba(22,22,26,0.76)] [.light_&]:bg-white/95 backdrop-blur-xl border border-white/20 [.light_&]:border-slate-300/60 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.3)] [.light_&]:shadow-md',
      subtle:
        'glass-texture bg-white/[0.04] [.light_&]:bg-white/80 backdrop-blur-xl border border-white/20 [.light_&]:border-slate-300/60',
      interactive:
        'glass-texture bg-[rgba(22,22,26,0.72)] [.light_&]:bg-white/90 backdrop-blur-xl border border-white/20 [.light_&]:border-slate-300/60 shadow-sm hover:border-[#6b62f2]/40 [.light_&]:hover:bg-white/85 [.light_&]:hover:border-[#5247d8]/40 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer active:scale-[0.995]',
      glowing:
        'glass-texture bg-[rgba(22,22,26,0.76)] [.light_&]:bg-white/92 backdrop-blur-xl border border-white/20 [.light_&]:border-slate-300/60 shadow-[0_0_25px_-5px_rgba(107,98,242,0.3)] [.light_&]:shadow-md',
      glow:
        'glass-texture bg-[rgba(22,22,26,0.76)] [.light_&]:bg-white/92 backdrop-blur-xl border border-white/20 [.light_&]:border-slate-300/60 shadow-[0_0_25px_-5px_rgba(107,98,242,0.3)] [.light_&]:shadow-md',
    };

    const glowStyles = {
      purple: 'hover:shadow-[0_0_30px_-5px_rgba(107,98,242,0.35)] hover:border-[#6b62f2]/60',
      emerald: 'hover:shadow-[0_0_30px_-5px_rgba(56,225,176,0.35)] hover:border-[#38e1b0]/60',
      amber: 'hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.35)] hover:border-[#f59e0b]/60',
      blue: 'hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.35)] hover:border-sky-400/60',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-[24px] overflow-hidden transition-all duration-300',
          variantStyles[variant],
          paddingStyles[padding],
          hoverEffect && variant !== 'interactive' && 'hover:-translate-y-0.5 hover:shadow-lg',
          hoverEffect && glowStyles[glowColor],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FrostedGlassCard.displayName = 'FrostedGlassCard';
