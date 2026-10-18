'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { PillButton } from './PillButton';

/**
 * Confirmation dialog for consequential/irreversible actions.
 * Built on the accessible Modal shell (Escape + backdrop + focus trap).
 */
export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** 'danger' renders a crimson confirm button for destructive actions. */
  tone?: 'default' | 'danger';
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      busy={isLoading}
      footer={
        <>
          <PillButton
            variant="ghost"
            size="sm"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </PillButton>
          <PillButton
            variant={tone === 'danger' ? 'secondary' : 'accent'}
            size="sm"
            type="button"
            isLoading={isLoading}
            onClick={() => void onConfirm()}
            className={
              tone === 'danger'
                ? 'bg-crimson text-white border-crimson hover:bg-crimson/90 [.light_&]:bg-crimson [.light_&]:hover:bg-crimson/90'
                : undefined
            }
          >
            {confirmLabel}
          </PillButton>
        </>
      }
    >
      <div className="flex items-start gap-3">
        {tone === 'danger' && (
          <div
            className="shrink-0 w-10 h-10 rounded-full bg-crimson-subtle border border-crimson/30 flex items-center justify-center text-danger"
            aria-hidden="true"
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
        )}
        <p className="text-sm text-text-secondary leading-relaxed">{message}</p>
      </div>
    </Modal>
  );
}
