'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToggleOption {
  id: string;
  label: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export interface LiquidGlassToggleProps {
  // Option A: Multi-option segmented tab mode
  options?: ToggleOption[];
  value?: string;
  onChange?: (value: string) => void;

  // Option B: Simple Boolean Toggle switch mode
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;

  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const LiquidGlassToggle: React.FC<LiquidGlassToggleProps> = ({
  options,
  value,
  onChange,
  checked,
  onCheckedChange,
  label,
  size = 'md',
  fullWidth = false,
  className,
}) => {
  // Mode B: Simple Toggle Switch
  if (!options) {
    const isChecked = checked ?? false;
    const handleSwitchClick = () => {
      onCheckedChange?.(!isChecked);
    };

    const switchSizes = {
      sm: { track: 'w-9 h-5 p-0.5', thumb: 'w-4 h-4', translate: 'translate-x-4' },
      md: { track: 'w-12 h-6.5 p-0.5', thumb: 'w-5.5 h-5.5', translate: 'translate-x-5.5' },
      lg: { track: 'w-14 h-8 p-1', thumb: 'w-6 h-6', translate: 'translate-x-6' },
    };

    const currentSize = switchSizes[size];

    return (
      <label
        className={cn(
          'inline-flex items-center gap-3 cursor-pointer select-none group',
          className
        )}
      >
        <button
          type="button"
          role="switch"
          aria-checked={isChecked}
          onClick={handleSwitchClick}
          className={cn(
            'relative inline-flex shrink-0 items-center rounded-full transition-colors duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6b62f2]',
            'bg-[rgba(212,212,212,0.15)] [.light_&]:bg-[rgba(0,0,0,0.08)] backdrop-blur-md border border-white/10 [.light_&]:border-black/10',
            isChecked && 'bg-[#6b62f2]/80 [.light_&]:bg-[#5247d8] border-[#6b62f2]/40 shadow-[0_0_15px_rgba(107,98,242,0.4)]',
            currentSize.track
          )}
        >
          <span
            className={cn(
              'pointer-events-none block rounded-full transition-all duration-300 ease-spring shadow-md',
              'bg-white [.light_&]:bg-white backdrop-blur-md',
              isChecked ? currentSize.translate : 'translate-x-0',
              currentSize.thumb
            )}
          />
        </button>
        {label && (
          <span className="text-sm font-medium text-zinc-300 [.light_&]:text-zinc-700 group-hover:text-white [.light_&]:group-hover:text-zinc-900 transition-colors">
            {label}
          </span>
        )}
      </label>
    );
  }

  // Mode A: Multi-option Segmented Selector
  const sizeStyles = {
    sm: 'p-1 gap-1 text-xs',
    md: 'p-1.5 gap-1.5 text-xs sm:text-sm',
    lg: 'p-2 gap-2 text-sm sm:text-base',
  };

  const itemPadding = {
    sm: 'px-3 py-1',
    md: 'px-4 py-1.5',
    lg: 'px-5 py-2',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full bg-[rgba(212,212,212,0.08)] [.light_&]:bg-[rgba(0,0,0,0.04)] backdrop-blur-xl border border-white/10 [.light_&]:border-black/8 p-1 relative shadow-inner',
        fullWidth && 'w-full justify-between',
        sizeStyles[size],
        className
      )}
    >
      {options.map((option) => {
        const isActive = value === option.id;
        const Icon = option.icon;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange?.(option.id)}
            className={cn(
              'relative flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 select-none cursor-pointer z-10',
              itemPadding[size],
              fullWidth && 'flex-1',
              isActive
                ? 'text-white [.light_&]:text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 [.light_&]:text-zinc-600 [.light_&]:hover:text-zinc-900'
            )}
          >
            {/* Active Frosted Glass Pill Highlight */}
            {isActive && (
              <span
                className="absolute inset-0 rounded-full bg-white/15 [.light_&]:bg-white backdrop-blur-md border border-white/20 [.light_&]:border-black/5 shadow-[0_4px_16px_rgba(0,0,0,0.2)] [.light_&]:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 -z-10 animate-in fade-in zoom-in-95"
              />
            )}

            {Icon && <Icon className="w-4 h-4 shrink-0" />}
            <span>{option.label}</span>

            {option.badge !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.5 text-[10px] font-semibold rounded-full leading-none',
                  isActive
                    ? 'bg-[#6b62f2] text-white'
                    : 'bg-white/10 [.light_&]:bg-black/10 text-zinc-400 [.light_&]:text-zinc-600'
                )}
              >
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
