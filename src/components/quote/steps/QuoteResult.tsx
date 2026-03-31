'use client';

import type { QuoteFormData, PriceEstimate, Locale } from '@/types';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';

interface QuoteResultProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
  locale: Locale;
  estimate: PriceEstimate | null;
  onBook: () => void;
  onCallback: () => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

export default function QuoteResult({
  locale,
  estimate,
  onBook,
  onCallback,
  isSubmitting,
  isSubmitted,
}: QuoteResultProps) {
  if (isSubmitted) {
    return (
      <div className="space-y-8 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 shadow-lg shadow-green-100/50">
          <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="font-display text-3xl font-extrabold text-[#1A1A1A]">
            {t('quote.success', locale)}
          </h2>
          <p className="font-body mx-auto mt-3 max-w-sm text-[#1A1A1A]/60">
            {locale === 'es'
              ? 'Hemos recibido su solicitud. Un miembro de nuestro equipo se comunicara con usted dentro de las proximas 2 horas para confirmar los detalles.'
              : "We've received your request. A team member will reach out within 2 hours to confirm details."}
          </p>
        </div>
      </div>
    );
  }

  if (!estimate) return null;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-display text-2xl font-extrabold text-[#1A1A1A]">
          {t('quote.result', locale)}
        </h2>
      </div>

      {/* DRAMATIC price reveal */}
      <div className="relative overflow-hidden rounded-2xl bg-[#1A1A1A] p-10 text-center shadow-2xl">
        {/* Subtle orange glow effect */}
        <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-[#FF6B00]/10 blur-3xl" />
        <div className="relative">
          <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
            {t('quote.estimate_range', locale)}
          </p>
          <p className="mt-4 font-display text-5xl font-extrabold tracking-tight text-[#FF6B00] sm:text-6xl">
            ${estimate.finalMin.toLocaleString()}
            <span className="mx-2 text-3xl text-white/30">-</span>
            ${estimate.finalMax.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="overflow-hidden rounded-xl border-2 border-[#E8E4DF] bg-white">
        <div className="border-b border-[#E8E4DF] bg-[#FAF8F5] px-6 py-3">
          <h3 className="font-body text-xs font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/50">
            {locale === 'es' ? 'Desglose de Precio' : 'Price Breakdown'}
          </h3>
        </div>
        <div className="divide-y divide-[#E8E4DF]/60">
          {estimate.breakdown.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-3.5">
              <span className="font-body text-sm text-[#1A1A1A]/60">{item.label}</span>
              <span className="font-body text-sm font-bold text-[#1A1A1A]">{item.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between bg-[rgba(255,107,0,0.05)] px-6 py-4">
            <span className="font-body text-base font-bold text-[#1A1A1A]">
              {locale === 'es' ? 'Total Estimado' : 'Estimated Total'}
            </span>
            <span className="font-body text-lg font-extrabold text-[#FF6B00]">
              ${estimate.finalMin.toLocaleString()} - ${estimate.finalMax.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border border-[#E8E4DF] bg-[#FAF8F5] px-6 py-4">
        <p className="font-body text-center text-sm text-[#1A1A1A]/50">
          {t('quote.disclaimer', locale)}
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          onClick={onBook}
          className="font-body bg-[#FF6B00] text-lg font-bold shadow-lg shadow-[#FF6B00]/25 hover:bg-[#E55F00] hover:shadow-xl hover:shadow-[#FF6B00]/30"
        >
          {t('quote.book', locale)}
        </Button>
        <Button
          variant="outline"
          size="lg"
          fullWidth
          loading={isSubmitting}
          onClick={onCallback}
          className="font-body border-2 border-[#1A1A1A] text-lg font-bold text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
        >
          {t('quote.callback', locale)}
        </Button>
      </div>
    </div>
  );
}
