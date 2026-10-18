import type { AppointmentStatus, BillingStatus } from '@/types';
import type { PillTagProps } from '@/components/ui/PillTag';

/**
 * Canonical status → color/label mapping used across ALL dashboards.
 * Rule: amber = needs action, green = good/done-ok, red = stopped/critical,
 * neutral = completed/finished. Purple (accent) is reserved for AI/primary.
 */

type TagVariant = Extract<PillTagProps['variant'], string>;

export const APPOINTMENT_STATUS_META: Record<
  AppointmentStatus,
  { variant: TagVariant; label: string }
> = {
  PENDING: { variant: 'warning', label: 'Pending' },
  IN_QUEUE: { variant: 'accent', label: 'In queue' },
  CONFIRMED: { variant: 'emerald', label: 'Confirmed' },
  COMPLETED: { variant: 'secondary', label: 'Completed' },
  CANCELLED: { variant: 'error', label: 'Cancelled' },
};

export const BILLING_STATUS_META: Record<
  BillingStatus,
  { variant: TagVariant; label: string }
> = {
  PENDING: { variant: 'warning', label: 'Pending' },
  PAID: { variant: 'emerald', label: ' Paid' },
  CANCELLED: { variant: 'error', label: 'Cancelled' },
};

// ─── Formatting helpers (locale-aware, single source of truth) ───────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(value: string | Date): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
    new Date(value),
  );
}

export function formatDateTime(value: string | Date): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatTime(value: string | Date): string {
  return new Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(
    new Date(value),
  );
}
