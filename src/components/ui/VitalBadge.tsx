'use client';

import React from 'react';
import { Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VitalSeverity } from '@/lib/vitals';
import { SEVERITY_BADGE } from '@/lib/vitals';

/**
 * Color-coded vitals badge: Green = Normal, Amber = Warning, Red = Critical.
 * Includes icon + text so the signal is never color-only (WCAG 1.4.1).
 */
export interface VitalBadgeProps {
  label: string;
  value: string;
  severity: VitalSeverity;
  flagLabel?: string;
  className?: string;
}

const ICONS: Record<VitalSeverity, React.ReactNode> = {
  normal: <CheckCircle2 className="w-3 h-3" aria-hidden="true" />,
  warn: <Activity className="w-3 h-3" aria-hidden="true" />,
  crit: <AlertTriangle className="w-3 h-3" aria-hidden="true" />,
};

const SR_TEXT: Record<VitalSeverity, string> = {
  normal: 'normal',
  warn: 'warning',
  crit: 'critical',
};

export function VitalBadge({ label, value, severity, flagLabel, className }: VitalBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold',
        SEVERITY_BADGE[severity],
        className,
      )}
    >
      {ICONS[severity]}
      <span className="sr-only">{SR_TEXT[severity]}: </span>
      <span>
        {label} {value}
      </span>
      {flagLabel && severity !== 'normal' && (
        <span className="font-normal">· {flagLabel}</span>
      )}
    </div>
  );
}
