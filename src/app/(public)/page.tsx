'use client';

import Link from 'next/link';
import {
  ClipboardList,
  CheckCircle,
  Truck,
  Shield,
  Leaf,
  Clock,
  Languages,
  HardHat,
  Hammer,
  Boxes,
  CalendarClock,
  Zap,
  Star,
  Phone,
  ArrowRight,
  ChevronDown,
  MessageCircle,
  Gauge,
  Weight,
} from 'lucide-react';
import { COMPANY_NAME, COMPANY_PHONE, COMPANY_WHATSAPP, formatPhone } from '@/lib/constants';
import { t } from '@/lib/i18n';
import { useLocaleStore } from '@/store/locale';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const services = [
  {
    title: 'Construction & Demolition Debris',
    icon: HardHat,
    desc: 'Complete teardown debris removal from residential and commercial sites. Concrete, rebar, framing — we handle it all.',
    featured: true,
  },
  {
    title: 'Remodeling Waste Pickup',
    icon: Hammer,
    desc: 'Kitchen, bathroom, and whole-home remodel waste. We work around your contractor schedule.',
  },
  {
    title: 'Heavy Materials (Concrete, Metal, Roofing)',
    icon: Boxes,
    desc: 'Specialized hauling for concrete, drywall, wood, metal, roofing materials, tile, and fixtures.',
  },
  {
    title: 'Recurring Scheduled Pickups',
    icon: CalendarClock,
    desc: 'Weekly or bi-weekly pickups for active job sites. Retainer plans for GCs with multiple projects.',
  },
  {
    title: 'Emergency Same-Day Service',
    icon: Zap,
    desc: 'Need debris gone today? Our same-day emergency service gets a truck to your site ASAP.',
  },
];

const testimonials = [
  {
    name: 'Carlos Menendez',
    company: 'Menendez General Contracting',
    rating: 5,
    text: 'We use them on every remodel job in Doral and Kendall. They show up on time, load fast, and the pricing is always fair. No surprises on the invoice.',
  },
  {
    name: 'Jennifer Lawson',
    company: 'Bayfront Project Management, Miami Beach',
    rating: 5,
    text: 'Had a tight deadline on a condo renovation in South Beach. They did a same-day pickup of 4 tons of concrete and drywall. Saved us from a code violation.',
  },
  {
    name: 'Roberto Suarez',
    company: 'Suarez Roofing Co., Hialeah',
    rating: 5,
    text: 'Bilingual service is huge for our crews. The drivers speak Spanish, the invoicing is clean, and they recycle what they can. Best hauling company in Miami-Dade.',
  },
];

const trucks = [
  {
    name: 'Flash 1 — 2014 Isuzu NPR',
    capacity: '12 cubic yards',
    status: 'Ready to Roll',
    desc: 'Primary truck for construction and demolition debris removal across Miami-Dade County.',
  },
  {
    name: 'Flash 2 — 2006 Isuzu NPR',
    capacity: '12 cubic yards',
    status: 'Ready to Roll',
    desc: 'Reliable workhorse for remodel jobs, recurring pickups, and Miami Beach service area.',
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const { locale } = useLocaleStore();
  const tr = (key: string) => t(key, locale);

  return (
    <>
      {/* ============================================================ */}
      {/*  HERO — Full viewport                                        */}
      {/* ============================================================ */}
      <section className="relative min-h-screen flex items-center bg-[#1A1A1A] text-white overflow-hidden">
        {/* Grain texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-4xl">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight animate-fade-in-up">
              Miami&rsquo;s Fastest
              <br />
              <span className="text-[#FF6B00]">Construction Debris</span>
              <br />
              Removal
            </h1>

            <p className="mt-6 max-w-2xl text-lg sm:text-xl font-body text-[#E8E4DF] leading-relaxed animate-fade-in-up animation-delay-100">
              Fast, professional hauling for demolition sites, remodels, and
              construction projects across Miami-Dade County. Licensed, insured,
              and ready today.
            </p>

            {/* Stat counters */}
            <div className="mt-10 flex flex-wrap gap-8 sm:gap-12 animate-fade-in-up animation-delay-200">
              {[
                { value: '500+', label: 'Jobs Completed' },
                { value: '6+', label: 'Years Experience' },
                { value: 'Same-Day', label: 'Available' },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="block text-3xl sm:text-4xl font-extrabold font-display text-[#FF6B00]">
                    {stat.value}
                  </span>
                  <span className="text-sm font-body text-[#E8E4DF]/70 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#FF6B00]/25 transition-all duration-200 hover:bg-[#E55F00] hover:shadow-xl hover:shadow-[#FF6B00]/30 active:scale-[0.98]"
              >
                Get Instant Quote
                <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
              </Link>
              <a
                href={`tel:${COMPANY_PHONE}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#FF6B00] px-8 py-4 text-lg font-bold text-[#FF6B00] transition-all duration-200 hover:bg-[#FF6B00] hover:text-white active:scale-[0.98]"
              >
                <Phone className="h-5 w-5" strokeWidth={2.5} />
                Call Now
              </a>
            </div>

            {/* Phone number */}
            <p className="mt-5 font-body text-[#E8E4DF]/60 text-base animate-fade-in-up animation-delay-400">
              <Phone className="inline h-4 w-4 mr-1.5 -mt-0.5" strokeWidth={2} />
              {formatPhone(COMPANY_PHONE)}
            </p>
          </div>
        </div>

        {/* Bouncing scroll chevron */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="h-8 w-8 text-[#FF6B00]/60" strokeWidth={2.5} />
        </div>

        {/* Diagonal slash at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 bg-[#FF6B00]"
          style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
        />
      </section>

      {/* ============================================================ */}
      {/*  TRUST SIGNALS BAR                                           */}
      {/* ============================================================ */}
      <section className="bg-[#FF6B00] text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm sm:text-base font-bold font-body">
            {[
              { icon: Shield, label: tr('trust.licensed') },
              { icon: Leaf, label: tr('trust.eco') },
              { icon: Clock, label: tr('trust.sameday') },
              { icon: Languages, label: tr('trust.bilingual') },
              { icon: ClipboardList, label: tr('trust.estimates') },
            ].map((item) => (
              <span key={item.label} className="flex items-center gap-2.5">
                <item.icon className="h-6 w-6" strokeWidth={2.5} />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS                                                */}
      {/* ============================================================ */}
      <section className="bg-[#FAF8F5] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-center text-[#1A1A1A] mb-16">
            {tr('how.title')}
          </h2>

          <div className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                icon: ClipboardList,
                step: 1,
                title: tr('how.step1.title'),
                desc: tr('how.step1.desc'),
                delay: '',
              },
              {
                icon: CheckCircle,
                step: 2,
                title: tr('how.step2.title'),
                desc: tr('how.step2.desc'),
                delay: 'animation-delay-100',
              },
              {
                icon: Truck,
                step: 3,
                title: tr('how.step3.title'),
                desc: tr('how.step3.desc'),
                delay: 'animation-delay-200',
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`relative bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 pt-12 text-center animate-fade-in-up ${item.delay}`}
              >
                {/* Step number circle */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B00] text-white text-lg font-extrabold font-display shadow-lg shadow-[#FF6B00]/30">
                  {item.step}
                </div>
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-[#1A1A1A]/5">
                  <item.icon className="h-8 w-8 text-[#1A1A1A]" strokeWidth={2.5} />
                </div>
                <h3 className="font-display text-xl font-bold text-[#1A1A1A] mb-3">
                  {item.title}
                </h3>
                <p className="font-body text-[#1A1A1A]/60 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SERVICES GRID                                               */}
      {/* ============================================================ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-center text-[#1A1A1A] mb-6">
            {tr('services.title')}
          </h2>
          <p className="text-center font-body text-[#1A1A1A]/50 mb-14 max-w-2xl mx-auto text-lg">
            From single-room remodels to full demolition sites, we have the
            trucks and crew to handle any construction waste in Miami-Dade
            County.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <div
                key={svc.title}
                className={`group relative bg-[#1A1A1A] rounded-2xl p-8 border-l-4 border-transparent transition-all duration-300 hover:scale-[1.02] hover:border-[#FF6B00] hover:shadow-2xl hover:shadow-[#FF6B00]/10 ${
                  svc.featured ? 'md:col-span-2' : ''
                } animate-fade-in-up animation-delay-${i * 100}`}
              >
                {/* Orange accent line — always visible on left */}
                <div className="absolute left-0 top-6 bottom-6 w-1 rounded-full bg-[#FF6B00]/40 group-hover:bg-[#FF6B00] transition-colors" />

                <svc.icon
                  className="h-10 w-10 text-[#FF6B00] mb-5"
                  strokeWidth={2.5}
                />
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  {svc.title}
                </h3>
                <p className="font-body text-white/60 text-sm leading-relaxed">
                  {svc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FLEET SHOWCASE                                              */}
      {/* ============================================================ */}
      <section className="bg-[#1A1A1A] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-center text-white mb-14">
            Our Fleet
          </h2>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {trucks.map((truck) => (
              <div
                key={truck.name}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden transition-all duration-300 hover:border-[#FF6B00]/40"
              >
                {/* Header */}
                <div className="px-7 py-5 border-b border-white/10 flex items-center gap-4">
                  <Truck className="h-8 w-8 text-[#FF6B00] flex-shrink-0" strokeWidth={2.5} />
                  <h3 className="font-display text-lg font-bold text-white">
                    {truck.name}
                  </h3>
                </div>

                {/* Body */}
                <div className="px-7 py-6 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Capacity badge */}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6B00]/15 px-4 py-1.5 text-sm font-bold text-[#FF6B00]">
                      <Weight className="h-4 w-4" strokeWidth={2.5} />
                      {truck.capacity}
                    </span>
                    {/* Status badge */}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#22C55E]/15 px-4 py-1.5 text-sm font-bold text-[#22C55E]">
                      <Gauge className="h-4 w-4" strokeWidth={2.5} />
                      {truck.status}
                    </span>
                  </div>
                  <p className="font-body text-white/50 text-sm leading-relaxed">
                    {truck.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TESTIMONIALS                                                */}
      {/* ============================================================ */}
      <section className="bg-[#FAF8F5] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-center text-[#1A1A1A] mb-14">
            What Our Clients Say
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((review, i) => (
              <div
                key={review.name}
                className={`bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 animate-fade-in-up animation-delay-${i * 100}`}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-5 w-5 fill-[#FF6B00] text-[#FF6B00]"
                      strokeWidth={2}
                    />
                  ))}
                </div>

                <p className="font-body text-[#1A1A1A]/70 text-base leading-relaxed mb-6 italic">
                  &ldquo;{review.text}&rdquo;
                </p>

                <div>
                  <p className="font-display font-bold text-[#1A1A1A] text-base">
                    {review.name}
                  </p>
                  <p className="font-body text-sm text-[#1A1A1A]/40 mt-0.5">
                    {review.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FINAL CTA                                                   */}
      {/* ============================================================ */}
      <section className="bg-[#1A1A1A] text-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 text-center">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-5">
            Ready to Clear Your Site?
          </h2>
          <p className="font-body text-white/50 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Get a fast, no-obligation quote for your construction debris
            removal. Same-day service available — most requests priced within
            minutes.
          </p>

          <Link
            href="/quote"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-10 py-5 text-xl font-bold text-white shadow-lg shadow-[#FF6B00]/25 transition-all duration-200 hover:bg-[#E55F00] hover:shadow-xl hover:shadow-[#FF6B00]/30 active:scale-[0.98]"
          >
            Get Your Free Quote
            <ArrowRight className="h-6 w-6" strokeWidth={2.5} />
          </Link>

          <p className="mt-6 font-body text-white/40 text-base">
            <Phone className="inline h-4 w-4 mr-1.5 -mt-0.5" strokeWidth={2} />
            {formatPhone(COMPANY_PHONE)}
          </p>
        </div>
      </section>

      {/* Bottom spacer for mobile sticky bar */}
      <div className="h-16 md:hidden" />

      {/* ============================================================ */}
      {/*  FLOATING WHATSAPP BUTTON                                    */}
      {/* ============================================================ */}
      <a
        href={`https://wa.me/${COMPANY_WHATSAPP.replace(/\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#22C55E] text-white shadow-lg shadow-[#22C55E]/30 transition-all duration-200 hover:scale-110 hover:shadow-xl hover:shadow-[#22C55E]/40 active:scale-95"
      >
        <MessageCircle className="h-8 w-8" strokeWidth={2.5} />
      </a>
    </>
  );
}
