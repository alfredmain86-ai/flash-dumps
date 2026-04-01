'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, MapPin, Truck, Clock, DollarSign } from 'lucide-react';
import { useAdminStore } from '@/store/admin';
import { formatCurrency, formatPhone } from '@/lib/constants';
import { Badge } from '@/components/ui';
import StatusTimeline from '@/components/admin/StatusTimeline';
import { WASTE_TYPE_INFO, LOAD_SIZE_INFO, TIME_SLOT_INFO } from '@/types';
import type { BookingStatus } from '@/types';

function statusBadgeVariant(s: BookingStatus) {
  const map: Record<BookingStatus, string> = {
    completed: 'completed', confirmed: 'confirmed', scheduled: 'pending',
    en_route: 'in-progress', arrived: 'in-progress', loading: 'in-progress', cancelled: 'cancelled',
  };
  return (map[s] ?? 'default') as 'completed' | 'confirmed' | 'pending' | 'in-progress' | 'cancelled' | 'default';
}

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { bookings, customers, trucks, updateBooking } = useAdminStore();

  const booking = bookings.find((b) => b.id === id);
  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-white/40 text-lg mb-4">Booking not found</p>
        <Link href="/admin/schedule" className="text-[#FF6B00] hover:underline text-sm">Back to Schedule</Link>
      </div>
    );
  }

  const customer = booking.customer ?? customers.find((c) => c.id === booking.customer_id);
  const truck = booking.truck ?? trucks.find((t) => t.id === booking.truck_id);

  const handleStatusChange = (status: BookingStatus) => {
    updateBooking(booking.id, { status, updated_at: new Date().toISOString() });
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
          <h1 className="text-2xl font-bold">Booking #{booking.id.split('-').pop()}</h1>
          <p className="text-sm text-white/40">{booking.scheduled_date}</p>
        </div>
        <Badge variant={statusBadgeVariant(booking.status)}>
          {booking.status.replace('_', ' ')}
        </Badge>
      </div>

      {/* Status Timeline */}
      <section className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-5 mb-6" aria-label="Job status">
        <h2 className="text-sm font-semibold text-white/60 mb-4">Status</h2>
        <StatusTimeline
          status={booking.status}
          onStatusChange={handleStatusChange}
        />
      </section>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Customer */}
        <section className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-5" aria-label="Customer info">
          <h2 className="text-sm font-semibold text-white/60 mb-3">Customer</h2>
          {customer ? (
            <div className="space-y-2">
              <Link href={`/admin/customers/${customer.id}`} className="text-sm font-medium text-white hover:text-[#FF6B00] transition-colors">
                {customer.name}
              </Link>
              {customer.company_name && <p className="text-xs text-white/40">{customer.company_name}</p>}
              <a href={`tel:${customer.phone}`} className="flex items-center gap-1.5 text-sm text-white/60 hover:text-[#FF6B00] min-h-[44px]">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {formatPhone(customer.phone)}
              </a>
            </div>
          ) : (
            <p className="text-sm text-white/40">Customer ID: {booking.customer_id}</p>
          )}
        </section>

        {/* Location */}
        <section className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-5" aria-label="Location">
          <h2 className="text-sm font-semibold text-white/60 mb-3">Location</h2>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(booking.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 text-sm text-white/70 hover:text-[#FF6B00] transition-colors"
          >
            <MapPin className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
            {booking.address}
          </a>
        </section>
      </div>

      {/* Job Details */}
      <section className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-5 mb-6" aria-label="Job details">
        <h2 className="text-sm font-semibold text-white/60 mb-4">Job Details</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Waste Types</p>
            <div className="flex flex-wrap gap-1">
              {booking.waste_types.map((wt) => (
                <span key={wt} className="text-xs px-2 py-0.5 rounded bg-white/[0.06] text-white/70">
                  {WASTE_TYPE_INFO[wt]?.icon} {wt.split('_')[0]}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Load Size</p>
            <p className="text-sm font-medium">{LOAD_SIZE_INFO[booking.load_size]?.label}</p>
          </div>
          <div>
            <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Time Slot</p>
            <p className="text-sm font-medium flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-white/40" aria-hidden="true" />
              {TIME_SLOT_INFO[booking.time_slot]?.label}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Truck</p>
            <p className="text-sm font-medium flex items-center gap-1">
              <Truck className="h-3.5 w-3.5 text-white/40" aria-hidden="true" />
              {truck?.name ?? 'Unassigned'}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-5 mb-6" aria-label="Pricing">
        <h2 className="text-sm font-semibold text-white/60 mb-3 flex items-center gap-2">
          <DollarSign className="h-4 w-4" aria-hidden="true" />
          Pricing
        </h2>
        <div className="flex items-baseline gap-4">
          <div>
            <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Estimated</p>
            <p className="text-xl font-bold">{formatCurrency(booking.estimated_price)}</p>
          </div>
          {booking.final_price && (
            <div>
              <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Final</p>
              <p className="text-xl font-bold text-[#22C55E]">{formatCurrency(booking.final_price)}</p>
            </div>
          )}
          {booking.actual_weight && (
            <div>
              <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Weight</p>
              <p className="text-sm font-medium">{booking.actual_weight} tons</p>
            </div>
          )}
        </div>
      </section>

      {/* Special Instructions */}
      {booking.special_instructions && (
        <section className="rounded-xl bg-[#FFB800]/5 border border-[#FFB800]/15 p-5 mb-6" aria-label="Special instructions">
          <h2 className="text-sm font-semibold text-[#FFB800] mb-2">Special Instructions</h2>
          <p className="text-sm text-white/70">{booking.special_instructions}</p>
        </section>
      )}
    </div>
  );
}
