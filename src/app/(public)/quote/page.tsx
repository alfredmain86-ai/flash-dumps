'use client';

import QuoteWizard from '@/components/quote/QuoteWizard';

const CHARCOAL = '#1A1A1A';
const DUST = '#FAF8F5';

export default function QuotePage() {
  return (
    <>
      {/* ── Dark charcoal hero banner ── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: CHARCOAL }}>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:py-24 text-center">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-5"
            style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
          >
            Get Your Instant Quote
          </h1>
          <p className="text-lg sm:text-xl max-w-xl mx-auto leading-relaxed text-white/70">
            Tell us about your debris and get a price estimate in under 2 minutes.
          </p>
        </div>
        {/* Diagonal bottom edge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-12 sm:h-20"
          style={{ backgroundColor: DUST, clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
        />
      </section>

      {/* ── Quote Wizard ── */}
      <section className="py-12 sm:py-16" style={{ backgroundColor: DUST }}>
        <div className="mx-auto max-w-3xl px-4">
          <QuoteWizard />
        </div>
      </section>

      {/* Bottom spacer for mobile sticky bar */}
      <div className="h-16 md:hidden" />
    </>
  );
}
