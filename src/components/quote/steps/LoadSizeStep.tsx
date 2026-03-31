'use client';

import type { QuoteFormData, LoadSize, Locale } from '@/types';
import { LOAD_SIZE_INFO } from '@/types';
import { t } from '@/lib/i18n';

interface LoadSizeStepProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
  locale: Locale;
}

const loadSizes = Object.keys(LOAD_SIZE_INFO) as LoadSize[];
const fillPercentage: Record<LoadSize, number> = {
  light: 25,
  medium: 50,
  heavy: 75,
  full_truck: 100,
};

export default function LoadSizeStep({ formData, updateFormData, locale }: LoadSizeStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-display text-2xl font-extrabold text-[#1A1A1A]">
          {t('quote.step2', locale)}
        </h2>
        <p className="font-body mt-2 text-[#1A1A1A]/60">
          {locale === 'es'
            ? 'Estime la cantidad de material a recoger'
            : 'Estimate how much material needs to be picked up'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loadSizes.map((size) => {
          const info = LOAD_SIZE_INFO[size];
          const isSelected = formData.loadSize === size;
          const fill = fillPercentage[size];

          return (
            <button
              key={size}
              type="button"
              onClick={() => updateFormData({ loadSize: size })}
              className={`
                group flex flex-col items-center gap-4 rounded-xl border-2 p-5
                transition-all duration-200 cursor-pointer
                hover:shadow-md hover:-translate-y-0.5
                focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40 focus:ring-offset-2
                ${
                  isSelected
                    ? 'border-[#FF6B00] bg-[rgba(255,107,0,0.05)] shadow-lg'
                    : 'border-[#E8E4DF] bg-white hover:border-[#E8E4DF]/80 hover:bg-[#FAF8F5]'
                }
              `}
            >
              {/* Truck fill indicator bar */}
              <div className="w-full space-y-2">
                <div className="font-body text-center text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/40">
                  {fill}%
                </div>
                <div className="relative h-5 w-full overflow-hidden rounded-full bg-[#E8E4DF]">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${fill}%`,
                      backgroundColor: isSelected ? '#FF6B00' : '#9CA3AF',
                    }}
                  />
                </div>
              </div>

              <div className="text-center">
                <span className="font-body block text-base font-bold text-[#1A1A1A]">
                  {locale === 'es' ? info.labelEs : info.label}
                </span>
                <span className="font-body mt-1 block text-sm text-[#1A1A1A]/50">
                  {locale === 'es' ? info.descriptionEs : info.description}
                </span>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF6B00] shadow-sm">
                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
