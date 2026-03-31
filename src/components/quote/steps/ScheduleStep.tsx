'use client';

import type { QuoteFormData, TimeSlot, Locale } from '@/types';
import { TIME_SLOT_INFO } from '@/types';
import { t } from '@/lib/i18n';
import { Input } from '@/components/ui/Input';

interface ScheduleStepProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
  locale: Locale;
}

const timeSlots = Object.keys(TIME_SLOT_INFO) as TimeSlot[];

function getTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export default function ScheduleStep({ formData, updateFormData, locale }: ScheduleStepProps) {
  const handleSlotSelect = (slot: TimeSlot) => {
    updateFormData({
      timeSlot: slot,
      isEmergency: slot === 'emergency',
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-display text-2xl font-extrabold text-[#1A1A1A]">
          {t('quote.step5', locale)}
        </h2>
        <p className="font-body mt-2 text-[#1A1A1A]/60">
          {locale === 'es'
            ? 'Elija su fecha y horario preferido'
            : 'Choose your preferred date and time'}
        </p>
      </div>

      <div className="mx-auto max-w-md space-y-6">
        {/* Date picker */}
        <Input
          type="date"
          label={locale === 'es' ? 'Fecha Preferida' : 'Preferred Date'}
          value={formData.preferredDate ?? ''}
          min={getTomorrow()}
          onChange={(e) => updateFormData({ preferredDate: e.target.value })}
          className="font-body h-12 border-2 border-[#E8E4DF] bg-white text-[#1A1A1A] focus:border-[#FF6B00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.15)]"
        />

        {/* Time slot selection */}
        <div className="space-y-3">
          <label className="font-body block text-sm font-semibold text-[#1A1A1A]">
            {locale === 'es' ? 'Horario' : 'Time Slot'}
          </label>

          {timeSlots.map((slot) => {
            const info = TIME_SLOT_INFO[slot];
            const isSelected = formData.timeSlot === slot;
            const isEmergency = slot === 'emergency';

            return (
              <button
                key={slot}
                type="button"
                onClick={() => handleSlotSelect(slot)}
                className={`
                  flex w-full items-center justify-between rounded-xl border-2 px-5 py-4
                  transition-all duration-200 cursor-pointer
                  hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40 focus:ring-offset-2
                  ${
                    isSelected
                      ? isEmergency
                        ? 'border-[#FFB800] bg-[#FFB800]/10 shadow-md'
                        : 'border-[#FF6B00] bg-[rgba(255,107,0,0.05)] shadow-md'
                      : isEmergency
                        ? 'border-[#E8E4DF] bg-white hover:border-[#FFB800]/50 hover:bg-[#FFB800]/5'
                        : 'border-[#E8E4DF] bg-white hover:border-[#E8E4DF]/80 hover:bg-[#FAF8F5]'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  {/* Radio indicator */}
                  <div
                    className={`
                      flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2
                      transition-colors duration-200
                      ${
                        isSelected
                          ? isEmergency
                            ? 'border-[#FFB800]'
                            : 'border-[#FF6B00]'
                          : 'border-[#E8E4DF]'
                      }
                    `}
                  >
                    {isSelected && (
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${
                          isEmergency ? 'bg-[#FFB800]' : 'bg-[#FF6B00]'
                        }`}
                      />
                    )}
                  </div>

                  <div className="text-left">
                    <span className="font-body block text-base font-semibold text-[#1A1A1A]">
                      {locale === 'es' ? info.labelEs : info.label}
                    </span>
                    <span className="font-body block text-sm text-[#1A1A1A]/50">{info.description}</span>
                  </div>
                </div>

                {isEmergency && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    No surcharge
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {formData.isEmergency && (
          <div className="rounded-xl border-2 border-[#22C55E]/50 bg-[#22C55E]/10 p-4">
            <div className="flex gap-3">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="font-body text-sm font-medium text-[#1A1A1A]/80">
                {locale === 'es'
                  ? 'Servicio el mismo día disponible sin recargo adicional. Sujeto a disponibilidad.'
                  : 'Same-day service available at no extra charge. Subject to availability.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
