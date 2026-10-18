'use client';

import React from 'react';
import { LucideIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PillTagProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'accent' | 'emerald' | 'amber' | 'crimson' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  interactive?: boolean;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  onRemove?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

export const PillTag = React.forwardRef<HTMLDivElement, PillTagProps>(
  (
    {
      variant = 'glass',
      size = 'md',
      active = false,
      interactive = false,
      icon: Icon,
      onRemove,
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'px-2.5 py-0.5 text-xs gap-1 rounded-full font-medium',
      md: 'px-3 py-1 text-xs sm:text-sm gap-1.5 rounded-full font-medium',
      lg: 'px-4 py-1.5 text-sm gap-2 rounded-full font-semibold',
    };

    const iconSizes = {
      sm: 'w-3 h-3',
      md: 'w-3.5 h-3.5',
      lg: 'w-4 h-4',
    };

    const variantStyles = {
      primary:
        'bg-white text-zinc-950 [.light_&]:bg-zinc-900 [.light_&]:text-white border border-transparent shadow-xs',
      secondary:
        'bg-zinc-800/80 text-zinc-200 [.light_&]:bg-zinc-200/80 [.light_&]:text-zinc-800 border border-zinc-700/50 [.light_&]:border-zinc-300/50',
      glass:
        'bg-[rgba(212,212,212,0.1)] [.light_&]:bg-[rgba(0,0,0,0.04)] backdrop-blur-md border border-white/10 [.light_&]:border-black/8 text-zinc-200 [.light_&]:text-zinc-800',
      accent:
        'bg-[#6b62f2]/15 text-[#8a84f8] [.light_&]:bg-[#5247d8]/10 [.light_&]:text-[#5247d8] border border-[#6b62f2]/30 [.light_&]:border-[#5247d8]/25',
      emerald:
        'bg-[#38e1b0]/15 text-[#38e1b0] [.light_&]:bg-emerald-500/10 [.light_&]:text-emerald-700 border border-[#38e1b0]/30 [.light_&]:border-emerald-500/25',
      amber:
        'bg-[#f59e0b]/15 text-[#f59e0b] [.light_&]:bg-amber-500/10 [.light_&]:text-amber-700 border border-[#f59e0b]/30 [.light_&]:border-amber-500/25',
      warning:
        'bg-[#f59e0b]/15 text-[#f59e0b] [.light_&]:bg-amber-500/10 [.light_&]:text-amber-700 border border-[#f59e0b]/30 [.light_&]:border-amber-500/25',
      crimson:
        'bg-[#f43f5e]/15 text-[#f43f5e] [.light_&]:bg-rose-500/10 [.light_&]:text-rose-700 border border-[#f43f5e]/30 [.light_&]:border-rose-500/25',
      error:
        'bg-[#f43f5e]/15 text-[#f43f5e] [.light_&]:bg-rose-500/10 [.light_&]:text-rose-700 border border-[#f43f5e]/30 [.light_&]:border-rose-500/25',
    };

    const activeStyles = active
      ? 'ring-2 ring-[#6b62f2] ring-offset-1 ring-offset-zinc-950 [.light_&]:ring-offset-white shadow-[0_0_12px_rgba(107,98,242,0.4)]'
      : '';

    const interactiveStyles = (interactive || onClick)
      ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150'
      : '';

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap transition-all duration-200 select-none',
          sizeStyles[size],
          variantStyles[variant],
          activeStyles,
          interactiveStyles,
          className
        )}
        {...props}
      >
        {Icon && <Icon className={cn('shrink-0', iconSizes[size])} />}
        {children && <span>{children}</span>}
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(e);
            }}
            className="shrink-0 p-0.5 rounded-full hover:bg-white/20 [.light_&]:hover:bg-black/10 transition-colors cursor-pointer"
            aria-label="Remove tag"
          >
            <X className={cn(iconSizes[size])} />
          </button>
        )}
      </div>
    );
  }
);

PillTag.displayName = 'PillTag';
