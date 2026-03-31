'use client';

import type { QuoteFormData, WasteType, Locale } from '@/types';
import { WASTE_TYPE_INFO } from '@/types';
import { t } from '@/lib/i18n';

interface WasteTypeStepProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
  locale: Locale;
}

const wasteTypes = Object.keys(WASTE_TYPE_INFO) as WasteType[];

export default function WasteTypeStep({ formData, updateFormData, locale }: WasteTypeStepProps) {
  const toggleType = (type: WasteType) => {
    const current = formData.wasteTypes;
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    updateFormData({ wasteTypes: updated });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-display text-2xl font-extrabold text-[#1A1A1A]">
          {t('quote.step1', locale)}
        </h2>
        <p className="font-body mt-2 text-[#1A1A1A]/60">
          {locale === 'es'
            ? 'Seleccione todos los tipos de materiales que necesita recoger'
            : 'Select all the material types you need picked up'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {wasteTypes.map((type) => {
          const info = WASTE_TYPE_INFO[type];
          const isSelected = formData.wasteTypes.includes(type);

          return (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              className={`
                group relative flex flex-col items-center gap-3 rounded-xl border-2 p-5 sm:p-6
                transition-all duration-200 cursor-pointer
                hover:shadow-md hover:-translate-y-0.5
                focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40 focus:ring-offset-2
                ${
                  isSelected
                    ? 'border-[#FF6B00] bg-[rgba(255,107,0,0.05)] shadow-md'
                    : 'border-[#E8E4DF] bg-white hover:border-[#E8E4DF]/80 hover:bg-[#FAF8F5]'
                }
              `}
            >
              {/* Selected checkmark badge */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF6B00] shadow-sm">
                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              <span className="text-4xl transition-transform duration-200 group-hover:scale-110">{info.icon}</span>
              <span className="font-body text-center text-sm font-semibold leading-tight text-[#1A1A1A]">
                {locale === 'es' ? info.labelEs : info.label}
              </span>
            </button>
          );
        })}
      </div>

      {formData.wasteTypes.length === 0 && (
        <p className="font-body text-center text-sm text-[#FFB800]">
          {locale === 'es'
            ? 'Seleccione al menos un tipo de material para continuar'
            : 'Select at least one material type to continue'}
        </p>
      )}

      {formData.wasteTypes.length > 0 && (
        <p className="font-body text-center text-sm text-[#1A1A1A]/50">
          {formData.wasteTypes.length} {locale === 'es' ? 'seleccionado(s)' : 'selected'}
        </p>
      )}
    </div>
  );
}
