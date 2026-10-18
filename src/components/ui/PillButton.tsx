'use client';

import React from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  glow?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const PillButton = React.forwardRef<HTMLButtonElement, PillButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      isLoading = false,
      glow = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'px-3.5 py-1.5 text-xs gap-1.5 rounded-full font-medium',
      md: 'px-5 py-2.5 text-sm gap-2 rounded-full font-medium',
      lg: 'px-6 py-3.5 text-base gap-2.5 rounded-full font-semibold',
    };

    const iconSizes = {
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    const variantStyles = {
      primary:
        'bg-white text-zinc-950 hover:bg-zinc-200 [.light_&]:bg-zinc-900 [.light_&]:text-white [.light_&]:hover:bg-zinc-800 shadow-sm active:scale-[0.98]',
      secondary:
        'bg-white/10 [.light_&]:bg-black/5 backdrop-blur-md border border-white/15 [.light_&]:border-black/10 text-zinc-100 [.light_&]:text-zinc-800 hover:bg-white/15 [.light_&]:hover:bg-black/10 active:scale-[0.98]',
      accent:
        'bg-[#6b62f2] text-white hover:bg-[#7b73f4] active:bg-[#5c52e5] [.light_&]:bg-[#5247d8] [.light_&]:hover:bg-[#6b62f2] shadow-[0_0_20px_rgba(107,98,242,0.35)] active:scale-[0.98]',
      glass:
        'bg-[rgba(212,212,212,0.12)] [.light_&]:bg-[rgba(0,0,0,0.04)] backdrop-blur-md border border-white/20 [.light_&]:border-black/10 text-zinc-100 [.light_&]:text-zinc-900 hover:bg-white/20 [.light_&]:hover:bg-black/8 hover:border-white/30 active:scale-[0.98]',
      outline:
        'border border-zinc-700 [.light_&]:border-zinc-300 text-zinc-200 [.light_&]:text-zinc-700 hover:bg-white/5 [.light_&]:hover:bg-black/5 active:scale-[0.98]',
      ghost:
        'text-zinc-300 [.light_&]:text-zinc-600 hover:bg-white/10 [.light_&]:hover:bg-black/5 hover:text-white [.light_&]:hover:text-zinc-900 active:scale-[0.98]',
    };

    const glowStyles = glow ? 'shadow-[0_0_25px_rgba(107,98,242,0.5)] border-indigo-400/40' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-200 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6b62f2] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          fullWidth && 'w-full',
          sizeStyles[size],
          variantStyles[variant],
          glowStyles,
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className={cn('animate-spin', iconSizes[size])} />
        ) : Icon && iconPosition === 'left' ? (
          <Icon className={cn('shrink-0 transition-transform group-hover:scale-110', iconSizes[size])} />
        ) : null}

        {children && <span>{children}</span>}

        {!isLoading && Icon && iconPosition === 'right' && (
          <Icon className={cn('shrink-0 transition-transform group-hover:translate-x-0.5', iconSizes[size])} />
        )}
      </button>
    );
  }
);

PillButton.displayName = 'PillButton';
