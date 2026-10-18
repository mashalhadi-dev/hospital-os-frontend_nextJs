'use client';

import React from 'react';
import { useToastStore, ToastType } from '@/store/toast-store';
import { CheckCircle2, AlertCircle, Info, Sparkles, AlertTriangle, X } from 'lucide-react';

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-success" aria-hidden="true" />,
  error: <AlertCircle className="w-5 h-5 text-danger" aria-hidden="true" />,
  info: <Info className="w-5 h-5 text-info" aria-hidden="true" />,
  warning: <AlertTriangle className="w-5 h-5 text-warning" aria-hidden="true" />,
  ai: <Sparkles className="w-5 h-5 text-accent animate-pulse" aria-hidden="true" />,
};

// Token-based so borders/backgrounds adapt to light + dark automatically.
const borderMap: Record<ToastType, string> = {
  success: 'border-emerald/30 bg-emerald-subtle text-text-primary',
  error: 'border-crimson/30 bg-crimson-subtle text-text-primary',
  info: 'border-info/30 bg-info/10 text-text-primary',
  warning: 'border-amber/30 bg-amber-subtle text-text-primary',
  ai: 'border-accent/40 bg-accent-subtle text-text-primary',
};

// Screen-reader announcement level per type.
const roleMap: Record<ToastType, 'status' | 'alert'> = {
  success: 'status',
  error: 'alert',
  info: 'status',
  warning: 'alert',
  ai: 'status',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      // Polite live region always mounted so screen readers hear new toasts.
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={roleMap[toast.type]}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-fade-in ${borderMap[toast.type]}`}
        >
          <div className="mt-0.5 shrink-0">{iconMap[toast.type]}</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-text-primary tracking-wide">
              {toast.title}
            </h4>
            {toast.description && (
              <p className="mt-0.5 text-[11px] text-text-secondary leading-snug line-clamp-2">
                {toast.description}
              </p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            aria-label={`Dismiss notification: ${toast.title}`}
            className="text-text-muted hover:text-text-primary transition-colors p-1 -mr-1 rounded-lg"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
