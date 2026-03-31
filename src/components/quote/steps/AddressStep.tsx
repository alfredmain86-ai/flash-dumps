'use client';

import { useState } from 'react';
import type { QuoteFormData, Locale } from '@/types';
import { t } from '@/lib/i18n';
import { isInServiceArea } from '@/lib/constants';
import { Input } from '@/components/ui/Input';

interface AddressStepProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
  locale: Locale;
}

export default function AddressStep({ formData, updateFormData, locale }: AddressStepProps) {
  const [outsideArea, setOutsideArea] = useState(false);

  const handleAddressChange = (value: string) => {
    updateFormData({ address: value });
    if (outsideArea) setOutsideArea(false);
  };

  const handleValidate = () => {
    if (formData.lat !== undefined && formData.lng !== undefined) {
      const inArea = isInServiceArea(formData.lat, formData.lng);
      setOutsideArea(!inArea);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-display text-2xl font-extrabold text-[#1A1A1A]">
          {t('quote.step3', locale)}
        </h2>
        <p className="font-body mt-2 text-[#1A1A1A]/60">
          {locale === 'es'
            ? 'Ingrese la dirección de recogida'
            : 'Enter the pickup address'}
        </p>
      </div>

      <div className="mx-auto max-w-md space-y-5">
        <Input
          label={locale === 'es' ? 'Dirección de Recogida' : 'Pickup Address'}
          placeholder={
            locale === 'es'
              ? 'Ej: 123 Main St, Miami, FL 33101'
              : 'e.g. 123 Main St, Miami, FL 33101'
          }
          value={formData.address}
          onChange={(e) => handleAddressChange(e.target.value)}
          onBlur={handleValidate}
          className="font-body h-12 border-2 border-[#E8E4DF] bg-white text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:border-[#FF6B00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.15)]"
        />

        <p className="font-body text-center text-xs italic text-[#1A1A1A]/30">
          {locale === 'es'
            ? 'Autocompletado con Google Maps disponible pronto'
            : 'Google Maps autocomplete coming soon'}
        </p>

        {outsideArea && (
          <div className="rounded-xl border-2 border-[#FFB800]/50 bg-[#FFB800]/10 p-4">
            <div className="flex gap-3">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#FFB800]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="font-body text-sm font-medium text-[#1A1A1A]/80">
                {t('quote.outside_area', locale)}
              </p>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-[#E8E4DF] bg-[#FAF8F5] p-4">
          <div className="flex gap-3">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-body text-sm text-[#1A1A1A]/70">
              {locale === 'es'
                ? 'Servimos todo el Condado Miami-Dade. Zonas principales: Miami Beach y Aventura. Sin recargo por distancia.'
                : 'We serve all of Miami-Dade County. Primary zones: Miami Beach & Aventura. No distance surcharge.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
