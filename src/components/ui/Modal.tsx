'use client';

import React, { useEffect, useRef, useCallback, useId } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Accessible modal shell (self-contained; no extra deps).
 * - role="dialog" + aria-modal + aria-labelledby
 * - Escape closes (unless busy)
 * - Backdrop click closes (unless busy)
 * - Focus trap: cycles Tab within the dialog, restores focus on close
 * - Body scroll lock while open
 */
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** When true, Escape/backdrop close + close button are disabled (e.g. while submitting). */
  busy?: boolean;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  busy = false,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  const handleClose = useCallback(() => {
    if (!busy) onClose();
  }, [busy, onClose]);

  // Escape key + body scroll lock + initial focus + focus restoration
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    // Focus first focusable element inside the dialog
    const timer = window.setTimeout(() => {
      const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? dialogRef.current)?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      // Focus trap: keep Tab inside the dialog
      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose, busy]);

  if (!open) return null;

  const sizeClass =
    size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-2xl' : 'max-w-lg';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onMouseDown={(e) => {
        // Backdrop click dismisses (mousedown on backdrop only, not drags from inside)
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'w-full rounded-3xl border border-border-input bg-panel shadow-2xl p-6 space-y-5',
          'max-h-[90dvh] overflow-y-auto animate-scale-in',
          sizeClass,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id={titleId} className="text-lg font-bold text-text-primary">
              {title}
            </h3>
            {description && (
              <p id={descriptionId} className="mt-1 text-xs text-text-secondary">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={busy}
            aria-label="Close dialog"
            className="shrink-0 p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-glass-hover transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {children}

        {footer && (
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border-subtle">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
