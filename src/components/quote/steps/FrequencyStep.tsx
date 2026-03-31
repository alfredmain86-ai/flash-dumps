'use client';

import type { QuoteFormData, PickupFrequency, Locale } from '@/types';
import { FREQUENCY_INFO } from '@/types';
import { t } from '@/lib/i18n';
import { DEFAULT_PRICING } from '@/lib/pricing';

interface FrequencyStepProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
  locale: Locale;
}

const frequencies = Object.keys(FREQUENCY_INFO) as PickupFrequency[];

export default function FrequencyStep({ formData, updateFormData, locale }: FrequencyStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-display text-2xl font-extrabold text-[#1A1A1A]">
          {t('quote.step4', locale)}
        </h2>
        <p className="font-body mt-2 text-[#1A1A1A]/60">
          {locale === 'es'
            ? 'Seleccione la frecuencia de recogida que necesita'
            : 'How often do you need pickups?'}
        </p>
      </div>

      <div className="mx-auto grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
        {frequencies.map((freq) => {
          const info = FREQUENCY_INFO[freq];
          const isSelected = formData.frequency === freq;
          const discount = DEFAULT_PRICING.frequency_discounts[freq];

          return (
            <button
              key={freq}
              type="button"
              onClick={() => updateFormData({ frequency: freq })}
              className={`
                relative flex w-full items-center gap-4 rounded-xl border-2 px-5 py-4
                transition-all duration-200 cursor-pointer
                hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40 focus:ring-offset-2
                ${
                  isSelected
                    ? 'border-[#FF6B00] bg-[rgba(255,107,0,0.05)] shadow-md'
                    : 'border-[#E8E4DF] bg-white hover:border-[#E8E4DF]/80 hover:bg-[#FAF8F5]'
                }
              `}
            >
              {/* Radio indicator */}
              <div
                className={`
                  flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2
                  transition-colors duration-200
                  ${isSelected ? 'border-[#FF6B00]' : 'border-[#E8E4DF]'}
                `}
              >
                {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-[#FF6B00]" />}
              </div>

              <span className="font-body text-left text-base font-semibold text-[#1A1A1A]">
                {locale === 'es' ? info.labelEs : info.label}
              </span>

              {discount > 0 && (
                <span className="ml-auto rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                  {locale === 'es' ? `${discount * 100}% desc.` : `Save ${discount * 100}%`}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
