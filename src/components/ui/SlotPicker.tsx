'use client';

import React, { useMemo } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from './FormField';

/**
 * Structured appointment slot picker replacing free-text datetime-local.
 * - Date input (defaults to today, min = today)
 * - 30-minute slots 09:00–17:00
 * - Slots already booked by the selected doctor are disabled
 */
export interface SlotPickerProps {
  date: string; // yyyy-mm-dd
  onDateChange: (date: string) => void;
  selectedTime: string; // HH:mm
  onTimeChange: (time: string) => void;
  /** Existing appointment datetimes (ISO) for the selected doctor. */
  bookedSlots: string[];
  disabled?: boolean;
  idPrefix?: string;
}

const SLOT_START_HOUR = 9;
const SLOT_END_HOUR = 17;
const SLOT_STEP_MIN = 30;

function buildSlots(): string[] {
  const slots: string[] = [];
  for (let h = SLOT_START_HOUR; h < SLOT_END_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_STEP_MIN) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return slots;
}

function formatSlotLabel(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function SlotPicker({
  date,
  onDateChange,
  selectedTime,
  onTimeChange,
  bookedSlots,
  disabled = false,
  idPrefix = 'slot',
}: SlotPickerProps) {
  const slots = useMemo(() => buildSlots(), []);

  // Which slots are booked on the chosen date (compare local yyyy-mm-dd)
  const bookedOnDate = useMemo(() => {
    const set = new Set<string>();
    for (const iso of bookedSlots) {
      const d = new Date(iso);
      const dDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (dDate === date) {
        set.add(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
      }
    }
    return set;
  }, [bookedSlots, date]);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label
          htmlFor={`${idPrefix}-date`}
          className="block text-xs font-semibold text-text-secondary uppercase tracking-wider"
        >
          <Calendar className="w-3.5 h-3.5 inline mr-1 -mt-0.5" aria-hidden="true" />
          Date
        </label>
        <Input
          id={`${idPrefix}-date`}
          type="date"
          value={date}
          min={todayStr}
          disabled={disabled}
          onChange={(e) => {
            onDateChange(e.target.value);
            onTimeChange(''); // reset slot when date changes
          }}
        />
      </div>

      <fieldset className="space-y-1.5" disabled={disabled || !date}>
        <legend className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5 inline mr-1 -mt-0.5" aria-hidden="true" />
          {' '}Available time slots
        </legend>
        <div
          className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto p-1"
          role="radiogroup"
          aria-label="Appointment time slot"
        >
          {slots.map((slot) => {
            const isBooked = bookedOnDate.has(slot);
            const isSelected = selectedTime === slot;
            return (
              <button
                key={slot}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isBooked}
                onClick={() => onTimeChange(slot)}
                className={cn(
                  'px-2 py-1.5 rounded-lg text-[11px] font-semibold border transition-all',
                  isSelected
                    ? 'bg-accent text-white border-accent shadow-md shadow-accent/30'
                    : isBooked
                      ? 'bg-surface-low border-border-subtle text-text-muted line-through cursor-not-allowed'
                      : 'bg-surface-low border-border-input text-text-secondary hover:border-accent hover:text-text-primary',
                )}
              >
                {formatSlotLabel(slot)}
                {isBooked && <span className="sr-only"> (booked)</span>}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
