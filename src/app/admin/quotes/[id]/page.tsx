'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Phone, Mail, MapPin, ArrowRight, DollarSign,
  AlertTriangle, Clock, Calendar,
} from 'lucide-react';
import { useAdminStore } from '@/store/admin';
import { formatPhone } from '@/lib/constants';
import { Badge } from '@/components/ui';
import { WASTE_TYPE_INFO, LOAD_SIZE_INFO, FREQUENCY_INFO, TIME_SLOT_INFO } from '@/types';
import type { QuoteStatus } from '@/types';

function statusBadgeVariant(s: QuoteStatus) {
  const map: Record<QuoteStatus, string> = {
    new: 'warning', reviewed: 'info', priced: 'info', sent: 'info',
    accepted: 'success', booked: 'completed', expired: 'error',
  };
  return (map[s] ?? 'default') as 'warning' | 'info' | 'success' | 'completed' | 'error' | 'default';
}

export default function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { quotes, updateQuote, addQuoteActivity } = useAdminStore();
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [adjustedPrice, setAdjustedPrice] = useState<number>(0);

  const quote = quotes.find((q) => q.id === id);
  if (!quote) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-white/40 text-lg mb-4">Quote not found</p>
        <Link href="/admin/quotes" className="text-[#FF6B00] hover:underline text-sm">Back to Quotes</Link>
      </div>
    );
  }

  const handleStatusChange = (status: QuoteStatus) => {
    updateQuote(quote.id, { status, updated_at: new Date().toISOString() });
    addQuoteActivity(quote.id, {
      id: `al-${Date.now()}`,
      content: `Status changed to ${status}`,
      created_at: new Date().toISOString(),
      author: 'Admin',
    });
  };

  const handlePriceAdjust = () => {
    if (adjustedPrice <= 0) return;
    updateQuote(quote.id, {
      admin_adjusted_price: adjustedPrice,
      status: 'priced',
      updated_at: new Date().toISOString(),
    });
    addQuoteActivity(quote.id, {
      id: `al-${Date.now()}`,
      content: `Price adjusted to $${adjustedPrice}`,
      created_at: new Date().toISOString(),
      author: 'Admin',
    });
    setShowPriceModal(false);
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-white/[0.06] text-white/50 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{quote.reference}</h1>
          <p className="text-sm text-white/40">Created {new Date(quote.created_at).toLocaleDateString()}</p>
        </div>
        <Badge variant={statusBadgeVariant(quote.status)}>{quote.status}</Badge>
      </div>

      {/* Emergency badge */}
      {quote.is_emergency && (
        <div className="mb-4 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 p-3 flex items-center gap-2" role="alert">
          <AlertTriangle className="h-4 w-4 text-[#EF4444]" aria-hidden="true" />
          <span className="text-sm font-medium text-[#EF4444]">Emergency / ASAP Request</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['new', 'reviewed', 'priced'].includes(quote.status) && (
          <button
            onClick={() => handleStatusChange(quote.status === 'new' ? 'reviewed' : 'sent')}
            className="px-4 py-2.5 rounded-lg bg-[#FF6B00] hover:bg-[#E55F00] text-white text-sm font-semibold min-h-[44px] transition-colors"
          >
            {quote.status === 'new' ? 'Mark Reviewed' : 'Send to Customer'}
          </button>
        )}
        {quote.status === 'sent' && (
          <button
            onClick={() => handleStatusChange('accepted')}
            className="px-4 py-2.5 rounded-lg bg-[#22C55E] hover:bg-[#16A34A] text-white text-sm font-semibold min-h-[44px] transition-colors"
          >
            Mark Accepted
          </button>
        )}
        {['accepted', 'reviewed', 'priced'].includes(quote.status) && (
          <Link
            href={`/admin/bookings/new?quote_id=${quote.id}`}
            className="px-4 py-2.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold min-h-[44px] flex items-center gap-2 transition-colors"
          >
            Convert to Booking
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
        <button
          onClick={() => { setAdjustedPrice(quote.admin_adjusted_price ?? quote.estimated_price_max); setShowPriceModal(true); }}
          className="px-4 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/70 text-sm font-medium min-h-[44px] flex items-center gap-2 transition-colors"
        >
          <DollarSign className="h-4 w-4" aria-hidden="true" />
          Adjust Price
        </button>
      </div>

      {/* Price adjustment modal */}
      {showPriceModal && (
        <div className="mb-6 rounded-xl bg-white/[0.04] border border-[#FF6B00]/30 p-5">
          <h3 className="text-sm font-semibold mb-3">Adjust Price</h3>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-xs text-white/40">
              Estimate: ${quote.estimated_price_min}–${quote.estimated_price_max}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-[200px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">$</span>
              <input
                type="number"
                value={adjustedPrice || ''}
                onChange={(e) => setAdjustedPrice(Number(e.target.value))}
                className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] pl-7 pr-3 py-2.5 text-sm text-white"
                aria-label="Adjusted price"
              />
            </div>
            <button onClick={handlePriceAdjust} className="px-4 py-2.5 rounded-lg bg-[#FF6B00] text-white text-sm font-semibold min-h-[44px]">
              Save
            </button>
            <button onClick={() => setShowPriceModal(false)} className="px-4 py-2.5 rounded-lg bg-white/[0.06] text-white/60 text-sm min-h-[44px]">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main details */}
        <div className="md:col-span-2 space-y-6">
          {/* Job Details */}
          <section className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-5" aria-label="Job details">
            <h2 className="text-sm font-semibold text-white/60 mb-4">Job Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Waste Types</p>
                <div className="flex flex-wrap gap-1.5">
                  {quote.waste_types.map((wt) => (
                    <span key={wt} className="text-xs px-2 py-1 rounded bg-white/[0.06] text-white/70">
                      {WASTE_TYPE_INFO[wt]?.icon} {WASTE_TYPE_INFO[wt]?.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Load Size</p>
                  <p className="text-sm">{LOAD_SIZE_INFO[quote.load_size]?.label}</p>
                </div>
                <div>
                  <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Frequency</p>
                  <p className="text-sm">{FREQUENCY_INFO[quote.frequency]?.label}</p>
                </div>
                {quote.time_slot && (
                  <div>
                    <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Time Slot</p>
                    <p className="text-sm flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-white/40" aria-hidden="true" />
                      {TIME_SLOT_INFO[quote.time_slot]?.label}
                    </p>
                  </div>
                )}
                {quote.preferred_date && (
                  <div>
                    <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Preferred Date</p>
                    <p className="text-sm flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-white/40" aria-hidden="true" />
                      {quote.preferred_date}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Address</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(quote.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-[#FF6B00] flex items-start gap-1.5"
                >
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                  {quote.address}
                </a>
              </div>
              {quote.distance_miles && (
                <p className="text-xs text-white/40">Distance: {quote.distance_miles} miles</p>
              )}
            </div>
          </section>

          {/* Pricing */}
          <section className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-5" aria-label="Pricing">
            <h2 className="text-sm font-semibold text-white/60 mb-3">Pricing</h2>
            <div className="flex items-baseline gap-6">
              <div>
                <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Estimate Range</p>
                <p className="text-lg font-bold">${quote.estimated_price_min} – ${quote.estimated_price_max}</p>
              </div>
              {quote.admin_adjusted_price && (
                <div>
                  <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Adjusted Price</p>
                  <p className="text-lg font-bold text-[#FF6B00]">${quote.admin_adjusted_price}</p>
                </div>
              )}
            </div>
          </section>

          {/* Activity Log */}
          <section className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-5" aria-label="Activity log">
            <h2 className="text-sm font-semibold text-white/60 mb-3">Activity</h2>
            <div className="space-y-2">
              {[...quote.activity_log].reverse().map((entry) => (
                <div key={entry.id} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-white/20 mt-1.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-white/70">{entry.content}</p>
                    <p className="text-[11px] text-white/30">
                      {entry.author} &middot; {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Customer sidebar */}
        <aside className="space-y-4" aria-label="Customer contact">
          <section className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-5">
            <h2 className="text-sm font-semibold text-white/60 mb-3">Customer</h2>
            <p className="text-sm font-medium mb-2">
              {quote.customer_id ? (
                <Link href={`/admin/customers/${quote.customer_id}`} className="text-white hover:text-[#FF6B00] transition-colors">
                  {quote.customer_name}
                </Link>
              ) : (
                quote.customer_name
              )}
            </p>
            <div className="space-y-2">
              <a href={`tel:${quote.customer_phone}`} className="flex items-center gap-1.5 text-sm text-white/60 hover:text-[#FF6B00] transition-colors">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {formatPhone(quote.customer_phone)}
              </a>
              <a href={`mailto:${quote.customer_email}`} className="flex items-center gap-1.5 text-sm text-white/60 hover:text-[#FF6B00] transition-colors">
                <Mail className="h-4 w-4" aria-hidden="true" />
                {quote.customer_email}
              </a>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
