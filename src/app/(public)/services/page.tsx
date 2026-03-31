'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HardHat,
  Hammer,
  Boxes,
  CalendarClock,
  Zap,
  ChevronDown,
  ArrowRight,
  Truck,
} from 'lucide-react';

/* ── color tokens ── */
const CHARCOAL = '#1A1A1A';
const ORANGE = '#FF6B00';
const CONCRETE = '#E8E4DF';
const DUST = '#FAF8F5';
// const CAUTION = '#FFB800'; // available if needed

/* ── data ── */
const serviceDetails = [
  {
    icon: HardHat,
    title: 'Construction & Demolition Debris',
    description:
      'Full-service hauling for active construction and demolition sites across Miami-Dade County. Whether you are tearing down a single-family home or clearing a commercial lot, our trucks handle the heavy lifting.',
    features: [
      'Concrete & masonry removal',
      'Structural steel & rebar',
      'Framing lumber & foundation rubble',
      'Mixed site debris of any volume',
      'Same-week scheduling available',
    ],
    featured: true,
  },
  {
    icon: Hammer,
    title: 'Remodeling Waste Pickup',
    description:
      'Kitchen gut-outs, bathroom demolitions, flooring removals — remodeling projects generate a surprising amount of waste. We coordinate with your crew to pick up debris on your schedule without disrupting workflow.',
    features: [
      'Old cabinets & countertops',
      'Drywall, plaster & flooring',
      'Plumbing fixtures & appliances',
      'Flexible pickup windows',
      'Clean-site guarantee',
    ],
    featured: false,
  },
  {
    icon: Boxes,
    title: 'Heavy Materials Removal',
    description:
      'Concrete, metal, roofing — some materials require special handling due to weight, disposal regulations, or recycling requirements. We know which facilities accept what, and we route your load accordingly.',
    features: [
      'Concrete & brick recycling',
      'Metal & rebar scrap processing',
      'Roofing shingles & membrane',
      'Ceramic tile & porcelain',
      'Weight-based transparent pricing',
    ],
    featured: false,
  },
  {
    icon: CalendarClock,
    title: 'Recurring Scheduled Pickups',
    description:
      'Active job sites generate debris continuously. Our recurring pickup plans keep your site clean and code-compliant without you having to call each time.',
    features: [
      'Weekly & bi-weekly routes',
      'On-call retainer agreements',
      'Multi-site contractor packages',
      'Volume-based pricing discounts',
      'Dedicated account manager',
    ],
    featured: false,
  },
  {
    icon: Zap,
    title: 'Same-Day Service',
    description:
      'Surprise inspection? Unexpected demo work? Need debris gone before tomorrow\'s pour? Our same-day service gets a truck to your site ASAP — no surcharge, subject to availability.',
    features: [
      'Dispatch within hours',
      'No emergency surcharge',
      'Priority scheduling',
      'Available across Miami-Dade',
      'Monday - Friday, 8 AM - 5 PM',
    ],
    featured: false,
  },
];

const faqs = [
  {
    question: 'What types of construction debris do you haul?',
    answer:
      'We handle all common construction and demolition waste: concrete, brick, drywall, wood, metal, rebar, roofing materials, tile, appliances, and mixed debris. We do not transport hazardous materials such as asbestos, lead paint, or chemicals.',
  },
  {
    question: 'How quickly can you pick up my debris?',
    answer:
      'Standard pickups are scheduled within 24-48 hours. Same-day service is available at no extra charge, subject to truck availability. We operate Monday through Friday, 8 AM to 5 PM, serving all of Miami-Dade County.',
  },
  {
    question: 'How is pricing determined?',
    answer:
      'Pricing is based on load size: Light load (1/4 truck) $200-$250, Medium load (1/2 truck) $250-$350, Full truck $500-$650. Minimum charge is $150. Extra weight over 2 tons is $70/ton. No distance surcharge within Miami-Dade County. Recurring customers get discounts: Weekly 15% off, Bi-weekly 10% off, Retainer/On-call 20% off.',
  },
  {
    question: 'Do you recycle construction debris?',
    answer:
      'Yes. Clean concrete, brick, and stone go to Asis Concrete Landfill for recycling at no cost. Non-recyclable mixed debris goes to Coastal Waste & Recycling. Metal and rebar go to scrap processors. We route each load to the most appropriate facility to minimize disposal costs and environmental impact.',
  },
  {
    question: 'Are you licensed and insured?',
    answer:
      'Absolutely. We are fully licensed to operate in Miami-Dade County and carry comprehensive general liability and commercial auto insurance. Certificates of insurance (COIs) are available upon request.',
  },
  {
    question: 'Do you offer service in Spanish?',
    answer:
      'Yes. Our entire team is fully bilingual — English and Spanish. Drivers, dispatchers, and customer service staff all speak both languages. Our website and quote system are available in Spanish as well.',
  },
];

export default function ServicesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: CHARCOAL }}>
        {/* Diagonal bottom edge */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:py-28 text-center">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6"
            style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
          >
            Our Services
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed text-white/70">
            Comprehensive debris removal for every job site in Miami-Dade County.
            From single-room remodels to full-scale demolition — we haul it all.
          </p>
        </div>
        {/* Diagonal clip */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 sm:h-24"
          style={{ backgroundColor: DUST, clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
        />
      </section>

      {/* ── Service Detail Sections ── */}
      {serviceDetails.map((svc, idx) => {
        const bgColor = idx % 2 === 0 ? DUST : '#FFFFFF';
        return (
          <section key={svc.title} style={{ backgroundColor: bgColor }} className="py-16 sm:py-20">
            <div
              className={`mx-auto max-w-7xl px-4 ${
                svc.featured ? '' : 'grid lg:grid-cols-2 gap-12 items-start'
              }`}
            >
              {svc.featured ? (
                /* Featured service — full-width layout */
                <div className="text-center max-w-4xl mx-auto">
                  <div
                    className="inline-flex items-center justify-center h-20 w-20 rounded-2xl mb-8"
                    style={{ backgroundColor: `${ORANGE}15` }}
                  >
                    <svc.icon className="h-12 w-12" style={{ color: ORANGE }} strokeWidth={2} />
                  </div>
                  <h2
                    className="text-3xl sm:text-4xl font-black tracking-tight mb-6"
                    style={{ color: CHARCOAL, fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
                  >
                    {svc.title}
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                    {svc.description}
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto text-left">
                    {svc.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-3">
                        <span
                          className="mt-2 h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: ORANGE }}
                        />
                        <span className="text-gray-700">{feat}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/quote"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-white font-bold text-sm uppercase tracking-wider transition-all hover:opacity-90"
                    style={{ backgroundColor: ORANGE }}
                  >
                    Get a Quote
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                /* Standard service — two-column layout */
                <>
                  <div>
                    <div
                      className="inline-flex items-center justify-center h-16 w-16 rounded-2xl mb-6"
                      style={{ backgroundColor: `${ORANGE}15` }}
                    >
                      <svc.icon className="h-12 w-12" style={{ color: ORANGE }} strokeWidth={2} />
                    </div>
                    <h2
                      className="text-2xl sm:text-3xl font-black tracking-tight mb-4"
                      style={{ color: CHARCOAL, fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
                    >
                      {svc.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-base">
                      {svc.description}
                    </p>
                  </div>
                  <div>
                    <ul className="space-y-3 mb-8">
                      {svc.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-3 text-gray-700">
                          <span
                            className="mt-2 h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: ORANGE }}
                          />
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/quote"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-bold text-sm uppercase tracking-wider transition-all hover:opacity-90"
                      style={{ backgroundColor: ORANGE }}
                    >
                      Get a Quote
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </section>
        );
      })}

      {/* ── Mid-page CTA ── */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: ORANGE }}>
        <div className="mx-auto max-w-7xl px-4 text-center">
          <Truck className="h-12 w-12 text-white mx-auto mb-6" strokeWidth={2} />
          <h2
            className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4"
            style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
          >
            Ready to get started?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-lg mx-auto">
            Get a free estimate in under 2 minutes. No commitment, no hassle.
          </p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-white font-bold text-sm uppercase tracking-wider transition-all hover:opacity-90"
            style={{ backgroundColor: CHARCOAL }}
          >
            Get Your Free Quote
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: DUST }}>
        <div className="mx-auto max-w-3xl px-4">
          <h2
            className="text-3xl sm:text-4xl font-black text-center tracking-tight mb-12"
            style={{ color: CHARCOAL, fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl overflow-hidden border transition-colors"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: openFaq === idx ? ORANGE : CONCRETE,
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors cursor-pointer hover:bg-gray-50/50"
                >
                  <span className="font-bold pr-4" style={{ color: CHARCOAL }}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 transition-transform duration-300"
                    style={{
                      color: openFaq === idx ? ORANGE : '#9CA3AF',
                      transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom spacer for mobile sticky bar */}
      <div className="h-16 md:hidden" />
    </>
  );
}
