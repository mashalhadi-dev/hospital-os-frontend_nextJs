'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-surface-high rounded-xl ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div className="p-4 rounded-2xl bg-surface-low border border-border-input space-y-3">
      <Skeleton className="h-4 w-1/3" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 4, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border-input">
      <table className="w-full text-left text-xs">
        <thead className="bg-surface-low border-b border-border-input">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="p-3.5">
                <Skeleton className="h-3 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {Array.from({ length: rows }).map((_, row) => (
            <tr key={row}>
              {Array.from({ length: cols }).map((_, col) => (
                <td key={col} className="p-3.5">
                  <Skeleton className="h-3 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ApiErrorBanner({
  title = 'Failed to load data',
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="p-4 rounded-2xl bg-crimson-subtle border border-crimson/30 text-xs space-y-2"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-bold text-danger">{title}</p>
          {message && <p className="text-danger/80 mt-1">{message}</p>}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1.5 rounded-lg bg-crimson/20 text-danger hover:bg-crimson/30 transition-colors text-xs font-semibold"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
