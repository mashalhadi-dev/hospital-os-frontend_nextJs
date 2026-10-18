'use client';

import React from 'react';
import { LucideIcon, Maximize2, Minimize2, RefreshCw, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PillTag } from './PillTag';

export interface CanvasFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  status?: {
    label: string;
    variant?: 'emerald' | 'amber' | 'crimson' | 'accent' | 'glass';
  };
  actions?: React.ReactNode;
  headerTabs?: React.ReactNode;
  showWindowControls?: boolean;
  onRefresh?: () => void;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
  variant?: 'default' | 'elevated' | 'bordered';
  children?: React.ReactNode;
}

export const CanvasFrame = React.forwardRef<HTMLDivElement, CanvasFrameProps>(
  (
    {
      title = 'DocNode Workspace',
      subtitle,
      icon: Icon = ShieldCheck,
      status,
      actions,
      headerTabs,
      showWindowControls = true,
      onRefresh,
      onToggleExpand,
      isExpanded = false,
      variant = 'default',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full overflow-hidden transition-all duration-300',
          // 40px top-corner radius requirement (--radius-panel)
          'rounded-t-[40px] rounded-b-[24px] border border-white/10 [.light_&]:border-black/10',
          variant === 'default' &&
          'bg-[#121214]/90 [.light_&]:bg-[#ffffff]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] [.light_&]:shadow-[0_20px_50px_rgba(0,0,0,0.06)]',
          variant === 'elevated' &&
          'bg-[#18181b]/95 [.light_&]:bg-[#f8f9fa]/95 backdrop-blur-3xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] [.light_&]:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.1)]',
          variant === 'bordered' &&
          'bg-[#0f0f11]/80 [.light_&]:bg-[#ffffff]/80 backdrop-blur-xl border-white/15 [.light_&]:border-black/15 shadow-lg',
          isExpanded && 'fixed inset-4 z-50 rounded-[40px] m-0',
          className
        )}
        {...props}
      >
        {/* Workspace Frame Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 sm:px-8 py-5 border-b border-white/10 [.light_&]:border-black/8 bg-white/[0.02] [.light_&]:bg-black/[0.01]">
          <div className="flex items-center gap-3.5">
            {/* Window Traffic Dot Controls */}
            {showWindowControls && (
              <div className="flex items-center gap-1.5 mr-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/40 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/40 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/40 inline-block" />
              </div>
            )}

            {/* Icon Badge */}
            {Icon && (
              <div className="p-2 rounded-xl bg-[#6b62f2]/15 text-[#8a84f8] [.light_&]:bg-[#5247d8]/10 [.light_&]:text-[#5247d8] border border-[#6b62f2]/20 [.light_&]:border-[#5247d8]/15">
                <Icon className="w-5 h-5" />
              </div>
            )}

            {/* Title & Subtitle */}
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-semibold text-base sm:text-lg text-zinc-100 [.light_&]:text-zinc-900 tracking-tight">
                  {title}
                </h3>
                {status && (
                  <PillTag variant={status.variant || 'emerald'} size="sm">
                    {status.label}
                  </PillTag>
                )}
              </div>
              {subtitle && (
                <p className="text-xs sm:text-sm text-zinc-400 [.light_&]:text-zinc-500 font-normal">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right Action Bar & Control Icons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {headerTabs && <div className="mr-2">{headerTabs}</div>}

            {actions}

            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="p-2 rounded-full text-zinc-400 hover:text-zinc-100 [.light_&]:text-zinc-500 [.light_&]:hover:text-zinc-900 hover:bg-white/10 [.light_&]:hover:bg-black/5 transition-colors cursor-pointer"
                aria-label="Refresh Workspace"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {onToggleExpand && (
              <button
                type="button"
                onClick={onToggleExpand}
                className="p-2 rounded-full text-zinc-400 hover:text-zinc-100 [.light_&]:text-zinc-500 [.light_&]:hover:text-zinc-900 hover:bg-white/10 [.light_&]:hover:bg-black/5 transition-colors cursor-pointer"
                aria-label={isExpanded ? 'Collapse Workspace' : 'Expand Workspace'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Workspace Canvas Inner Body Content */}
        <div className="p-6 sm:p-8 min-h-[400px]">{children}</div>
      </div>
    );
  }
);

CanvasFrame.displayName = 'CanvasFrame';
