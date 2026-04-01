'use client';

import { Check } from 'lucide-react';
import type { BookingStatus } from '@/types';

const STEPS: { key: BookingStatus; label: string }[] = [
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'en_route', label: 'En Route' },
  { key: 'arrived', label: 'On Site' },
  { key: 'loading', label: 'Loading' },
  { key: 'completed', label: 'Completed' },
];

const STATUS_ORDER: Record<BookingStatus, number> = {
  scheduled: 0,
  confirmed: 1,
  en_route: 2,
  arrived: 3,
  loading: 4,
  completed: 5,
  cancelled: -1,
};

interface StatusTimelineProps {
  status: BookingStatus;
  onStatusChange?: (status: BookingStatus) => void;
}

export default function StatusTimeline({ status, onStatusChange }: StatusTimelineProps) {
  const currentIdx = STATUS_ORDER[status];

  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20">
        <span className="text-sm font-medium text-[#EF4444]">Cancelled</span>
      </div>
    );
  }

  return (
    <div aria-label={`Job status: ${status.replace('_', ' ')}`}>
      {/* Timeline */}
      <div className="flex items-center gap-0 overflow-x-auto pb-2">
        {STEPS.map((step, i) => {
          const isComplete = i < currentIdx;
          const isCurrent = i === currentIdx;
          const isFuture = i > currentIdx;

          return (
            <div key={step.key} className="flex items-center">
              {/* Step dot */}
              <button
                type="button"
                onClick={() => onStatusChange?.(step.key)}
                disabled={!onStatusChange}
                className={`flex flex-col items-center min-w-[72px] ${
                  onStatusChange ? 'cursor-pointer' : 'cursor-default'
                }`}
                aria-label={`${step.label}${isCurrent ? ' (current)' : isComplete ? ' (completed)' : ''}`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isComplete
                      ? 'bg-[#22C55E] text-white'
                      : isCurrent
                      ? 'bg-[#FF6B00] text-white ring-4 ring-[#FF6B00]/20'
                      : 'bg-white/[0.06] text-white/30'
                  }`}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1.5 font-medium whitespace-nowrap ${
                    isCurrent ? 'text-[#FF6B00]' : isComplete ? 'text-[#22C55E]/80' : 'text-white/30'
                  }`}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-6 -mt-5 ${
                    i < currentIdx ? 'bg-[#22C55E]' : 'bg-white/[0.08]'
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
