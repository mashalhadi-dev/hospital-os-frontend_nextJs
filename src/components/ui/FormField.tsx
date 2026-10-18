'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils';

/**
 * Accessible form field primitives.
 * Every control gets a real <label htmlFor> association, and errors are
 * wired via aria-invalid + aria-describedby (WCAG 2.2 AA).
 *
 * Usage:
 *   <Field label="Email" error={errors.email}>
 *     {(props) => <Input {...props} value={email} onChange={...} />}
 *   </Field>
 */

export interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: (props: {
    id: string;
    'aria-invalid': boolean | undefined;
    'aria-describedby': string | undefined;
  }) => React.ReactNode;
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required = false,
  className,
  children,
}: FieldProps) {
  const autoId = useId();
  const id = htmlFor ?? autoId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') ||
    undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-text-secondary uppercase tracking-wider"
      >
        {label}
        {required && (
          <span className="text-danger ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
      })}
      {hint && (
        <p id={hintId} className="text-[11px] text-text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-[11px] font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Themed text input. Spreads native input props; expects id/aria from <Field>. */
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full px-3 py-2.5 rounded-xl bg-surface-low border border-border-input',
        'text-sm text-text-primary placeholder:text-text-muted',
        'focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30',
        'transition-colors disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

/** Themed select. Options are passed as children. */
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'w-full px-3 py-2.5 rounded-xl bg-surface-low border border-border-input',
        'text-sm text-text-primary focus:outline-none focus:border-accent',
        'focus:ring-2 focus:ring-accent/30 transition-colors disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = 'Select';

/** Themed textarea. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full px-3 py-2.5 rounded-xl bg-surface-low border border-border-input',
        'text-sm text-text-primary placeholder:text-text-muted resize-none',
        'focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30',
        'transition-colors disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

/** Form-level error banner (role=alert so screen readers announce it). */
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="text-xs font-medium text-danger bg-crimson-subtle border border-crimson/30 rounded-xl px-3 py-2"
    >
      {message}
    </p>
  );
}
